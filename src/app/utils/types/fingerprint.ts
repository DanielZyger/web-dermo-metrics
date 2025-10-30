import { FingerKey, HandEnum } from "../constants";

export type FingerprintCreatePayload = {
  volunteer_id: number;
  hand: HandEnum;
  finger: FingerKey;
  notes?: string | null;
  image_data: File;
};

type FingerInputType = {
  image_data: string | Blob;
  image_filtered: string | Blob | null;
};

type Hand = Record<FingerKey, FingerInputType>;

export type FormDataFingerprint = {
  id?: number;
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
  image_data: string;
  image_filtered: string | null;
  created_at: string;
};
