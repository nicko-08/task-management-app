import { useEffect, useState } from "react";
import {
  fetchTickets,
  updateTicket,
  createTicket,
  deleteTicket,
} from "./api/tickets";
import type { Ticket } from "./types/ticket";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTitle, setNewTitle] = useState("");

  // Load tickets
  useEffect(() => {
    fetchTickets().then(setTickets);
  }, []);

  // Group tickets
  const columns = {
    todo: tickets.filter((t) => t.status?.toLowerCase() === "todo"),
    doing: tickets.filter((t) => t.status?.toLowerCase() === "doing"),
    done: tickets.filter((t) => t.status?.toLowerCase() === "done"),
  };

  // Status flow
  const getNextStatus = (current: string): string => {
    const status = current.toLowerCase();
    if (status === "todo") return "doing";
    if (status === "doing") return "done";
    return "done"; // terminal state
  };

  // Create ticket
  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    try {
      const created = await createTicket(newTitle);
      setTickets((prev) => [...prev, created]);
      setNewTitle("");
    } catch (err) {
      console.error("Failed to create ticket", err);
    }
  };

  // Move ticket
  const handleMove = async (ticket: Ticket) => {
    const newStatus = getNextStatus(ticket.status);

    try {
      await updateTicket(ticket.id, newStatus);

      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticket.id ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error("Failed to update ticket", err);
    }
  };

  // Delete ticket
  const handleDelete = async (id: number) => {
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete ticket", err);
    }
  };

  return (
    <div className="board">
      <h1>Task Board</h1>

      {/* CREATE INPUT */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
          style={{
            padding: "10px",
            flex: 1,
            borderRadius: "6px",
            border: "none",
          }}
        />

        <button
          onClick={handleCreate}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* COLUMNS */}
      <div className="columns">
        {Object.entries(columns).map(([status, items]) => (
          <div key={status} className="column">
            <h2>{status.toUpperCase()}</h2>

            {items.length === 0 && (
              <p style={{ opacity: 0.5 }}>No tasks</p>
            )}

            {items.map((t) => (
              <div
                key={t.id}
                className="ticket"
                onClick={() => handleMove(t)}
                style={{ position: "relative" }}
              >
                {t.title}

                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(t.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    padding: "2px 6px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;