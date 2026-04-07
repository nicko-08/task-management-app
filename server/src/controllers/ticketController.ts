import { Request, Response } from "express";
import {
  fetchTickets,
  createNewTicket,
  moveTicket,
  removeTicket,
} from "../services/ticketService";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateTicketDTO, UpdateTicketDTO } from "../types/ticket";

export const getTickets = asyncHandler(async (_: Request, res: Response) => {
  const tickets = await fetchTickets();
  res.json(tickets);
});

export const createTicket = asyncHandler(
  async (req: Request<{}, {}, CreateTicketDTO>, res: Response) => {
    const ticket = await createNewTicket(req.body.title);
    res.status(201).json(ticket);
  },
);

export const updateTicket = asyncHandler(
  async (req: Request<{ id: string }, {}, UpdateTicketDTO>, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new Error("Invalid ticket ID");
    }

    const updated = await moveTicket(id, req.body.status);
    res.json(updated);
  },
);

export const deleteTicket = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new Error("Invalid ticket ID");
    }

    await removeTicket(id);
    res.json({ message: "Deleted successfully" });
  },
);
