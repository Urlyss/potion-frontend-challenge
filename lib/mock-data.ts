import { Trade, TraderProfile } from "@/types/trader-profile";
import type { Trader } from "../types/trader"


export function generateMockTraders(count: number = 30): Trader[] {
  return Array.from({ length: count }, (_, i) => {
    const won = Math.floor(Math.random() * 200) + 50; // Random wins between 50-250
    const total = won + Math.floor(Math.random() * 150) + 50; // Add random losses
    const winRate = Math.round((won / total) * 100);
    
    const avgBuy = Number((Math.random() * 15 + 0.5).toFixed(2)); // Random avgBuy between 0.5-15.5
    const avgEntry = Number((Math.random() * 20 + 0.8).toFixed(2)); // Random avgEntry between 0.8-20.8
    
    // Generate random hold times between 5 minutes and 14 days
    const holdMinutes = Math.floor(Math.random() * 20160) + 5; // 20160 minutes = 14 days
    
    // Generate random PNL between -50 and +150
    const pnl = Number((Math.random() * 200 - 50).toFixed(2));
    
    // Random follower count between 100 and 50000
    const followers = Math.floor(Math.random() * 49900) + 100;

    // Random token count between 5 and 200
    const tokens = Math.floor(Math.random() * 195) + 5;

    // Generate random wallet address
    const address = `0x${Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;

    // Random Twitter-like handles
    const handles = [
      '@trader', '@crypto', '@nft', '@web3', '@defi', '@sol', 
      '@whale', '@alpha', '@based', '@degen'
    ];
    const handle = handles[Math.floor(Math.random() * handles.length)] + 
      Math.floor(Math.random() * 9999);

    return {
      rank: i + 1,
      name: `Trader ${i + 1}`,
      address: address,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      followers,
      handle,
      tokens,
      winRate,
      trades: {
        won,
        total
      },
      avgBuy,
      avgEntry,
      avgHold: `${holdMinutes} minutes`,
      realizedPNL: pnl
    };
  });
}

export function generateMockTrades(count: number = 10): Trade[] {
  return Array.from({ length: count }, () => {
    const marketCap = Math.floor(Math.random() * 1000000) + 10000;
    const invested = Math.floor(Math.random() * 10000) + 100;
    const pnlValue = Math.floor(Math.random() * 50000) - 10000;
    const pnlPercentage = (pnlValue / invested) * 100;
    const won = Math.floor(Math.random() * 10);
    const total = won + Math.floor(Math.random() * 10);
    const holding = Math.floor(Math.random() * 100000);
    const avgBuy = Math.floor(Math.random() * 1000);
    const avgSell = avgBuy * (1 + Math.random());
    
    // Random time between 1 minute and 24 hours ago
    const minutes = Math.floor(Math.random() * 1440) + 1;
    
    // Generate random token name
    const tokenNames = ["BONK", "SAMO", "MEME", "PYTH", "DUST", "CROWN", "FORGE", "RAIN", "SUNNY", "ORCA"];
    const tokenName = tokenNames[Math.floor(Math.random() * tokenNames.length)];
    
    // Random hold time between 1 min and 24 hours
    const heldMinutes = Math.floor(Math.random() * 1440) + 1;
    
    return {
      token: {
        name: tokenName,
        address: `${Array.from({ length: 8 }, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}...${
          Array.from({ length: 4 }, () => 
            Math.floor(Math.random() * 16).toString(16)).join('')}`,
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenName}`,
      },
      lastTrade: `${minutes} min`,
      marketCap,
      invested,
      realizedPNL: {
        value: pnlValue,
        percentage: Number(pnlPercentage.toFixed(1)),
      },
      roi: Number((pnlPercentage * 0.8).toFixed(1)), // Slightly different from PNL for variety
      trades: {
        won,
        total,
      },
      holding,
      avgBuy,
      avgSell,
      held: `${heldMinutes} min`,
    };
  });
}

export function generateMockProfile(): TraderProfile {
  const won = Math.floor(Math.random() * 500) + 100;
  const total = won + Math.floor(Math.random() * 300);
  const winRate = Math.round((won / total) * 100);
  
  const totalInvested = Math.floor(Math.random() * 100000) + 10000;
  const pnlValue = Math.floor(Math.random() * 200000) - 50000;
  const pnlPercentage = (pnlValue / totalInvested) * 100;
  
  const address = `0x${Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  const names = ["Whale", "Degen", "Alpha", "Based", "Diamond", "Moon", "Rocket", "Pepe"];
  const name = names[Math.floor(Math.random() * names.length)];
  
  return {
    name,
    address,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    handle: `@${name.toLowerCase()}${Math.floor(Math.random() * 9999)}`,
    followers: Math.floor(Math.random() * 1000000) + 1000,
    lastTrade: {
      time: `${Math.floor(Math.random() * 60)} min ago`,
      type: Math.random() > 0.5 ? "buy" : "sell",
    },
    tokens: {
      count: Math.floor(Math.random() * 500) + 10,
      avgPrice: Number((Math.random() * 10).toFixed(3)),
    },
    winRate,
    trades: {
      won,
      total,
    },
    avgEntry: Math.floor(Math.random() * 500000) + 10000,
    avgHold: `${Math.floor(Math.random() * 120)} m`,
    realizedPNL: {
      value: pnlValue,
      percentage: Number(pnlPercentage.toFixed(1)),
    },
    totalInvested,
    roi: Number((Math.random() * 1000).toFixed(1)),
  };
}
