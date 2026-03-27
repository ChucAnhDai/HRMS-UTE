import { describe, it, expect, vi, beforeEach } from 'vitest'
import { leaveService } from '../leave-service'
import { leaveRepo } from '../../repositories/leave-repo'

// Mock the repo
vi.mock('../../repositories/leave-repo', () => ({
  leaveRepo: {
    getLeaveRequestById: vi.fn(),
    updateLeaveStatus: vi.fn()
  }
}))

describe('LeaveService - approveLeave', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should throw error if leave request not found', async () => {
    vi.mocked(leaveRepo.getLeaveRequestById).mockResolvedValue(null)

    await expect(leaveService.approveLeave(999)).rejects.toThrow('Không tìm thấy đơn nghỉ phép')
  })

  it('should throw error if status is not Pending', async () => {
    vi.mocked(leaveRepo.getLeaveRequestById).mockResolvedValue({
      id: 1,
      status: 'Rejected',
      end_date: '2026-12-31'
    } as unknown as { id: number; status: string; end_date: string })

    await expect(leaveService.approveLeave(1)).rejects.toThrow('Chỉ có thể duyệt đơn ở trạng thái "Chờ duyệt"')
  })

  it('should return warning for expired leave when forceApprove is false', async () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 5) // 5 days ago
    
    vi.mocked(leaveRepo.getLeaveRequestById).mockResolvedValue({
      id: 1,
      status: 'Pending',
      start_date: pastDate.toISOString().split('T')[0],
    } as unknown as { id: number; status: string; start_date: string; end_date: string })

    const result = await leaveService.approveLeave(1)
    
    expect(result).toEqual(expect.objectContaining({
      warning: true,
      leaveId: 1
    }))
    expect(leaveRepo.updateLeaveStatus).not.toHaveBeenCalled()
  })

  it('should approve directly for future leave', async () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 5) // 5 days in future
    
    vi.mocked(leaveRepo.getLeaveRequestById).mockResolvedValue({
      id: 1,
      status: 'Pending',
      start_date: futureDate.toISOString().split('T')[0],
      end_date: futureDate.toISOString().split('T')[0]
    } as unknown as { id: number; status: string; start_date: string; end_date: string })

    await leaveService.approveLeave(1, 123)
    
    expect(leaveRepo.updateLeaveStatus).toHaveBeenCalledWith(1, 'Approved', 123)
  })

  it('should approve expired leave if forceApprove is true', async () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 5)
    
    vi.mocked(leaveRepo.getLeaveRequestById).mockResolvedValue({
      id: 1,
      status: 'Pending',
      start_date: pastDate.toISOString().split('T')[0],
      end_date: pastDate.toISOString().split('T')[0]
    } as unknown as { id: number; status: string; start_date: string; end_date: string })

    await leaveService.approveLeave(1, 123, true)
    
    expect(leaveRepo.updateLeaveStatus).toHaveBeenCalledWith(1, 'Approved', 123)
  })
})
