export interface Trader {
  rank: number
  name: string
  address: string
  avatar: string
  followers: number
  handle: string
  tokens: number
  winRate: number
  trades: {
    won: number
    total: number
  }
  avgBuy: number
  avgEntry: number
  avgHold: string
  realizedPNL: number
}

