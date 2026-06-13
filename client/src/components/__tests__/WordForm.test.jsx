import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import WordForm from '../WordForm'

describe('WordForm', () => {
  it('renders input and button', () => {
    render(<WordForm onAdd={() => {}} isLoading={false} />)

    expect(screen.getByPlaceholderText('Enter a word (e.g. serendipity)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Word' })).toBeInTheDocument()
  })

  it('calls onAdd with trimmed word on submit', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<WordForm onAdd={onAdd} isLoading={false} />)

    const input = screen.getByPlaceholderText('Enter a word (e.g. serendipity)')
    await user.type(input, 'serendipity')
    await user.click(screen.getByRole('button', { name: 'Add Word' }))

    expect(onAdd).toHaveBeenCalledWith('serendipity')
  })

  it('clears input after submit', async () => {
    const user = userEvent.setup()
    render(<WordForm onAdd={() => {}} isLoading={false} />)

    const input = screen.getByPlaceholderText('Enter a word (e.g. serendipity)')
    await user.type(input, 'hello')
    await user.click(screen.getByRole('button', { name: 'Add Word' }))

    expect(input).toHaveValue('')
  })

  it('does not call onAdd for empty input', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<WordForm onAdd={onAdd} isLoading={false} />)

    await user.click(screen.getByRole('button', { name: 'Add Word' }))
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('disables inputs when loading', () => {
    render(<WordForm onAdd={() => {}} isLoading={true} />)

    expect(screen.getByPlaceholderText('Enter a word (e.g. serendipity)')).toBeDisabled()
    expect(screen.getByRole('button', { name: /Adding/ })).toBeDisabled()
  })

  it('shows loading text when isLoading is true', () => {
    render(<WordForm onAdd={() => {}} isLoading={true} />)

    expect(screen.getByText('Adding')).toBeInTheDocument()
  })
})
