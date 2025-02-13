import { Header } from "@/components/header";
import { TraderProfile } from "@/components/trader-profile";
import { Suspense } from "react";

export default function TraderPage({ params }: { params: { address: string } }) {
  return (
    <div className="min-h-screen  ">
      <Header />
      <main className="container mx-auto px-4 py-8 ">
      <Suspense>
      <TraderProfile address={params.address} />
        </Suspense>
      </main>
    </div>
  )
}

