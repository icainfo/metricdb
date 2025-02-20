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

// Updated color constants with better contrast
const MARYLAND_RED = "#e21833";
const MARYLAND_GOLD = "#ffd200";
const WHITE = "#ffffff";
const BLACK = "#000000";
const BACKGROUND_OVERLAY = "rgba(255, 255, 255, 0.97)"; // Increased opacity
const TEXT_COLOR = "#000000"; // Enforced black text
const MARYLAND_COLORS = [
  MARYLAND_RED,
  MARYLAND_GOLD,
  "#ab0d1f", // darker red
  "#d4af37", // darker gold
  "#8b0000", // deep red
];

// Update chart options with forced colors
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.5,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: TEXT_COLOR, // Forced black text
        font: { size: 12, weight: '600' }, // Increased weight
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker background
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
        color: TEXT_COLOR, // Forced black text
        font: { size: 11, weight: '500' }, // Increased weight
        maxRotation: 45,
        minRotation: 45,
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { 
        color: TEXT_COLOR, // Forced black text
        font: { size: 11, weight: '500' }, // Increased weight
      },
      grid: { color: 'rgba(0,0,0,0.1)' },
    },
  },
};

// [Previous fetchChartData and ChartComponent remain the same...]

// Updated Dashboard component with forced colors and better contrast
const Dashboard = () => {
  const [activeChart, setActiveChart] = useState('overview');
  
  // [Previous charts object remains the same...]

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
          background: linear-gradient(${BACKGROUND_OVERLAY}, ${BACKGROUND_OVERLAY}),
                      url('/background-stadium.jpg') no-repeat center center/cover;
          background-attachment: fixed;
          color: ${TEXT_COLOR};
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
        
        .logo {
          height: 50px;
          width: auto;
        }
        
        h1 {
          color: ${MARYLAND_RED} !important;
          font-size: 1.8rem;
          margin: 0;
          font-weight: 600;
        }
        
        h2 {
          color: ${TEXT_COLOR} !important;
          font-weight: 600;
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
          background: ${WHITE};
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          text-align: center;
        }
        
        .metric-card h2 {
          color: ${MARYLAND_RED} !important;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .metric-value {
          font-size: 2.5rem;
          color: ${TEXT_COLOR};
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
          background: ${WHITE};
          border: 2px solid ${MARYLAND_RED};
          color: ${MARYLAND_RED};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
        }
        
        .tab-button:hover {
          background: ${MARYLAND_RED};
          color: ${WHITE};
        }
        
        .tab-button.active {
          background: ${MARYLAND_RED};
          color: ${WHITE};
        }
        
        .chart-container {
          background: ${WHITE};
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
          background: ${WHITE};
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .chart-title {
          color: ${TEXT_COLOR} !important;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 600;
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
          color: ${TEXT_COLOR};
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

        /* Force text colors in dark mode */
        @media (prefers-color-scheme: dark) {
          .dashboard {
            background: linear-gradient(${BACKGROUND_OVERLAY}, ${BACKGROUND_OVERLAY}),
                        url('/background-stadium.jpg') no-repeat center center/cover;
          }
          
          h1, h2, p, .chart-title, .metric-value {
            color: ${TEXT_COLOR} !important;
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