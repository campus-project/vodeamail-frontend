import { Group } from "./Group";

export interface Contact {
  id?: string;
  email: string;
  name: string;
  mobile_phone: string;
  address_line_1: string;
  address_line_2: string;
  country: string;
  province: string;
  city: string;
  postal_code: string;

  group_ids?: string[];
  groups?: Group[];
}
