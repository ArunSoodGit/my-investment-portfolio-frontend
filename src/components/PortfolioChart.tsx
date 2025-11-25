import React from "react";
import {
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    ReferenceDot,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import "./PortfolioChart.css";

export interface HistoricalData {
    portfolioId: number;
    historicalData: PortfolioPoint[];

}

interface PortfolioPoint {
    date: string;
    totalInvested: number;
    totalCurrentValue: number;
}

interface PortfolioChartProps {
    data: HistoricalData | null;
}

export default function PortfolioChart({data}: PortfolioChartProps) {
    if (!data || data.historicalData.length === 0) return null;

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${d
            .getDate()
            .toString()
            .padStart(2, "0")} ${d
            .getHours()
            .toString()
            .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    };

    const lastPoint = data.historicalData[data.historicalData.length - 1];

    return (
        <div className="portfolio-chart-container">
            <h2 className="portfolio-chart-title">
                📊 Wkład i wartość portfela w czasie
            </h2>
            <ResponsiveContainer width="100%" height={450}>
                <LineChart
                    data={data.historicalData}
                    margin={{top: 20, right: 60, left: 20, bottom: 20}} // Dodany margines po prawej
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        tick={{fontSize: 12}}
                    />
                    <YAxis tick={{fontSize: 12}} domain={["auto", "auto"]}/>
                    <Tooltip
                        formatter={(value: number) =>
                            new Intl.NumberFormat("pl-PL", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2
                            }).format(value)
                        }
                        labelFormatter={(label: any) => `Data: ${formatDate(label)}`}
                        contentStyle={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb"
                        }}
                    />
                    <Legend/>

                    {/* Linia zainwestowanego kapitału */}
                    <Line
                        type="monotone"
                        dataKey="totalInvested"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                        name="Zainwestowany kapitał"
                    />

                    {/* Linia wartości portfela */}
                    <Line
                        type="monotone"
                        dataKey="totalCurrentValue"
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={false}
                        name="Wartość portfela"
                    />

                    {/* Ostatnie punkty z etykietami po lewej stronie */}
                    {lastPoint && (
                        <>
                            <ReferenceDot
                                x={lastPoint.date}
                                y={lastPoint.totalInvested}
                                r={5}
                                fill="#2563eb"
                            >
                                <Label
                                    value={`${lastPoint.totalInvested.toFixed(2)}$`}
                                    position="top"
                                    offset={15}
                                    fill="#2563eb"
                                    fontSize={12}
                                />
                            </ReferenceDot>

                            <ReferenceDot
                                x={lastPoint.date}
                                y={lastPoint.totalCurrentValue}
                                r={5}
                                fill="#16a34a"
                            >
                                <Label
                                    value={`${lastPoint.totalCurrentValue.toFixed(2)}$`}
                                    position="top"
                                    offset={15}
                                    fill="#16a34a"
                                    fontSize={12}
                                />
                            </ReferenceDot>
                        </>
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
