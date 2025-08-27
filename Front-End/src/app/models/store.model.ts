import { User } from "./user";

export interface Store {
  id: number;
  name: string;
  location: string;
  creator: User;
  updater?: User;
  created_at: string;
  updated_at?: string;
}

export interface StoreCreate {
  name: string;
  location: string;
}
