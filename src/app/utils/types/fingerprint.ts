import { FingerKey, HandEnum } from "../constants";

export type FingerprintCreatePayload = {
  volunteer_id: number;
  hand: HandEnum;
  finger: FingerKey;
  notes?: string | null;
  image_data: File;
};

type FingerInputType = {
  image_data: string | null;
  image_filtered: string | null;
  file: File | null;
};

type Hand = Record<FingerKey, FingerInputType | null>;

export type FormDataFingerprint = {
  notes: string;
  leftHand: Hand;
  rightHand: Hand;
};

export type Fingerprint = {
  id: number;
  volunteer_id: number;
  hand: HandEnum;
  finger: FingerKey;
  pattern_type: string | null;
  delta: number | null;
  notes: string | null;
  image_data: string | null;
  image_filtered: string | null;
  created_at: string;
};
