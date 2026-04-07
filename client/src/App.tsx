import { useEffect, useState } from "react";
import { fetchTickets } from "./api/tickets";
import type { Ticket } from "./types/ticket";

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetchTickets().then(setTickets);
  }, []);

  const columns = {
    todo: tickets.filter((t) => t.status === "Todo"),
    doing: tickets.filter((t) => t.status === "In progress"),
    done: tickets.filter((t) => t.status === "Done"),
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Board</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {Object.entries(columns).map(([status, items]) => (
          <div key={status} style={{ flex: 1 }}>
            <h2>{status.toUpperCase()}</h2>

            {items.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#222",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                {t.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;