import { Leaderboard } from "@/components/leaderboard"
import { Header } from "@/components/header"
import { Suspense } from "react"

export default function Home() {
  return (
    <div className="min-h-screen  ">
      <Header />
      <main className="container mx-auto px-4 py-8 ">
      <Suspense>
        <Leaderboard />
        </Suspense>
      </main>
    </div>
  )
}

