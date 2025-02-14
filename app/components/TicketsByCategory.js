"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components once
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Utility function to fetch data
const fetchChartData = async (url, dataKey) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();
    return {
      labels: Object.keys(data[dataKey]),
      datasets: [
        {
          label: dataKey.replace(/_/g, " ").toUpperCase(),
          data: Object.values(data[dataKey]),
          backgroundColor: [
            "#4BC0C0", "#FF9F40", "#9966FF", "#FF6384", "#36A2EB", "#FFCE56", "#75A478"
          ],
        },
      ],
    };
  } catch (error) {
    console.error(`Error fetching ${dataKey}:`, error);
    return null;
  }
};

// Chart components
const ChartComponent = ({ title, url, dataKey, type }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchChartData(url, dataKey).then(setChartData);
  }, [url, dataKey]);

  return (
    <div className="chart-container">
      <h2 className="chart-title">{title}</h2>
      {chartData ? (
        type === "bar" ? <Bar data={chartData} options={{ responsive: true }} /> : <Pie data={chartData} options={{ responsive: true }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

// Main Dashboard Component
export default function TicketMetricsDashboard() {
  return (
    <div className="dashboard-container">
      <ChartComponent
        title="Tickets by Category"
        url="https://metricapi-f7n6.onrender.com/metrics/tickets-by-category"
        dataKey="tickets_by_category"
        type="bar"
      />
      <ChartComponent
        title="Tickets by Report Method"
        url="https://metricapi-f7n6.onrender.com/metrics/tickets-by-report-method"
        dataKey="tickets_by_report_method"
        type="pie"
      />
      <ChartComponent
        title="Tickets by Service Type"
        url="https://metricapi-f7n6.onrender.com/metrics/tickets-by-service-type"
        dataKey="tickets_by_service_type"
        type="bar"
      />
      <ChartComponent
        title="Tickets by Location"
        url="https://metricapi-f7n6.onrender.com/metrics/tickets-by-location"
        dataKey="tickets_by_location"
        type="pie"
      />
      <ChartComponent
        title="Tickets by Department"
        url="https://metricapi-f7n6.onrender.com/metrics/tickets-by-department"
        dataKey="tickets_by_department"
        type="bar"
      />
    </div>
  );
}
