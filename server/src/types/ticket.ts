export type TicketStatus = "todo" | "doing" | "done";

export interface Ticket {
  id: number;
  title: string;
  status: TicketStatus;
  created_at: string;
}

export interface CreateTicketDTO {
  title: string;
}

export interface UpdateTicketDTO {
  status: TicketStatus;
}
