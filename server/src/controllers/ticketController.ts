import { Request, Response } from "express";
import { pool } from "../db";

export const getTickets = async (_: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM tickets ORDER BY id ASC");
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const result = await pool.query(
      "INSERT INTO tickets (title) VALUES ($1) RETURNING *",
      [title],
    );

    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE tickets SET status=$1 WHERE id=$2 RETURNING *",
      [status, id],
    );

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM tickets WHERE id=$1", [id]);

    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};
