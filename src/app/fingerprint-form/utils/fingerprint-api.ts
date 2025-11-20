import {
  Fingerprint,
  FormDataFingerprint,
  Point,
} from "@/app/utils/types/fingerprint";
import {
  API_BASE_URL,
  FingerKey,
  HandKey,
  PatternEnum,
} from "@/app/utils/constants";

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

export async function updateFingerprints({
  volunteerId,
  hand,
  number_deltas,
  pattern_type,
  id,
  numberOflines,
  notes,
  finger,
  core,
  deltas,
  formData,
}: UpdateFingerprintParams): Promise<{ success: number; errors: number }> {
  let successCount = 0;
  let errorCount = 0;

  if (!id) {
    return { success: 0, errors: 1 };
  }

  const fingerData = formData[hand]?.[finger];
  const submitData = new FormData();

  // campos obrigatórios do endpoint
  submitData.append("volunteer_id", String(volunteerId));
  submitData.append("hand", hand === "leftHand" ? "left" : "right");
  submitData.append("finger", finger);

  // imagens: só envia se tiver (não força overwrite pra null)
  if (fingerData?.image_data) {
    submitData.append("image_data", fingerData.image_data);
  }
  if (fingerData?.image_filtered) {
    submitData.append("image_filtered", fingerData.image_filtered);
  }

  if (pattern_type) {
    submitData.append("pattern_type", pattern_type);
  }

  if (number_deltas !== undefined && number_deltas !== null) {
    submitData.append("number_deltas", String(number_deltas));
  }

  // número de linhas => backend espera "ridge_counts"
  if (numberOflines !== undefined && numberOflines !== null) {
    submitData.append("ridge_counts", String(numberOflines));
  }

  // core: precisa ser JSON string, ex: {"x":120,"y":200}
  if (core !== undefined && core !== null) {
    submitData.append("core", JSON.stringify(core));
  }

  // deltas: também JSON string, ex: [{"x":80,"y":230}, ...]
  if (deltas && deltas.length > 0) {
    submitData.append("deltas", JSON.stringify(deltas));
  }

  if (notes) {
    submitData.append("notes", notes);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/fingerprints/${id}`, {
      method: "PUT",
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

    formData.id = fingerprint.id;
    formData[hand][finger] = {
      image_data: fingerprint.image_data, // base64
      image_filtered: fingerprint.image_filtered, // base64 ou null
    };
  });

  return formData;
}

type UpdateFingerprintParams = {
  volunteerId: number;
  formData: FormDataFingerprint;
  hand: HandKey;
  finger: FingerKey;
  pattern_type: PatternEnum | null;
  notes?: string;
  number_deltas: number | null;
  id?: number;
  core: Point | null;
  deltas: [Point] | [];
  numberOflines?: number;
};
