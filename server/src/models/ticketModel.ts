import { pool } from "../db";
import { Ticket, TicketStatus } from "../types/ticket";

export const getAllTickets = async (): Promise<Ticket[]> => {
  const result = await pool.query<Ticket>(
    "SELECT * FROM tickets ORDER BY id ASC",
  );
  return result.rows;
};

export const getTicketById = async (id: number): Promise<Ticket | null> => {
  const result = await pool.query<Ticket>("SELECT * FROM tickets WHERE id=$1", [
    id,
  ]);

  return result.rows[0] || null;
};

export const createTicket = async (title: string): Promise<Ticket> => {
  const result = await pool.query<Ticket>(
    "INSERT INTO tickets (title) VALUES ($1) RETURNING *",
    [title],
  );

  return result.rows[0];
};

export const updateTicketStatus = async (
  id: number,
  status: TicketStatus,
): Promise<Ticket> => {
  const result = await pool.query<Ticket>(
    "UPDATE tickets SET status=$1 WHERE id=$2 RETURNING *",
    [status, id],
  );

  if (result.rows.length === 0) {
    throw new Error("Ticket not found");
  }

  return result.rows[0];
};

export const deleteTicket = async (id: number): Promise<void> => {
  const result = await pool.query(
    "DELETE FROM tickets WHERE id=$1 RETURNING id",
    [id],
  );

  if (result.rowCount === 0) {
    throw new Error("Ticket not found");
  }
};
