'use server'

import { getCurrentUser } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase.server'
import { revalidatePath } from 'next/cache'

import { settingRepo } from '@/server/repositories/setting-repo'

export async function checkInAction() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.employeeId) {
      return { success: false, error: 'Vui lòng đăng nhập' }
    }

    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // 1. Check existing check-in
    const { data: existing } = await supabase
      .from('attendances')
      .select('*')
      .eq('employee_id', currentUser.employeeId)
      .eq('date', today)
      .single()

    if (existing) {
      return { success: false, error: 'Bạn đã check in hôm nay rồi!' }
    }

    // 2. Settings & Logic
    const settings = await settingRepo.getSettings()
    const workStartTime = settings['work_start_time'] || '08:00:00'
    // Ensure format HH:mm:ss for comparison
    const workStartTimeFull = workStartTime.length === 5 ? `${workStartTime}:00` : workStartTime

    const now = new Date()
    const time = now.toTimeString().split(' ')[0] // HH:mm:ss
    
    let status: 'Present' | 'Late' = 'Present'
    if (time > workStartTimeFull) {
        status = 'Late'
    }

    // 3. Check Prev Day Checkout (Forgot Checkout)
    // Simple logic: Find last attendance record before today. If check_out_time is null -> Forgot.
    let forgotCheckout = false
    const { data: lastAttendance } = await supabase
        .from('attendances')
        .select('*')
        .eq('employee_id', currentUser.employeeId)
        .lt('date', today)
        .order('date', { ascending: false })
        .limit(1)
        .single()
    
    if (lastAttendance && !lastAttendance.check_out_time) {
        forgotCheckout = true
    }

    // 4. Insert
    const { error } = await supabase
      .from('attendances')
      .insert({
        employee_id: currentUser.employeeId,
        date: today,
        check_in_time: time,
        status: status
      })

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/calendar')
    
    return { 
      success: true, 
      status, // 'Late' or 'Present'
      forgotCheckout, // true/false
      message: `Check in thành công lúc ${now.toLocaleTimeString('vi-VN')}!` 
    }
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Có lỗi xảy ra' }
  }
}

export async function checkOutAction() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.employeeId) {
      return { success: false, error: 'Vui lòng đăng nhập' }
    }

    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabase
      .from('attendances')
      .select('*')
      .eq('employee_id', currentUser.employeeId)
      .eq('date', today)
      .single()

    if (!existing) {
      return { success: false, error: 'Bạn chưa check in hôm nay!' }
    }

    if (existing.check_out_time) {
      return { success: false, error: 'Bạn đã check out rồi!' }
    }

    // Update
    const now = new Date()
    const time = now.toTimeString().split(' ')[0]

    const { error } = await supabase
      .from('attendances')
      .update({ check_out_time: time })
      .eq('id', existing.id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Warning Logic
    const settings = await settingRepo.getSettings()
    const workEndTime = settings['work_end_time'] || '17:00:00'
    const workEndTimeFull = workEndTime.length === 5 ? `${workEndTime}:00` : workEndTime
    
    // Add 30 mins buffer? Or just strict? User said "Checkout quá muộn". 
    // Let's say if > 30 mins after end time.
    // Parsing time to minutes for comparison
    const [h, m] = time.split(':').map(Number)
    const [eh, em] = workEndTimeFull.split(':').map(Number)
    const currentMins = h * 60 + m
    const endMins = eh * 60 + em
    
    let warning = null
    if (currentMins > endMins + 30) {
        warning = 'Bạn đang về trễ hơn quy định. Nếu có làm thêm giờ, hãy nhớ đăng ký OT!'
    }

    revalidatePath('/calendar')
    return { 
      success: true, 
      warning,
      message: `Check out thành công lúc ${now.toLocaleTimeString('vi-VN')}!` 
    }
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Có lỗi xảy ra' }
  }
}

export async function getTodayAttendanceStatus() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.employeeId) {
      return null
    }

    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
      .from('attendances')
      .select('*')
      .eq('employee_id', currentUser.employeeId)
      .eq('date', today)
      .single()

    return data
  } catch {
    return null
  }
}
