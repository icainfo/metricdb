import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function TicketsByServiceType() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://metricapi-f7n6.onrender.com/metrics/tickets-by-service-type");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setChartData({
          labels: Object.keys(data.tickets_by_service_type),
          datasets: [
            {
              label: "Tickets by Service Type",
              data: Object.values(data.tickets_by_service_type),
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return chartData ? <Bar data={chartData} /> : <p>Loading...</p>;
}
