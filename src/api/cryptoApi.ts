import axios from 'axios'
import type { Coin, RiskScore, ApiResponse } from '../types/crypto'
import { API_CONFIG } from '../config'

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    limit: number
    start: number
    returned: number
    hasMore: boolean
  }
}

export const cryptoApi = {
  async getCoinsPaginated(start: number = 0, limit: number = 100): Promise<PaginatedResponse<Coin>> {
    const response = await apiClient.get<PaginatedResponse<Coin>>('/api/coins', {
      params: { limit, start }
    })
    return response.data
  },

  async getCoinRisk(coinId: string): Promise<RiskScore> {
    const response = await apiClient.get<ApiResponse<RiskScore>>(`/api/risk/${coinId}`)
    return response.data.data
  },

  async getCoinDetails(coinId: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`/api/coin/${coinId}`)
    return response.data.data
  },

  async getHistoricalData(coinId: string, days: number = 7): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`/api/historical/${coinId}`, {
      params: { days }
    })
    return response.data.data
  }
}
