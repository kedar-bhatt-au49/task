import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import * as wordApi from '../api/wordApi'

export function useWords(search, page = 1, limit = 50) {
  return useQuery({
    queryKey: ['words', search, page, limit],
    queryFn: () => wordApi.listWords(search, page, limit),
    placeholderData: keepPreviousData,
  })
}

export function useAddWord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: wordApi.addWord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
    },
  })
}

export function useReviewWords() {
  return useQuery({
    queryKey: ['reviewWords'],
    queryFn: wordApi.getReviewWords,
  })
}

export function useReviewWord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, gotItRight }) => wordApi.reviewWord(id, gotItRight),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewWords'] })
      queryClient.invalidateQueries({ queryKey: ['words'] })
    },
  })
}

export function useAdvanceTime() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: wordApi.advanceTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewWords'] })
      queryClient.invalidateQueries({ queryKey: ['words'] })
    },
  })
}

export function useDevMode() {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ['devMode'],
    queryFn: wordApi.getDevMode,
  })
}

export function useToggleDevMode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: wordApi.toggleDevMode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devMode'] })
    },
  })
}
