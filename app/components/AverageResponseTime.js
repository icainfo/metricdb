"use client";
import { useEffect, useState } from "react";

export default function AverageResponseTime() {
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

  return <div>Average Response Time: {avgTime} hours</div>;
}
