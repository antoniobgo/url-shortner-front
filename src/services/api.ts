import axios from 'axios'
import type { ShortenUrlResponse } from '../types'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
})

export const urlService = {
  async shortenUrl(url: string): Promise<ShortenUrlResponse> {
    const { data } = await api.post<ShortenUrlResponse>('/api/shorten', { url })
    return data
  }
}