import { Transaction } from "./Transaction";

export interface Permission {
  id: string;
  name: string;
  ability: string;
  transaction_id: string;

  transaction?: Transaction;
}
