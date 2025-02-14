"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TicketsByCategory() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://metricapi-f7n6.onrender.com/metrics/tickets-by-category");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setChartData({
          labels: Object.keys(data.tickets_by_category),
          datasets: [
            {
              label: "Tickets by Category",
              data: Object.values(data.tickets_by_category),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return chartData ? <Bar data={chartData} /> : <p>Loading...</p>;
}
