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

