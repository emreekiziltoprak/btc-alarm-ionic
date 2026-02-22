export interface Coin {
  id: string
  name: string
  symbol: string
  rank: number
  logo?: string
}

export interface RiskScore {
  coinId: string
  coinName: string
  coinSymbol: string
  finalRisk: number
  softRisk: number
  hardPenalty: number
  liquidityWeakness: number
  volumeDropRisk: number
  volumePumpRisk: number
  volumeRatio: number
  volume_24h: number
  market_cap: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
  error?: string
}
