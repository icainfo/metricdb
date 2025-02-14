"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
            "#4BC0C0", "#FF9F40", "#9966FF", "#FF6384", "#36A2EB", "#FFCE56", "#75A478",
          ],
        },
      ],
    };
  } catch (error) {
    console.error(`Error fetching ${dataKey}:`, error);
    return null;
  }
};

// Reusable Chart Component
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

// Average Response Time Component
const AverageResponseTime = () => {
  const [avgTime, setAvgTime] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://metricapi-f7n6.onrender.com/metrics/average-ticket-duration");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setAvgTime((data.average_duration / 3600).toFixed(2)); // Convert seconds to hours
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="response-time">
      <h2>Average Response Time</h2>
      <p>{avgTime ? `${avgTime} hours` : "Loading..."}</p>
    </div>
  );
};

// Main Dashboard Component
export default function TicketMetricsDashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">HelpScout Metrics Dashboard</h1>

      {/* Average Response Time - Full Width */}
      <div className="full-width">
        <AverageResponseTime />
      </div>

      {/* Grid Layout for Charts */}
      <div className="charts-grid">
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

      {/* Styling */}
      <style jsx>{`
        .dashboard-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }
        
        .dashboard-title {
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: #333;
        }
        
        .response-time {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          font-size: 1.2rem;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .chart-container {
          background: white;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease-in-out;
        }

        .chart-container:hover {
          transform: translateY(-5px);
        }

        .chart-title {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #444;
        }

        .full-width {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
