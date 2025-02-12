import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-gray-800 ">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 w-52 h-14 relative">
              <Image
                src="/logo.png"
                alt="Potion"
                className="h-10 w-10"
                fill
              />
              
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/leaderboards" className=" hover:text-purple-500">
                Leaderboards
              </Link>
              <Link href="/learn" className=" hover:text-purple-500">
                Learn
              </Link>
              <Link href="/prizes" className=" hover:text-purple-500">
                Prizes
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

