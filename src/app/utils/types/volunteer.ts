import { Fingerprint } from "./fingerprint";

export type Volunteer = {
  id: number;
  name: string;
  age: number;
  gender: "male" | "female";
  phone: string;
  description?: string;
  created_at: string;
  updated_at: string;
  fingerprints: Fingerprint[];
};
