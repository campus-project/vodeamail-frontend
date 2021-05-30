import { Contact } from "./Contact";

export interface Group {
  id?: string;
  name: string;
  description: string;

  contact_ids?: string[];
  contacts?: Contact[];
}
