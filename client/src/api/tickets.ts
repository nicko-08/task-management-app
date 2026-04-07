import axios from "axios";
import type { Ticket } from "../types/ticket";

const API_URL = "http://localhost:5000/tickets";

export const fetchTickets = async (): Promise<Ticket[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createTicket = async (title: string): Promise<Ticket> => {
  const res = await axios.post(API_URL, { title });
  return res.data;
};

export const updateTicket = async (id: number, status: string) => {
  return axios.patch(`${API_URL}/${id}`, { status });
};

export const deleteTicket = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
