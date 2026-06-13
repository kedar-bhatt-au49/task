import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from '../Dashboard'

vi.mock('../../hooks/useWords', () => ({
  useWords: vi.fn(),
  useAddWord: vi.fn(),
  useDevMode: vi.fn(),
  useToggleDevMode: vi.fn(),
  useAdvanceTime: vi.fn(),
  useReviewWords: vi.fn(),
}))

import { useWords, useAddWord, useDevMode, useToggleDevMode, useAdvanceTime, useReviewWords } from '../../hooks/useWords'

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useWords.mockReturnValue({ data: [], isLoading: false, isFetching: false })
    useAddWord.mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
    useDevMode.mockReturnValue({ data: { devMode: false } })
    useToggleDevMode.mockReturnValue({ mutateAsync: vi.fn() })
    useAdvanceTime.mockReturnValue({ mutateAsync: vi.fn() })
    useReviewWords.mockReturnValue({ data: [] })
  })

  it('renders the heading', () => {
    renderDashboard()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders the add word form', () => {
    renderDashboard()
    expect(screen.getByPlaceholderText('Enter a word (e.g. serendipity)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Word' })).toBeInTheDocument()
  })

  it('shows no words message when empty', () => {
    renderDashboard()
    expect(screen.getByText('Your vocabulary is empty')).toBeInTheDocument()
  })

  it('shows search input', () => {
    renderDashboard()
    expect(screen.getByPlaceholderText('Search words...')).toBeInTheDocument()
  })

  it('renders DevModeToggle', () => {
    renderDashboard()
    expect(screen.getByText('Dev Mode')).toBeInTheDocument()
  })

  it('shows due words banner when words are due', () => {
    useReviewWords.mockReturnValue({
      data: [
        { _id: '1', word: 'due1', definition: 'test' },
        { _id: '2', word: 'due2', definition: 'test' },
      ],
    })
    useWords.mockReturnValue({
      data: { words: [
        { _id: '1', word: 'due1', definition: 'test', nextReviewAt: new Date(Date.now() - 3600000).toISOString(), reviewCount: 0 },
        { _id: '2', word: 'due2', definition: 'test', nextReviewAt: new Date(Date.now() - 3600000).toISOString(), reviewCount: 1 },
      ], total: 2, totalPages: 1 },
      isLoading: false,
      isFetching: false,
    })
    renderDashboard()
    expect(screen.getByText(/2 words due for review/)).toBeInTheDocument()
  })
})
