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

const fetchChartData = async (dataKey, range) => {
  try {
    const res = await fetch(`/api/proxy/${dataKey}?range=${range}`);
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
        label: dataKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
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
};

const ChartComponent = ({ title, dataKey, type, range }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChartData(dataKey, range);
        setChartData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dataKey, range]);

  return (
    <div className="chart-card">
      <h2 className="chart-title">{title}</h2>
      <div className="chart-content">
        {isLoading ? <div className="loading-spinner">Loading...</div> :
         error ? <div className="error-message">{error}</div> :
         chartData && chartData.labels && chartData.datasets ? (
          <div className="chart-wrapper">
            {type === "bar" ? <Bar data={chartData} options={chartOptions} /> : <Pie data={chartData} options={{...chartOptions, aspectRatio: 1}} />}
          </div>
        ) : <div className="error-message">No data available</div>}
      </div>
    </div>
  );
};

const AverageResponseTime = ({ range }) => {
  const [avgTime, setAvgTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/proxy/average-ticket-duration?range=${range}`);
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
  }, [range]);

  return (
    <div className="metric-card">
      <h2>Average Ticket Duration</h2>
      <div className="metric-value">
        {isLoading ? <div className="loading-spinner">Loading...</div> : <span>{avgTime} hours</span>}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeChart, setActiveChart] = useState('overview');
  const [range, setRange] = useState('all');

  const charts = {
    overview: { title: "Overview" },
    category: {
      title: "Tickets by Category",
      component: <ChartComponent title="Tickets by Category" dataKey="tickets-by-category" type="bar" range={range} />
    },
    reportMethod: {
      title: "Report Methods",
      component: <ChartComponent title="Tickets by Report Method" dataKey="tickets-by-report-method" type="pie" range={range} />
    },
    serviceType: {
      title: "Service Types",
      component: <ChartComponent title="Tickets by Service Type" dataKey="tickets-by-service-type" type="bar" range={range} />
    },
    location: {
      title: "Locations",
      component: <ChartComponent title="Tickets by Location" dataKey="tickets-by-location" type="pie" range={range} />
    },
    department: {
      title: "Departments",
      component: <ChartComponent title="Tickets by Department" dataKey="tickets-by-department" type="bar" range={range} />
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <AverageResponseTime range={range} />
            <select value={range} onChange={e => setRange(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
              <option value="all">All Time</option>
              <option value="1m">Last 1 Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="12m">Last 12 Months</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>
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
                <div key={key} className="overview-chart">{component}</div>
              ))}
            </div>
          ) : (
            <div className="single-chart">{charts[activeChart].component}</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function TicketMetricsDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  return authenticated ? <Dashboard /> : <LandingPage onAuthenticated={() => setAuthenticated(true)} />;
}
