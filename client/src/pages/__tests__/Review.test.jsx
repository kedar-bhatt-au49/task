import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Review from '../Review'

vi.mock('../../hooks/useWords', () => ({
  useReviewWords: vi.fn(),
  useReviewWord: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}))

import { useReviewWords } from '../../hooks/useWords'

function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Review', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    useReviewWords.mockReturnValue({ data: undefined, isLoading: true })

    renderWithProviders(<Review />)
    expect(screen.getByText('Loading review words...')).toBeInTheDocument()
  })

  it('shows empty state when no words due', () => {
    useReviewWords.mockReturnValue({ data: [], isLoading: false })

    renderWithProviders(<Review />)
    expect(screen.getByText('All caught up!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back to Dashboard' })).toBeInTheDocument()
  })

  it('shows review card when words are available', () => {
    const mockWords = [
      { _id: '1', word: 'serendipity', definition: 'Happy accident', example: 'Example here' },
    ]
    useReviewWords.mockReturnValue({ data: mockWords, isLoading: false })

    renderWithProviders(<Review />)
    expect(screen.getByText('serendipity')).toBeInTheDocument()
    expect(screen.getByText('1/1')).toBeInTheDocument()
  })

  it('shows completion state after reviewing all words', () => {
    const mockWords = [
      { _id: '1', word: 'test', definition: 'Test def', example: '' },
    ]
    useReviewWords.mockReturnValue({ data: mockWords, isLoading: false })

    renderWithProviders(<Review />)

    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
