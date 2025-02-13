"use client"

import { TraderInfo } from "./trader-info"
import { TradeList } from "./trade-list"
import { useState, useEffect } from "react"
import type { Trade } from "@/types/trader-profile"
import { FilterValues } from "../filter-form"
import { useRouter, useSearchParams } from "next/navigation"

interface TraderProfileProps {
  address: string
  modal?:boolean
}

const initialFilters:FilterValues = {
  lastTrade: { min: "", max: "" },
  marketCap: { min: "", max: "" },
  invested: { min: "", max: "" },
  realizedPNL: { min: "", max: "" },
  roi: { min: "", max: "" },
  holding: { min: "", max: "" },
  avgBuy: { min: "", max: "" },
  avgSell: { min: "", max: "" },
  held: { min: "", max: "" },
}

export function TraderProfile({ address,modal=false }: TraderProfileProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterValues>(initialFilters)

  useEffect(() => {
    const urlFilters: FilterValues = { ...initialFilters }
    searchParams.forEach((value, key) => {
      const [filterKey, subKey] = key.split("_")
      if (filterKey in urlFilters && (subKey === "min" || subKey === "max")) {
        urlFilters[filterKey as keyof FilterValues][subKey] = value
      }
    })
    setFilters(initialFilters)
    fetchTrades(initialFilters)
  }, [])

  const fetchTrades = async (currentFilters: FilterValues) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value.min) params.append(`${key}_min`, value.min)
        if (value.max) params.append(`${key}_max`, value.max)
      })
      const res = await fetch(`/api/traders/${address}/trades?${params}`)
      if (!res.ok) throw new Error("Failed to fetch trades")
      const data = await res.json()
      setTrades(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load trades")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (userFilters:FilterValues) => {
    const params = new URLSearchParams()
    Object.entries(userFilters).forEach(([key, value]) => {
      if (value.min) params.append(`${key}_min`, value.min)
      if (value.max) params.append(`${key}_max`, value.max)
    })
    setFilters(userFilters)
    fetchTrades(userFilters)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-8 overflow-x-hidden">
      <TraderInfo address={address} />
      <TradeList
        trades={trades}
        loading={loading}
        error={error}
        filters={filters}
        modal={modal}
        applyFilters={applyFilters}
        address={address}
      />
    </div>
  )
}

