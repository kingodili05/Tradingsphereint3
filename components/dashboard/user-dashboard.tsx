'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UserProfileCard } from './user-profile-card';
import { BalanceCards } from './balance-cards';
import { ActiveTrades } from './active-trades';
import { TradeForm } from './trade-form';
import { MessagesPanel } from './messages-panel';
import { PriceChart } from './price-chart';
import { DepositWithdrawForm } from './deposit-withdraw-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function UserDashboard() {
  const {
    profile,
    balances = [],
    trades = [],
    messages = [],
    loading: dashboardLoading,
    getTotalBalanceUSD,
    getBalanceByCurrency,
    getBalanceBTC,
    btcPrice,
    getUnreadMessagesCount,
    getOpenTradesCount,
    error
  } = useDashboardData();
  
  // Filter open trades from the trades array
  const getOpenTrades = () => {
    return trades.filter((trade: any) => trade.status === 'open');
  };
  
  // Loading states for child components
  const tradesLoading = dashboardLoading;
  const messagesLoading = dashboardLoading;

  if (dashboardLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground">Please complete your profile setup.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile.first_name}! Here's your trading overview.
          </p>
        </div>

        {/* Profile and Balance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <UserProfileCard profile={profile} />
          <div className="lg:col-span-3">
            <BalanceCards 
              balances={balances} 
              profile={profile}
              btcPrice={btcPrice}
              getBalanceBTC={getBalanceBTC}
            />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="messages">
              Messages {getUnreadMessagesCount() > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {getUnreadMessagesCount()}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Active Trades - takes 3/4 width on large screens */}
              <div className="lg:col-span-3">
                <ActiveTrades 
                  trades={getOpenTrades()}
                  loading={tradesLoading}
                />
              </div>
              
              {/* Trade Form - takes 1/4 width on large screens */}
              <div className="lg:col-span-1">
                <TradeForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <ActiveTrades 
              trades={trades}
              loading={tradesLoading}
              showAll={true}
            />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <PriceChart symbol="BTC/USD" />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <MessagesPanel 
              messages={messages}
              loading={messagesLoading}
            />
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <DepositWithdrawForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}