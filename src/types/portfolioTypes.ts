// src/types/portfolioTypes.ts

export interface Transaction {
    id: number;
    symbol: string;
    profitPercentage: string;
    date: string;
    purchasePrice: number;
    currentPrice: string;
    quantity: number;
}

export interface PortfolioItem {
    id: number;
    symbol: string;
    name: string;
    totalQuantity: number;
    averagePurchasePrice: number;
    currentPrice: number;
    percentageChange: string;
    totalValue: number;
    profit: number;
    profitPercentage: string;
}

export interface Portfolio {
    id: number;
    portfolioName: string;
    totalInvested: number;
    totalCurrentValue: number;
    totalProfit: number;
    totalProfitPercentage: number;
    items: PortfolioItem[];
}

export interface PortfolioHistoryPoint {
    date: string;
    totalInvested: number;
    totalCurrentValue: number;
}
