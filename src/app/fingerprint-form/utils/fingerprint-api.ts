// utils/fingerprintApi.ts

import {
  Fingerprint,
  FormDataFingerprint,
} from "@/app/utils/types/fingerprint";
import { API_BASE_URL, FingerKey, HandKey } from "@/app/utils/constants";

/**
 * Submete as digitais para a API
 * Envia cada dedo individualmente com image_data como UploadFile
 */
export async function submitFingerprints(
  formData: FormDataFingerprint,
  volunteerId: number,
): Promise<{ success: number; errors: number }> {
  let successCount = 0;
  let errorCount = 0;

  const hands: HandKey[] = ["leftHand", "rightHand"];
  const fingers: FingerKey[] = ["thumb", "index", "middle", "ring", "pinky"];

  for (const hand of hands) {
    for (const finger of fingers) {
      const fingerData = formData[hand][finger];

      // Só envia se tiver image_data como File
      if (!fingerData?.image_data || !(fingerData.image_data instanceof File)) {
        continue;
      }

      const submitData = new FormData();
      submitData.append("volunteer_id", volunteerId.toString());
      submitData.append("hand", hand === "leftHand" ? "left" : "right");
      submitData.append("finger", finger);
      submitData.append("image_data", fingerData.image_data);

      try {
        const response = await fetch(`${API_BASE_URL}/fingerprints`, {
          method: "POST",
          body: submitData,
        });

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
          console.error(
            `Erro ao enviar ${finger} da mão ${hand}:`,
            await response.text(),
          );
        }
      } catch (error) {
        errorCount++;
        console.error(`Erro ao enviar ${finger} da mão ${hand}:`, error);
      }
    }
  }

  return { success: successCount, errors: errorCount };
}

export function transformFingerprintsToFormData(
  fingerprints: Fingerprint[],
): FormDataFingerprint {
  const formData: FormDataFingerprint = {
    leftHand: {
      thumb: { image_data: "", image_filtered: null },
      index: { image_data: "", image_filtered: null },
      middle: { image_data: "", image_filtered: null },
      ring: { image_data: "", image_filtered: null },
      pinky: { image_data: "", image_filtered: null },
    },
    rightHand: {
      thumb: { image_data: "", image_filtered: null },
      index: { image_data: "", image_filtered: null },
      middle: { image_data: "", image_filtered: null },
      ring: { image_data: "", image_filtered: null },
      pinky: { image_data: "", image_filtered: null },
    },
    notes: "",
  };

  // Preenche com os dados da API
  fingerprints.forEach((fingerprint: Fingerprint) => {
    const hand: HandKey =
      fingerprint.hand === "left" ? "leftHand" : "rightHand";
    const finger: FingerKey = fingerprint.finger;

    formData[hand][finger] = {
      image_data: fingerprint.image_data, // base64
      image_filtered: fingerprint.image_filtered, // base64 ou null
    };
  });

  return formData;
}
