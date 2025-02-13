"use client";

import { useEffect, useState } from "react";
import {  CopyIcon, ExternalLink, RefreshCw } from "lucide-react";
import type { TraderProfile, TimeFilter } from "@/types/trader-profile";
import { formatMoney, SOL_PRICE, formatSolanaAddress } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";

interface TraderInfoProps {
  address: string;
}

export function TraderInfo({ address }: TraderInfoProps) {
  const [profile, setProfile] = useState<TraderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Daily");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  useEffect(() => {
    fetchProfile();
  }, [address]); // Removed timeFilter from dependencies

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/traders/${address}`);
      if (!res.ok) throw new Error("Failed to fetch trader profile");
      const data = await res.json();
      setProfile(data);
      setError(null);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error(err)
      setError("Failed to load trader profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-800 rounded-lg"></div>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-20 bg-gray-800 rounded-lg"></div>
          <div className="h-20 bg-gray-800 rounded-lg"></div>
          <div className="h-20 bg-gray-800 rounded-lg"></div>
          <div className="h-20 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex lg:flex-row flex-col lg:justify-between lg:items-end">
      <div className="flex flex-col items-start justify-between gap-4 lg:w-96 w-full">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar || "/placeholder.svg"}
            alt={profile.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="text-gray-500 flex gap-2">
              <div>{formatSolanaAddress(profile.address)}</div>
              <Button
                variant="ghost"
                size="icon"
                className="md:w-6 md:h-6 h-4 w-4"
                onClick={() => {
                  navigator.clipboard
                    .writeText(profile.address)
                    .then(() => {
                      toast({
                        description: "Address copied to clipboard",
                      });
                    })
                    .catch((err) => {
                      console.error("Failed to copy text: ", err);
                    });
                }}
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-gray-700/30 w-full  *:p-3 *:h-14 *:flex *:items-center *:justify-between">
          <div className=" border-b-2 border-b-gray-600 text-end">
            <span>X Account</span>
            <div>
              <div>{profile.handle}</div>
              <div className="lg:text-sm text-xs text-gray-500">
                {profile.followers.toLocaleString()} followers
              </div>
            </div>
          </div>
          <div className="">
            <span>Last Trade</span>
            <div className="flex items-center gap-1">
              {profile.lastTrade.time}
              <div className="relative w-4 h-4 flex items-end">
                <Image src={"/bullx-logo.jpg"} alt="solana logo" fill />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/** ------------------------------------------------------ */}
      <div className="flex flex-col items-start justify-between gap-4 w-full lg:ml-10 lg:mt-0 mt-4">
        <div className="w-full flex justify-between lg:flex-row flex-col">
          <div className="flex gap-2 ">
            {(["Daily", "Weekly", "Monthly", "All-Time"] as TimeFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`lg:px-4 lg:py-2 px-2 py-1 lg:text-sm text-xs rounded-full ${
                    timeFilter === filter
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
          <div className="flex justify-between items-center gap-2 lg:text-sm text-xs text-gray-500">
            <div>Last refreshed {lastRefreshed.toLocaleTimeString()}</div>
            <div>
              <button
                onClick={() => fetchProfile()}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-full">
                <ExternalLink className="h-4 w-4 text-purple-500" />
              </button>
            </div>
          </div>
        </div>
        {/** ------------------------------------------------------ */}
        <div className="grid grid-cols-2 lg:grid-cols-3 bg-gray-700/30 w-full *:h-14 *:p-2 *:flex *:justify-between *:items-center *:overflow-hidden lg:text-base text-sm">
          <div className="border-b border-r border-gray-600 lg:border-0">
            <div className="">Tokens</div>
            <div className="gap-2">{profile.tokens.count}</div>
          </div>
          <div className="lg:border-x border-gray-600 border-b lg:border-b-0 px-4">
            <span className="">Average Buy</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                {profile.tokens.avgPrice.toLocaleString()}
                <div className="relative w-3 h-3 flex items-end">
                  <Image
                    src={
                      "https://cryptologos.cc/logos/solana-sol-logo.png?v=040"
                    }
                    alt="solana logo"
                    fill
                  />
                </div>
              </div>
              <div className="text-gray-500 lg:text-sm text-xs">
                {formatMoney(profile.tokens.avgPrice * SOL_PRICE)}
              </div>
            </div>
          </div>
          <div className="border-b border-r border-gray-600 lg:border-0">
            <span className="">Total Invested</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                {profile.totalInvested.toLocaleString()}
                <div className="relative w-3 h-3 flex items-end">
                  <Image
                    src={
                      "https://cryptologos.cc/logos/solana-sol-logo.png?v=040"
                    }
                    alt="solana logo"
                    fill
                  />
                </div>
              </div>
              <div className="text-gray-500 lg:text-sm text-xs">
                {formatMoney(profile.totalInvested * SOL_PRICE)}
              </div>
            </div>
          </div>

          <div className="border-y border-gray-600 border-t-0 lg:border-t">
            <span className="">Win Rate</span>
            <div className="text-green-500">{profile.winRate}%</div>
          </div>
          <div className="lg:border-y lg:border-x border-b border-r border-gray-600 px-4">
            <span className="">Average Entry</span>
            <div>${profile.avgEntry.toLocaleString()}</div>
          </div>
          <div className="border-y border-gray-600 border-t-0 lg:border-t">
            <span className="">ROI</span>
            <div className="text-green-500">+{profile.roi}%</div>
          </div>
          <div className="border-r lg:border-r-0 border-gray-600">
            <span className="">Trades</span>
            <div>
              <span className="text-green-500">{profile.trades.won}</span> /{" "}
              <span className="text-red-500">{profile.trades.total}</span>
            </div>
          </div>
          <div className="lg:border-x border-gray-600 px-4">
            <span className="">Average Hold</span>
            <div>{profile.avgHold}</div>
          </div>
          <div className="col-span-2 lg:col-span-1 border-t border-gray-600 lg:border-t-0">
            <span className="">Realized PNL</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                {profile.realizedPNL.value.toLocaleString()}
                <div className="relative w-3 h-3 flex items-end">
                  <Image
                    src={
                      "https://cryptologos.cc/logos/solana-sol-logo.png?v=040"
                    }
                    alt="solana logo"
                    fill
                  />
                </div>
              </div>
              <div className="text-gray-500 lg:text-sm text-xs">
                {formatMoney(profile.realizedPNL.value * SOL_PRICE)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
