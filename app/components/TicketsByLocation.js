import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

export default function TicketsByLocation() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://metricapi-f7n6.onrender.com/metrics/tickets-by-location");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setChartData({
          labels: Object.keys(data.tickets_by_location),
          datasets: [
            {
              label: "Tickets by Location",
              data: Object.values(data.tickets_by_location),
              backgroundColor: ["#4BC0C0", "#FF9F40", "#9966FF"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return chartData ? <Pie data={chartData} /> : <p>Loading...</p>;
}
