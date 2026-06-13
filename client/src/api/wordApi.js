import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const addWord = async (word) => {
  const { data } = await api.post('/words', { word })
  return data
}

export const listWords = async (search = '', page = 1, limit = 50) => {
  const params = { search, page, limit }
  const { data } = await api.get('/words', { params })
  return data
}

export const getReviewWords = async () => {
  const { data } = await api.get('/words/review')
  return data
}

export const reviewWord = async (id, gotItRight) => {
  const { data } = await api.put(`/words/${id}/review`, { gotItRight })
  return data
}

export const advanceTime = async () => {
  const { data } = await api.post('/dev/advance')
  return data
}

export const toggleDevMode = async (enabled) => {
  const { data } = await api.post('/dev/mode', { enabled })
  return data
}

export const getDevMode = async () => {
  const { data } = await api.get('/dev/mode')
  return data
}
