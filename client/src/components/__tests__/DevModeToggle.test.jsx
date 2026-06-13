import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import DevModeToggle from '../DevModeToggle'

describe('DevModeToggle', () => {
  it('renders dev mode heading', () => {
    render(<DevModeToggle devMode={false} onToggle={() => {}} onAdvance={() => {}} />)
    expect(screen.getByText('Dev Mode')).toBeInTheDocument()
  })

  it('shows day intervals when dev mode is off', () => {
    render(<DevModeToggle devMode={false} onToggle={() => {}} onAdvance={() => {}} />)
    expect(screen.getByText(/Review intervals in days/)).toBeInTheDocument()
  })

  it('shows minute intervals when dev mode is on', () => {
    render(<DevModeToggle devMode={true} onToggle={() => {}} onAdvance={() => {}} />)
    expect(screen.getByText(/Review intervals in minutes/)).toBeInTheDocument()
  })

  it('shows advance time button when dev mode is on', () => {
    render(<DevModeToggle devMode={true} onToggle={() => {}} onAdvance={() => {}} />)
    expect(screen.getByRole('button', { name: /Advance Time/ })).toBeInTheDocument()
  })

  it('hides advance time button when dev mode is off', () => {
    render(<DevModeToggle devMode={false} onToggle={() => {}} onAdvance={() => {}} />)
    expect(screen.queryByRole('button', { name: /Advance Time/ })).not.toBeInTheDocument()
  })

  it('calls onToggle when checkbox clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<DevModeToggle devMode={false} onToggle={onToggle} onAdvance={() => {}} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('calls onAdvance when advance button clicked', async () => {
    const user = userEvent.setup()
    const onAdvance = vi.fn()
    render(<DevModeToggle devMode={true} onToggle={() => {}} onAdvance={onAdvance} />)

    await user.click(screen.getByRole('button', { name: /Advance Time/ }))

    expect(onAdvance).toHaveBeenCalled()
  })
})
