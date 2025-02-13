export interface TraderProfile {
    name: string
    address: string
    avatar: string
    handle: string
    followers: number
    lastTrade: {
      time: string
      type: "buy" | "sell"
    }
    tokens: {
      count: number
      avgPrice: number
    }
    winRate: number
    trades: {
      won: number
      total: number
    }
    avgEntry: number
    avgHold: string
    realizedPNL: {
      value: number
      percentage: number
    }
    totalInvested: number
    roi: number
  }
  
  export interface Trade {
    token: {
      name: string
      address: string
      avatar: string
    }
    lastTrade: string
    marketCap: number
    invested: number
    realizedPNL: {
      value: number
      percentage: number
    }
    roi: number
    trades: {
      won: number
      total: number
    }
    holding: number
    avgBuy: number
    avgSell: number
    held: string
  }
  
  export type TimeFilter = "Daily" | "Weekly" | "Monthly" | "All-Time"
  
  