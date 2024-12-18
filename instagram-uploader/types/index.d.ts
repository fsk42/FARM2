declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}
declare interface SidebarProps {
  user: User;
}

declare type User = {
  $id: string;
  email: string;
  userID: string;
  firstName: string;
  lastName: string;
  role?: enum;
};
declare interface MobileNavProps {
  user: User;
}
declare type SignUpParams = {
  firstName: string;
  lastName: string;
  course: string;
  email: string;
  passwort: string;
};

declare interface signInProps {
  email: string;
  passwort: string;
}

declare interface FooterProps {
  user: User;
  type?: "mobile" | "desktop";
}
declare interface getUserInfoProps {
  userID: string;
  email?: string;
}
declare interface CreateTicketProps {
  $id: string;
  title: string;
  creationDate: string;
  userID: User;
  ticketID: Ticket;
  category: enum;
  description: string;
  prio: enum;
}
declare type TicketParams = {
  $id: string;
  title: string;
  creationDate: string;
  userID: User.$id;
  ticketID;
  category: enum;
  description: string;
  prio: enum;
};
declare interface Ticket {
  $id: string;
  title: string;
  creationDate: string;
  userID: string;
  ticketID;
  category: enum;
  description: string;
  prio: enum;
}
