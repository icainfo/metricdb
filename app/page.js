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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Define Maryland colors with better contrast
const MARYLAND_RED = "#e21833";
const MARYLAND_GOLD = "#ffd200";
const WHITE = "#ffffff";
const BLACK = "#000000";
const BACKGROUND_LIGHT = "#f8f9fa";
const TEXT_DARK = "#2d3748";

// Improved chart options with better responsiveness and dark mode support
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.5,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        color: TEXT_DARK,
        font: { size: 12, weight: '500' },
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14, weight: '600' },
      bodyFont: { size: 13 },
      displayColors: true,
    },
  },
  scales: {
    x: {
      ticks: { 
        color: TEXT_DARK,
        font: { size: 11 },
        maxRotation: 45,
        minRotation: 45,
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { 
        color: TEXT_DARK,
        font: { size: 11 },
      },
      grid: { color: 'rgba(0,0,0,0.05)' },
    },
  },
};

// Enhanced fetch utility with error handling and loading states
const fetchChartData = async (url, dataKey) => {
  try {
    const res = await fetch(url, {
      headers: { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return {
      labels: Object.keys(data[dataKey]),
      datasets: [{
        label: dataKey.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        data: Object.values(data[dataKey]),
        backgroundColor: [MARYLAND_RED, MARYLAND_GOLD, '#4a5568', '#718096', '#a0aec0'],
        borderColor: WHITE,
        borderWidth: 1,
      }],
    };
  } catch (error) {
    console.error(`Error fetching ${dataKey}:`, error);
    return null;
  }
};

// Improved Chart Component with loading state and error handling
const ChartComponent = ({ title, url, dataKey, type }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChartData(url, dataKey);
        setChartData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [url, dataKey]);

  return (
    <div className="chart-card">
      <h2 className="chart-title">{title}</h2>
      <div className="chart-content">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="chart-wrapper">
            {type === "bar" ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Pie data={chartData} options={{...chartOptions, aspectRatio: 1}} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Average Response Time Component
const AverageResponseTime = () => {
  const [avgTime, setAvgTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://metricapi-f7n6.onrender.com/metrics/average-ticket-duration", {
          headers: { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY },
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setAvgTime((data.average_ticket_duration / 3600).toFixed(2));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="metric-card">
      <h2>Average Ticket Duration</h2>
      <div className="metric-value">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <span>{avgTime} hours</span>
        )}
      </div>
    </div>
  );
};

// Improved Landing Page Component
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
    <div className="landing-page">
      <div className="auth-container">
        <h1>ICA IT Metric Dashboard</h1>
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
          <button type="submit">Enter Dashboard</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                      url('/background-stadium.jpg') no-repeat center center/cover;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        h1 {
          color: ${MARYLAND_RED};
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        input {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          width: 100%;
        }
        button {
          background: ${MARYLAND_RED};
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background: #c41528;
        }
        .error-message {
          color: ${MARYLAND_RED};
          margin-top: 0.75rem;
        }
      `}</style>
    </div>
  );
};

// Enhanced Dashboard Component
const Dashboard = () => {
  return (
    <div className="dashboard">
      <header>
        <div className="header-content">
          <img src="/logo.png" alt="Athletics Logo" className="logo" />
          <h1>ICA IT Metric Dashboard</h1>
        </div>
      </header>
      
      <main>
        <AverageResponseTime />
        
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
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: ${BACKGROUND_LIGHT};
          color: ${TEXT_DARK};
        }
        
        header {
          background: white;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .logo {
          height: 50px;
          width: auto;
        }
        
        h1 {
          color: ${MARYLAND_RED};
          font-size: 1.8rem;
          margin: 0;
        }
        
        main {
          max-width: 1400px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        
        .metric-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .metric-card h2 {
          color: ${TEXT_DARK};
          font-size: 1.4rem;
          margin-bottom: 1rem;
        }
        
        .metric-value {
          font-size: 2rem;
          color: ${MARYLAND_RED};
          font-weight: 600;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 450px), 1fr));
          gap: 1.5rem;
        }
        
        .chart-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .chart-title {
          color: ${TEXT_DARK};
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .chart-wrapper {
          position: relative;
          width: 100%;
          height: 300px;
        }
        
        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: ${TEXT_DARK};
        }
        
        .error-message {
          color: ${MARYLAND_RED};
          text-align: center;
          padding: 1rem;
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .chart-wrapper {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

// Main Component with authentication state
export default function TicketMetricsDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  return authenticated ? <Dashboard /> : <LandingPage onAuthenticated={() => setAuthenticated(true)} />;
}