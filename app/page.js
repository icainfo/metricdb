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

// Enhanced Maryland color palette
const MARYLAND_RED = "#e21833";
const MARYLAND_GOLD = "#ffd200";
const WHITE = "#ffffff";
const BLACK = "#111111"; // Darker black for better contrast
const BACKGROUND_OVERLAY = "rgba(255, 255, 255, 0.98)";
const MARYLAND_COLORS = [
  MARYLAND_RED,
  MARYLAND_GOLD,
  "#ab0d1f", // darker red
  "#d4af37", // darker gold
  "#8b0000", // deep red
];

// Optimized chart options
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
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
        font: { size: 11, weight: '500' },
        maxRotation: 45,
        minRotation: 45,
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { 
        color: BLACK,
        font: { size: 11, weight: '500' },
      },
      grid: { color: 'rgba(0,0,0,0.08)' },
    },
  },
  elements: {
    bar: {
      backgroundColor: MARYLAND_RED,
    },
  },
};

// [Keep fetchChartData and ChartComponent implementations same as before...]

const Dashboard = () => {
  const [activeChart, setActiveChart] = useState('overview');
  
  // [Keep charts object and return statement same as before...]

  return (
    <div className="dashboard">
      {/* Keep header and main content same as before */}

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(${BACKGROUND_OVERLAY}, ${BACKGROUND_OVERLAY}),
                      url('/background-stadium.jpg') no-repeat center center/cover;
          background-attachment: fixed;
          color: ${BLACK};
        }
        
        header {
          background: ${WHITE};
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
        
        h1 {
          color: ${MARYLAND_RED} !important;
          font-size: 1.8rem;
          margin: 0;
          font-weight: 600;
        }
        
        .metric-card h2 {
          color: ${MARYLAND_RED} !important;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .metric-value {
          font-size: 2.5rem;
          color: ${BLACK} !important;
          font-weight: 600;
        }
        
        .tab-button {
          padding: 0.75rem 1.5rem;
          background: ${WHITE};
          border: 2px solid ${MARYLAND_RED};
          color: ${MARYLAND_RED};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
        }
        
        .chart-container {
          background: ${WHITE};
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .chart-title {
          color: ${MARYLAND_RED} !important;
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .metric-value {
            font-size: 2rem;
          }
          .chart-container {
            padding: 1rem;
          }
          .chart-title {
            font-size: 1.1rem;
          }
        }
        
        @media (prefers-color-scheme: dark) {
          .dashboard {
            background: linear-gradient(${BACKGROUND_OVERLAY}, ${BACKGROUND_OVERLAY}),
                        url('/background-stadium.jpg') no-repeat center center/cover;
          }
          * {
            color: ${BLACK} !important;
          }
        }
      `}</style>
    </div>
  );
};

// Enhanced Landing Page
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
        <h1 className="landing-title">Welcome to ICA IT Metric Dashboard</h1>
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
          background: rgba(0, 0, 0, 0.7);
          z-index: 1;
        }
        
        .landing-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2.5rem;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
        }
        
        .landing-title {
          color: ${WHITE} !important;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          line-height: 1.3;
        }
        
        input {
          width: 100%;
          padding: 12px 20px;
          margin-bottom: 1rem;
          border: 2px solid ${WHITE};
          border-radius: 8px;
          background: transparent;
          color: ${WHITE};
          font-size: 1rem;
        }
        
        button {
          width: 100%;
          padding: 14px;
          background: ${MARYLAND_RED};
          color: ${WHITE};
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        button:hover {
          background: #c01024;
        }
        
        .error {
          color: ${MARYLAND_GOLD} !important;
          margin-top: 1rem;
        }
        
        @media (max-width: 480px) {
          .landing-content {
            padding: 1.5rem;
          }
          .landing-title {
            font-size: 1.5rem;
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