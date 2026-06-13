import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Toast from '../Toast'

describe('Toast', () => {
  it('renders message', () => {
    render(<Toast message="Success!" type="success" onClose={() => {}} />)
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<Toast message="Test" type="success" onClose={() => {}} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const user = (await import('@testing-library/user-event')).default
    const onClose = vi.fn()
    render(<Toast message="Test" type="success" onClose={onClose} />)

    await user.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalled()
  })

  it('auto-dismisses after 3 seconds', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<Toast message="Test" type="success" onClose={onClose} />)

    vi.advanceTimersByTime(3000)
    expect(onClose).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('renders with error type styling', () => {
    const { container } = render(<Toast message="Error" type="error" onClose={() => {}} />)
    expect(container.firstChild).toHaveClass('from-red-500')
  })

  it('renders with success type styling', () => {
    const { container } = render(<Toast message="Success" type="success" onClose={() => {}} />)
    expect(container.firstChild).toHaveClass('from-emerald-500')
  })
})
