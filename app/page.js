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

// Define Maryland colors
const MARYLAND_RED = "#e21833";
const MARYLAND_GOLD = "#ffd200";
const WHITE = "#ffffff";
const BLACK = "#000000";

// Utility function to fetch chart data with API key header
const fetchChartData = async (url, dataKey) => {
  try {
    // Include the API key in the request header
    const res = await fetch(url, {
      headers: { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY },
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();
    return {
      labels: Object.keys(data[dataKey]),
      datasets: [
        {
          label: dataKey.replace(/_/g, " ").toUpperCase(),
          data: Object.values(data[dataKey]),
          // Cycle through Maryland colors for chart elements
          backgroundColor: [MARYLAND_RED, MARYLAND_GOLD, BLACK, MARYLAND_RED, MARYLAND_GOLD],
          borderColor: BLACK,
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error(`Error fetching ${dataKey}:`, error);
    return null;
  }
};

// Reusable Chart Component.
const ChartComponent = ({ title, url, dataKey, type }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchChartData(url, dataKey).then(setChartData);
  }, [url, dataKey]);

  return (
    <div className="chart-container">
      <h2 className="chart-title">{title}</h2>
      {chartData ? (
        type === "bar" ? (
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        ) : (
          <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

// Average Ticket Duration Component.
const AverageResponseTime = () => {
  const [avgTime, setAvgTime] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://metricapi-f7n6.onrender.com/metrics/average-ticket-duration", {
          headers: { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY },
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setAvgTime((data.average_ticket_duration / 3600).toFixed(2)); // Convert seconds to hours
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="response-time">
      <h2>Average Ticket Duration</h2>
      <p>{avgTime ? `${avgTime} hours` : "Loading..."}</p>
    </div>
  );
};

// Main Dashboard Component.
export default function TicketMetricsDashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {/* Logo Area – replace src with your logo image URL */}
        <img className="logo" src="logo.png" alt="Company Logo" />
        <h1 className="dashboard-title">ICA IT Metric Dashboard</h1>
      </header>

      {/* Full-width average response time */}
      <div className="full-width">
        <AverageResponseTime />
      </div>

      {/* Grid layout for charts */}
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
          background-color: ${WHITE};
          color: ${BLACK};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
        .dashboard-header {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 2px solid ${MARYLAND_RED};
        }
        .logo {
          height: 60px;
          margin-right: 20px;
        }
        .dashboard-title {
          font-size: 2.5rem;
          color: ${MARYLAND_RED};
          font-weight: bold;
          margin: 0;
        }
        .response-time {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          font-size: 1.2rem;
          margin-bottom: 20px;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .chart-container {
          background: ${WHITE};
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease-in-out;
          height: 350px;
        }
        .chart-container:hover {
          transform: translateY(-5px);
        }
        .chart-title {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: ${BLACK};
        }
        .full-width {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
