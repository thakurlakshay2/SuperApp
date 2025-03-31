import ProfilePage from "@/components/ProfilePage";
import { AssetsImg } from "@/public";
const mockTransactions = [
  {
    type: "buy",
    coin: "BTC",
    amount: 0.5,
    date: "2024-02-20",
    price: 52000,
  },
  {
    type: "sell",
    coin: "ETH",
    amount: 2.5,
    date: "2024-02-19",
    price: 3000,
  },
  {
    type: "buy",
    coin: "SOL",
    amount: 15,
    date: "2024-02-18",
    price: 1200,
  },
  {
    type: "buy",
    coin: "DOT",
    amount: 100,
    date: "2024-02-17",
    price: 800,
  },
];

const mockTopHoldings = [
  {
    symbol: "BTC",
    amount: 1.2,
    value: 62400,
    change24h: 2.5,
  },
  {
    symbol: "ETH",
    amount: 15,
    value: 45000,
    change24h: -1.2,
  },
  {
    symbol: "SOL",
    amount: 150,
    value: 15000,
    change24h: 5.8,
  },
  {
    symbol: "DOT",
    amount: 500,
    value: 8000,
    change24h: 1.3,
  },
];

const mockAchievements = [
  {
    title: "Early Adopter",
    date: "2023-06-01",
    icon: "🌟",
  },
  {
    title: "First Trade",
    date: "2023-06-02",
    icon: "🎯",
  },
  {
    title: "100 Trades Completed",
    date: "2024-01-15",
    icon: "🏆",
  },
];
export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <ProfilePage
        // Basic Info
        name="John Doe"
        email="john.doe@example.com"
        walletAddress="0x1234...5678"
        dateOfBirth="1990-01-15"
        joinDate="2023-06-01"
        portfolioValue={130400}
        profileImage={AssetsImg.ic_hamburgerSidebar}
        // Trading Statistics
        tradingVolume24h={25000}
        totalTrades={156}
        successRate={67.5}
        avgHoldingPeriod="45 days"
        // Portfolio Details
        topHoldings={mockTopHoldings}
        riskScore={7.5}
        // Preferred Exchanges
        preferredExchanges={["Binance", "Coinbase", "Kraken"]}
        // Recent Activity
        recentTransactions={mockTransactions}
        // Achievements
        achievements={mockAchievements}
      />
    </div>
  );
}
