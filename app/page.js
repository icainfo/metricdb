import TicketsByCategory from "./components/TicketsByCategory";
import TicketsByReportMethod from "./components/TicketsByReportMethod";
import TicketsByServiceType from "./components/TicketsByServiceType";
import TicketsByLocation from "./components/TicketsByLocation";
import TicketsByDepartment from "./components/TicketsByDepartment";

export default function Home() {
  return (
    <div>
      <h1>HelpScout Metrics Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <TicketsByCategory />
        <TicketsByReportMethod />
        <TicketsByServiceType />
        <TicketsByLocation />
        <TicketsByDepartment />
      </div>
    </div>
  );
}
