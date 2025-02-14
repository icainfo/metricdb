import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function TicketsByDepartment() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://metricapi-f7n6.onrender.com/metrics/tickets-by-department");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setChartData({
          labels: Object.keys(data.tickets_by_department),
          datasets: [
            {
              label: "Tickets by Department",
              data: Object.values(data.tickets_by_department),
              backgroundColor: "rgba(255, 159, 64, 0.6)",
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
