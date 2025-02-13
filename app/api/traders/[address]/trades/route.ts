import { NextResponse } from "next/server"
import type { Trade } from "@/types/trader-profile"
import { generateMockTrades } from "@/lib/mock-data";

export async function GET(request: Request) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Get search params
  const { searchParams } = new URL(request.url)

  // Generate initial trades
  let trades = generateMockTrades(30);

  // Define filterable parameters for direct numeric values
  const filterParams = [
    "marketCap", 
    "invested", 
    "holding",
    "avgBuy", 
    "avgSell", 
    "roi"
  ]

  // Apply filters for numeric values
  filterParams.forEach((param) => {
    const minValue = searchParams.get(`${param}_min`)
    const maxValue = searchParams.get(`${param}_max`)

    if (minValue || maxValue) {
      trades = trades.filter((trade) => {
        let tradeValue: number

        if (param === "roi") {
          tradeValue = trade.roi
        } else {
          // For other numeric fields, access them directly
          tradeValue = trade[param as keyof Trade] as number
        }

        if (minValue && maxValue) {
          return tradeValue >= Number(minValue) && tradeValue <= Number(maxValue)
        } else if (minValue) {
          return tradeValue >= Number(minValue)
        } else if (maxValue) {
          return tradeValue <= Number(maxValue)
        }

        return true
      })
    }
  })

  // Filter for lastTrade (in minutes)
  const lastTradeMin = searchParams.get('lastTrade_min')
  const lastTradeMax = searchParams.get('lastTrade_max')

  if (lastTradeMin || lastTradeMax) {
    trades = trades.filter((trade) => {
      // Convert "X min" to number
      const minutes = parseInt(trade.lastTrade.split(' ')[0])
      
      if (lastTradeMin && lastTradeMax) {
        return minutes >= Number(lastTradeMin) && minutes <= Number(lastTradeMax)
      } else if (lastTradeMin) {
        return minutes >= Number(lastTradeMin)
      } else if (lastTradeMax) {
        return minutes <= Number(lastTradeMax)
      }
      return true
    })
  }

  // Filter for held time (in minutes)
  const heldMin = searchParams.get('held_min')
  const heldMax = searchParams.get('held_max')

  if (heldMin || heldMax) {
    trades = trades.filter((trade) => {
      // Convert "X min" to number
      const minutes = parseInt(trade.held.split(' ')[0])
      
      if (heldMin && heldMax) {
        return minutes >= Number(heldMin) && minutes <= Number(heldMax)
      } else if (heldMin) {
        return minutes >= Number(heldMin)
      } else if (heldMax) {
        return minutes <= Number(heldMax)
      }
      return true
    })
  }

  // Filter for realizedPNL value
  const realizedPNLMin = searchParams.get('realizedPNL_min')
  const realizedPNLMax = searchParams.get('realizedPNL_max')

  if (realizedPNLMin || realizedPNLMax) {
    trades = trades.filter((trade) => {
      const pnlValue = trade.realizedPNL.value
      
      if (realizedPNLMin && realizedPNLMax) {
        return pnlValue >= Number(realizedPNLMin) && pnlValue <= Number(realizedPNLMax)
      } else if (realizedPNLMin) {
        return pnlValue >= Number(realizedPNLMin)
      } else if (realizedPNLMax) {
        return pnlValue <= Number(realizedPNLMax)
      }
      return true
    })
  }

  // Additional filter for win rate
  const winRateMin = searchParams.get('winRate_min')
  const winRateMax = searchParams.get('winRate_max')

  if (winRateMin || winRateMax) {
    trades = trades.filter((trade) => {
      const winRate = (trade.trades.won / trade.trades.total) * 100
      
      if (winRateMin && winRateMax) {
        return winRate >= Number(winRateMin) && winRate <= Number(winRateMax)
      } else if (winRateMin) {
        return winRate >= Number(winRateMin)
      } else if (winRateMax) {
        return winRate <= Number(winRateMax)
      }
      return true
    })
  }

  // Additional filter for PNL percentage
  const pnlPercentageMin = searchParams.get('pnlPercentage_min')
  const pnlPercentageMax = searchParams.get('pnlPercentage_max')

  if (pnlPercentageMin || pnlPercentageMax) {
    trades = trades.filter((trade) => {
      const percentage = trade.realizedPNL.percentage
      
      if (pnlPercentageMin && pnlPercentageMax) {
        return percentage >= Number(pnlPercentageMin) && percentage <= Number(pnlPercentageMax)
      } else if (pnlPercentageMin) {
        return percentage >= Number(pnlPercentageMin)
      } else if (pnlPercentageMax) {
        return percentage <= Number(pnlPercentageMax)
      }
      return true
    })
  }

  return NextResponse.json(trades)
}

