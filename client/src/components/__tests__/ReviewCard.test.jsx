import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ReviewCard from '../ReviewCard'

const mockWord = {
  _id: '1',
  word: 'serendipity',
  definition: 'The occurrence of events by chance in a happy way',
  example: 'Finding that book was pure serendipity.',
}

describe('ReviewCard', () => {
  it('renders the word', () => {
    render(<ReviewCard word={mockWord} onReview={() => {}} isLoading={false} />)
    expect(screen.getByText('serendipity')).toBeInTheDocument()
  })

  it('hides definition initially', () => {
    render(<ReviewCard word={mockWord} onReview={() => {}} isLoading={false} />)
    expect(screen.queryByText(mockWord.definition)).not.toBeInTheDocument()
  })

  it('shows reveal button initially', () => {
    render(<ReviewCard word={mockWord} onReview={() => {}} isLoading={false} />)
    expect(screen.getByRole('button', { name: 'Reveal Definition' })).toBeInTheDocument()
  })

  it('shows definition after reveal', async () => {
    const user = userEvent.setup()
    render(<ReviewCard word={mockWord} onReview={() => {}} isLoading={false} />)

    await user.click(screen.getByRole('button', { name: 'Reveal Definition' }))

    expect(screen.getByText(mockWord.definition)).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes(mockWord.example))).toBeInTheDocument()
  })

  it('shows Got It Right and Needs Work buttons after reveal', async () => {
    const user = userEvent.setup()
    render(<ReviewCard word={mockWord} onReview={() => {}} isLoading={false} />)

    await user.click(screen.getByRole('button', { name: 'Reveal Definition' }))

    expect(screen.getByRole('button', { name: 'Needs Work' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Got It Right' })).toBeInTheDocument()
  })

  it('calls onReview with true when Got It Right clicked', async () => {
    const user = userEvent.setup()
    const onReview = vi.fn()
    render(<ReviewCard word={mockWord} onReview={onReview} isLoading={false} />)

    await user.click(screen.getByRole('button', { name: 'Reveal Definition' }))
    await user.click(screen.getByRole('button', { name: 'Got It Right' }))

    expect(onReview).toHaveBeenCalledWith(true)
  })

  it('calls onReview with false when Needs Work clicked', async () => {
    const user = userEvent.setup()
    const onReview = vi.fn()
    render(<ReviewCard word={mockWord} onReview={onReview} isLoading={false} />)

    await user.click(screen.getByRole('button', { name: 'Reveal Definition' }))
    await user.click(screen.getByRole('button', { name: 'Needs Work' }))

    expect(onReview).toHaveBeenCalledWith(false)
  })

  it('disables review buttons when loading', async () => {
    const user = userEvent.setup()
    render(<ReviewCard word={mockWord} onReview={() => {}} isLoading={true} />)

    await user.click(screen.getByRole('button', { name: 'Reveal Definition' }))

    const needsWork = screen.getByRole('button', { name: 'Processing...' })
    const gotItRight = screen.getByRole('button', { name: 'Saving' })
    expect(needsWork).toBeDisabled()
    expect(gotItRight).toBeDisabled()
  })

  it('returns null when no word provided', () => {
    const { container } = render(<ReviewCard word={null} onReview={() => {}} isLoading={false} />)
    expect(container.innerHTML).toBe('')
  })
})
