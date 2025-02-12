import { generateMockTraders } from "@/lib/mock-data"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Get search params
  const { searchParams } = new URL(request.url)

  // Filter traders based on search
  let traders = generateMockTraders(30)

  const filterParams = ["rank", "followers", "tokens", "winRate", "avgBuy", "avgEntry", "realizedPNL"]

  filterParams.forEach((param) => {
    const minValue = searchParams.get(`${param}_min`)
    const maxValue = searchParams.get(`${param}_max`)

    if (minValue || maxValue) {
      traders = traders.filter((trader) => {
        let traderValue: number

        if (param === "winRate") {
          traderValue = trader[param]
        } else if (param === "followers" || param === "tokens") {
          traderValue = trader[param]
        } else if (param === "avgBuy" || param === "avgEntry" || param === "realizedPNL") {
          traderValue = trader[param]
        } else if (param === "rank") {
          traderValue = trader[param]
        } else {
          return true // Skip filtering for unknown params
        }

        if (minValue && maxValue) {
          return traderValue >= Number(minValue) && traderValue <= Number(maxValue)
        } else if (minValue) {
          return traderValue >= Number(minValue)
        } else if (maxValue) {
          return traderValue <= Number(maxValue)
        }

        return true
      })
    }
  })


  return NextResponse.json(traders)
}

