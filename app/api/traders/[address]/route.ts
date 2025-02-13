import { NextResponse } from "next/server"
import { generateMockProfile } from "@/lib/mock-data"

export async function GET(request: Request, { params }: { params: { address: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data for the trader profile
  const mock_profile = generateMockProfile();
  const prof = {...mock_profile,address: params.address,}

  return NextResponse.json(prof)
}

