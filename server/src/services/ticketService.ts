import {
  getAllTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket,
  getTicketById,
} from "../models/ticketModel";
import { TicketStatus } from "../types/ticket";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  todo: ["doing", "done"],
  doing: ["todo", "done"],
  done: ["todo", "doing"],
};

export const fetchTickets = async () => {
  logger.info("Fetching all tickets");

  const tickets = await getAllTickets();

  logger.debug({ count: tickets.length }, "Tickets fetched");

  return tickets;
};

export const createNewTicket = async (title: string) => {
  logger.debug({ title }, "Creating new ticket");

  if (typeof title !== "string") {
    logger.warn("Invalid title type");
    throw new AppError("Title must be a string", 400);
  }

  const trimmed = title.trim();

  if (trimmed.length === 0) {
    logger.warn("Empty title provided");
    throw new AppError("Title is required", 400);
  }

  if (trimmed.length > 100) {
    logger.warn({ length: trimmed.length }, "Title too long");
    throw new AppError("Title too long (max 100 chars)", 400);
  }

  const ticket = await createTicket(trimmed);

  logger.info(
    { id: ticket.id, title: ticket.title },
    "Ticket created successfully",
  );

  return ticket;
};

export const moveTicket = async (id: number, newStatus: TicketStatus) => {
  logger.debug({ id, newStatus }, "Attempting to move ticket");

  const ticket = await getTicketById(id);

  if (!ticket) {
    logger.warn({ id }, "Ticket not found");
    throw new AppError("Ticket not found", 404);
  }

  if (ticket.status === newStatus) {
    logger.debug({ id, status: ticket.status }, "No-op: status unchanged");
    return ticket;
  }

  const allowed = allowedTransitions[ticket.status];

  if (!allowed.includes(newStatus)) {
    logger.warn(
      { id, from: ticket.status, to: newStatus },
      "Invalid status transition",
    );
    throw new AppError("Invalid status transition", 400);
  }

  logger.info(
    { id, from: ticket.status, to: newStatus },
    "Ticket status updated",
  );

  return await updateTicketStatus(id, newStatus);
};

export const removeTicket = async (id: number) => {
  logger.debug({ id }, "Attempting to delete ticket");

  await deleteTicket(id);

  logger.info({ id }, "Ticket deleted successfully");
};
