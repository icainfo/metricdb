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
import Image from "next/image";

// Register Chart.js components once
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Define Maryland colors
const MARYLAND_RED = "#e21833";
const MARYLAND_GOLD = "#ffd200";
const WHITE = "#ffffff";
const BLACK = "#000000";

// Common chart options for readability
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: BLACK, font: { size: 12 } },
    },
    title: { display: false },
  },
  scales: {
    x: {
      ticks: { color: BLACK, font: { size: 10 } },
      grid: { color: "rgba(0,0,0,0.1)" },
    },
    y: {
      ticks: { color: BLACK, font: { size: 10 } },
      grid: { color: "rgba(0,0,0,0.1)" },
    },
  },
};

// Utility function to fetch chart data with API key header
const fetchChartData = async (url, dataKey) => {
  try {
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
        type === "bar" ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Pie data={chartData} options={chartOptions} />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

// Average Ticket Duration Component
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
        setAvgTime((data.average_ticket_duration / 3600).toFixed(2)); // seconds to hours
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

// Landing Page Component for Password Protection
const LandingPage = ({ onAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "ITServic3!") {
      onAuthenticated();
    } else {
      setError("Incorrect password");
    }
  };
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to the ICA IT Metric Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
          <button type="submit">Enter</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
      <style jsx>{`
        .landing-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: url('/background-stadium.jpg') no-repeat center center/cover;
          position: relative;
        }
        .landing-container::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1;
        }
        .landing-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: ${WHITE};
          padding: 20px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 10px;
        }
        input {
          padding: 10px;
          font-size: 1rem;
          border-radius: 5px;
          border: none;
          margin-right: 10px;
          width: 200px;
        }
        button {
          padding: 10px 20px;
          font-size: 1rem;
          background-color: ${MARYLAND_RED};
          color: ${WHITE};
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .error {
          color: ${MARYLAND_GOLD};
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

// Dashboard Component (visible after authentication)
const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <img className="logo" src="/logo.png" alt="Athletics Logo" />
        <h1 className="dashboard-title">ICA IT Metric Dashboard</h1>
      </header>
      <div className="full-width">
        <AverageResponseTime />
      </div>
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
      <style jsx>{`
        .dashboard-wrapper {
          max-width: 1200px;
          margin: 40px auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          font-size: 1.2rem;
          margin-bottom: 20px;
          text-align: center;
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
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease-in-out;
          height: 350px;
          overflow: auto;
        }
        .chart-container:hover {
          transform: translateY(-5px);
        }
        .chart-title {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: ${BLACK};
          text-align: center;
        }
        .full-width {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

// Main Component: Shows Landing Page until authenticated, then shows Dashboard
export default function TicketMetricsDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  return authenticated ? <Dashboard /> : <LandingPage onAuthenticated={() => setAuthenticated(true)} />;
}
