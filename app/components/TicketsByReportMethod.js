import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

export default function TicketsByReportMethod() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://metricapi-f7n6.onrender.com/metrics/tickets-by-report-method");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setChartData({
          labels: Object.keys(data.tickets_by_report_method),
          datasets: [
            {
              label: "Tickets by Report Method",
              data: Object.values(data.tickets_by_report_method),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
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
