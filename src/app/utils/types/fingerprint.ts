import { FingerKey, HandEnum } from "../constants";

export type FingerprintCreatePayload = {
  volunteer_id: number;
  hand: HandEnum;
  finger: FingerKey;
  notes?: string | null;
  image_data: File;
};

type Hand = Record<FingerKey, File | null>;

export type FormDataFingerprint = {
  notes: string;
  leftHand: Hand;
  rightHand: Hand;
};
