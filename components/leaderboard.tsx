"use client"

import { useState, useEffect } from "react"
import { TradersTable } from "./traders-table"
import type { Trader } from "@/types/trader"
import { useRouter, useSearchParams } from "next/navigation"
import { FilterValues } from "./filter-form"

const initialFilters: FilterValues = {
  rank: { min: "", max: "" },
  followers: { min: "", max: "" },
  tokens: { min: "", max: "" },
  winRate: { min: "", max: "" },
  avgBuy: { min: "", max: "" },
  avgEntry: { min: "", max: "" },
  realizedPNL: { min: "", max: "" },
}

export function Leaderboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [traders, setTraders] = useState<Trader[]>([])
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
    fetchTraders(initialFilters)
  }, []) 

  const fetchTraders = async (currentFilters: FilterValues) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value.min) params.append(`${key}_min`, value.min)
        if (value.max) params.append(`${key}_max`, value.max)
      })
      const res = await fetch(`/api/traders?${params}`)
      if (!res.ok) throw new Error("Failed to fetch traders")
      const data = await res.json()
      setTraders(data)
      setError(null)
    } catch (err) {
      setError("Failed to load traders")
      console.error(err)
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
    fetchTraders(userFilters)
    router.push(`?${params.toString()}`)
  }

  return (
      <TradersTable traders={traders} loading={loading} error={error} applyFilters={applyFilters} filters={filters} />
  )
}

