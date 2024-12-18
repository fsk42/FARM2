"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../server/appwrite";
import { parseStringify } from "../utils";

const { APPWRITE_DATABASE_ID: DATABASE_ID, APPWRITE_TICKET_COLLECTION_ID: TICKET_COLLECTION_ID } = process.env;

export const createticket = async ({ ...ticketData }: TicketParams) => {
  const { title, creationDate, category, description, prio } = ticketData;
  const { account } = await createSessionClient();
  const user = await account.get();
  const userID = user.$id;
  try {
    const { database } = await createAdminClient();
    const newTicket = await database.createDocument(
      DATABASE_ID!, TICKET_COLLECTION_ID!, ID.unique(), {
        ...ticketData, userID, ticketID: ID.unique()
      }
    );
    return parseStringify(newTicket);
  } catch (error) {
    console.log(error);
  }
};

export const getAllTicketInfo = async () => {
  try {
    const { database } = await createAdminClient();
    const ticket = await database.listDocuments(
      DATABASE_ID!, TICKET_COLLECTION_ID!,
      [Query.select(["$id", "title", "userID", "creationDate", "category", "description", "status", "prio"])]
    );
    return parseStringify(ticket.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getTicketCount = async () => {
  try {
    const { database } = await createAdminClient();
    const ticketList = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_TICKET_COLLECTION_ID!,
      [Query.limit(1)]
    );
    return ticketList.total;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const updateTicketStatus = async (ticketId: string, newStatus: string) => {
  try {
    const { database } = await createAdminClient();
    const updatedTicket = await database.updateDocument(
      DATABASE_ID!,
      TICKET_COLLECTION_ID!,
      ticketId,
      { status: newStatus }
    );
    return parseStringify(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};