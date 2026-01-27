'use server'

import { getCurrentUser } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase.server'
import { revalidatePath } from 'next/cache'

export async function checkInAction() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.employeeId) {
      return { success: false, error: 'Vui lòng đăng nhập' }
    }

    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // Kiểm tra xem hôm nay đã check in chưa
    const { data: existing } = await supabase
      .from('attendances')
      .select('*')
      .eq('employee_id', currentUser.employeeId)
      .eq('date', today)
      .single()

    if (existing) {
      return { success: false, error: 'Bạn đã check in hôm nay rồi!' }
    }

    // Tạo bản ghi attendance mới
    const now = new Date()
    const time = now.toTimeString().split(' ')[0] // HH:mm:ss

    const { error } = await supabase
      .from('attendances')
      .insert({
        employee_id: currentUser.employeeId,
        date: today,
        check_in_time: time,
        status: 'Present'
      })

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/calendar')
    return { 
      success: true, 
      message: `Check in thành công lúc ${now.toLocaleTimeString('vi-VN')}!` 
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Có lỗi xảy ra' }
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

    // Tìm bản ghi attendance hôm nay
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

    // Cập nhật check_out
    const now = new Date()
    const time = now.toTimeString().split(' ')[0]

    const { error } = await supabase
      .from('attendances')
      .update({ check_out_time: time })
      .eq('id', existing.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/calendar')
    return { 
      success: true, 
      message: `Check out thành công lúc ${now.toLocaleTimeString('vi-VN')}!` 
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Có lỗi xảy ra' }
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
  } catch (error) {
    return null
  }
}
