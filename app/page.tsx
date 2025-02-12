import { Leaderboard } from "@/components/leaderboard"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen  ">
      <Header />
      <main className="container mx-auto px-4 py-8 ">
        <Leaderboard />
      </main>
    </div>
  )
}

