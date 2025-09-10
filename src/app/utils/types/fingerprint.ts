import { FingerEnum, HandEnum } from "../constants";

export type FingerprintCreatePayload = {
  volunteer_id: number;
  hand: HandEnum;
  finger: FingerEnum;
  notes?: string | null;
  image_data: File;
}