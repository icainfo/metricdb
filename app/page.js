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

const MARYLAND_RED = "#e21833";
const MARYLAND_GOLD = "#ffd200";
const WHITE = "#ffffff";
const BLACK = "#000000";
const MARYLAND_COLORS = [
  MARYLAND_RED,
  MARYLAND_GOLD,
  "#ab0d1f",
  "#d4af37",
  "#8b0000",
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.5,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        color: BLACK,
        font: { size: 12, weight: '500' },
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14, weight: '600' },
      bodyFont: { size: 13 },
      titleColor: WHITE,
      bodyColor: WHITE,
    },
  },
  scales: {
    x: {
      ticks: { 
        color: BLACK,
        font: { size: 11 },
        maxRotation: 45,
        minRotation: 45,
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { 
        color: BLACK,
        font: { size: 11 },
      },
      grid: { color: 'rgba(0,0,0,0.05)' },
    },
  },
};

cconst fetchChartData = async (dataKey) => {
  try {
    const res = await fetch(`/api/proxy/${dataKey}`);
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    const formattedKey = dataKey.replace(/-/g, '_');
    
    if (!data || !data[formattedKey]) {
      throw new Error("Invalid data structure from API");
    }
    
    return {
      labels: Object.keys(data[formattedKey]),
      datasets: [{
        label: dataKey.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        data: Object.values(data[formattedKey]),
        backgroundColor: MARYLAND_COLORS,
        borderColor: WHITE,
        borderWidth: 1,
      }],
    };
    
  } catch (error) {
    console.error(`Error fetching ${dataKey}:`, error);
    return null;
  }
}

const ChartComponent = ({ title, dataKey, type }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChartData(dataKey);
        setChartData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dataKey]);

  return (
    <div className="chart-card">
      <h2 className="chart-title">{title}</h2>
      <div className="chart-content">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : chartData && chartData.labels && chartData.datasets ? (
          <div className="chart-wrapper">
            {type === "bar" ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Pie data={chartData} options={{...chartOptions, aspectRatio: 1}} />
            )}
          </div>
        ) : (
          <div className="error-message">No data available</div>
        )}
      </div>
    </div>
  );
};

const AverageResponseTime = () => {
  const [avgTime, setAvgTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/proxy/average-ticket-duration");
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

const LandingPage = ({ onAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        onAuthenticated();
      } else {
        // Show detailed error
        setError(data.error + (data.debug ? ` (received ${data.debug.received?.length || 0} chars)` : ''));
        console.error('Auth Error:', data);
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Connection failed - check console");
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to the ICA IT Metric Dashboard</h1>
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
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1;
        }
        .landing-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: ${WHITE};
          padding: 30px 40px;
          background: rgba(0, 0, 0, 0.65);
          border-radius: 10px;
        }
        .landing-title {
          margin-bottom: 20px;
          font-size: 2rem;
        }
        input {
          padding: 10px;
          font-size: 1rem;
          border-radius: 5px;
          border: none;
          margin-right: 10px;
          width: 240px;
        }
        button {
          padding: 10px 20px;
          font-size: 1rem;
          background-color: ${MARYLAND_RED};
          color: ${WHITE};
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #c41528;
        }
        .error {
          color: ${MARYLAND_GOLD};
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

const Dashboard = () => {
  const [activeChart, setActiveChart] = useState('overview');
  
  const charts = {
    overview: { title: "Overview" },
    category: {
      title: "Tickets by Category",
      component: <ChartComponent
        title="Tickets by Category"
        dataKey="tickets-by-category"
        type="bar"
      />
    },
    reportMethod: {
      title: "Report Methods",
      component: <ChartComponent
        title="Tickets by Report Method"
        dataKey="tickets-by-report-method"
        type="pie"
      />
    },
    serviceType: {
      title: "Service Types",
      component: <ChartComponent
        title="Tickets by Service Type"
        dataKey="tickets-by-service-type"
        type="bar"
      />
    },
    location: {
      title: "Locations",
      component: <ChartComponent
        title="Tickets by Location"
        dataKey="tickets-by-location"
        type="pie"
      />
    },
    department: {
      title: "Departments",
      component: <ChartComponent
        title="Tickets by Department"
        dataKey="tickets-by-department"
        type="bar"
      />
    }
  };

  return (
    <div className="dashboard">
      <header>
        <div className="header-content">
          <img src="/logo.png" alt="Athletics Logo" className="logo" />
          <h1>ICA IT Metric Dashboard</h1>
        </div>
      </header>
      
      <main>
        <div className="metric-section">
          <AverageResponseTime />
        </div>

        <div className="navigation-tabs">
          {Object.entries(charts).map(([key, { title }]) => (
            <button
              key={key}
              className={`tab-button ${activeChart === key ? 'active' : ''}`}
              onClick={() => setActiveChart(key)}
            >
              {title}
            </button>
          ))}
        </div>

        <div className="chart-container">
          {activeChart === 'overview' ? (
            <div className="charts-grid">
              {Object.entries(charts).slice(1).map(([key, { component }]) => (
                <div key={key} className="overview-chart">
                  {component}
                </div>
              ))}
            </div>
          ) : (
            <div className="single-chart">
              {charts[activeChart].component}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
                      url('/background-stadium.jpg') no-repeat center center/cover;
          background-attachment: fixed;
          color: ${BLACK};
        }
        header {
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 10;
          border-bottom: 2px solid ${MARYLAND_RED};
        }
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1rem;
        }
        .logo {
          height: 50px;
          width: auto;
        }
        h1 {
          font-size: 1.8rem;
          margin: 0;
        }
        main {
          max-width: 1400px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .metric-section {
          margin-bottom: 2rem;
        }
        .metric-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          text-align: center;
        }
        .metric-card h2 {
          color: ${MARYLAND_RED} !important;
          font-size: 1.4rem;
          margin-bottom: 1rem;
        }
        .metric-value {
          font-size: 2.5rem;
          font-weight: 600;
        }
        .navigation-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .tab-button {
          padding: 0.75rem 1.5rem;
          background: white;
          border: 2px solid ${MARYLAND_RED};
          color: ${MARYLAND_RED};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
        }
        .tab-button:hover, .tab-button.active {
          background: ${MARYLAND_RED};
          color: white !important;
        }
        .chart-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 450px), 1fr));
          gap: 2rem;
        }
        .single-chart {
          max-width: 800px;
          margin: 0 auto;
        }
        .chart-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .chart-title {
          color: ${MARYLAND_RED} !important;
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
        }
        .error-message {
          color: ${MARYLAND_RED} !important;
          text-align: center;
          padding: 1rem;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
          }
          .navigation-tabs {
            justify-content: center;
          }
          .tab-button {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
          .chart-wrapper {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default function TicketMetricsDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  return authenticated ? <Dashboard /> : <LandingPage onAuthenticated={() => setAuthenticated(true)} />;
}