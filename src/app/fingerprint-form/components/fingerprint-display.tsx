import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { FingerKey, fingerParse, PatternEnum } from "@/app/utils/constants";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Toast } from "primereact/toast";
import {
  Fingerprint,
  FormDataFingerprint,
} from "@/app/utils/types/fingerprint";
import Image from "next/image";
import { updateFingerprints } from "../utils/fingerprint-api";
import { useVolunteerStore } from "@/store/use-volunteer-store";
import { useApiItem } from "@/app/hooks/use-api-item";

type FingerprintDisplayProps = {
  hand: "leftHand" | "rightHand";
  finger: FingerKey;
  formData: FormDataFingerprint;
  setFormData: Dispatch<SetStateAction<FormDataFingerprint>>;
  toast: RefObject<Toast | null>;
  viewMode: "raw" | "filtered";
};

const patternOptions = [
  { label: "Arco", value: PatternEnum.ARCH },
  { label: "Presilha", value: PatternEnum.LOOP },
  { label: "Verticilo", value: PatternEnum.WHORL },
  { label: "Verticilo Duplo", value: PatternEnum.DOUBLE_WHORL },
];

const FingerprintDisplay = ({
  hand,
  finger,
  formData,
  setFormData,
  toast,
  viewMode,
}: FingerprintDisplayProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedVolunteer } = useVolunteerStore();
  const [patternType, setPatternType] = useState<PatternEnum | null>(null);
  const [delta, setDelta] = useState<number | null>(null);
  const [numberOflines, setNumberOflines] = useState<number | null>(null);

  const { data: fingerprint, refetch } = useApiItem<Fingerprint>(
    `/fingerprints/${formData?.id}`,
  );

  const fingerData = formData[hand]?.[finger];
  const imageToShow =
    viewMode === "raw" ? fingerData?.image_data : fingerData?.image_filtered;
  const fingerName = fingerParse[finger];

  const handleReplace = () => {
    setFormData((prev) => ({
      ...prev,
      [hand]: {
        ...prev[hand],
        [finger]: {
          ...prev[hand]?.[finger],
          image_data: undefined,
          image_filtered: undefined,
        },
      },
    }));
  };

  const handleSaveAnalysis = useCallback(async () => {
    if (!selectedVolunteer) return;
    await updateFingerprints({
      delta: delta,
      pattern_type: patternType,
      volunteerId: selectedVolunteer?.id,
      numberOflines: numberOflines,
      finger: finger,
      formData: formData,
      hand: hand,
      notes: formData.notes,
    });

    toast.current?.show({
      severity: "success",
      summary: "Análise Salva",
      detail: `Análise da digital ${fingerName} atualizada com sucesso`,
      life: 3000,
    });

    setModalVisible(false);
  }, [
    delta,
    finger,
    fingerName,
    formData,
    hand,
    numberOflines,
    patternType,
    selectedVolunteer,
    toast,
  ]);

  const openModal = useCallback(async () => {
    if (fingerprint) {
      setPatternType(fingerprint.pattern_type as PatternEnum);
      setDelta(fingerprint.delta || null);
      formData.notes = fingerprint.notes || "";
    } else {
      refetch();
    }

    setModalVisible(true);
  }, [fingerprint, formData, refetch]);

  return (
    <>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#374151",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        {fingerName}
      </label>
      <Card
        style={{
          height: "300px",
          display: "flex",
          flexDirection: "column",
          border: "2px solid #10b981",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "0",
          position: "relative",
        }}
      >
        <button onClick={handleReplace} className="remove-file-button">
          <i className="pi pi-times" style={{ fontSize: "12px" }} />
        </button>

        {imageToShow && (
          <div
            onClick={openModal}
            style={{
              cursor: "pointer",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <Image
              src={`data:image/jpeg;base64,${imageToShow}`}
              height={300}
              width={300}
              alt={`${fingerName} - ${viewMode === "raw" ? "Original" : "Filtrada"}`}
              style={{
                objectFit: "cover",
                borderRadius: "12px",
                width: "100%",
                height: "100%",
              }}
            />
            {/* Overlay para indicar que é clicável */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "12px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
              }}
            >
              <i
                className="pi pi-search-plus"
                style={{
                  fontSize: "24px",
                  color: "white",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Modal de análise */}
      <Dialog
        header={`Análise da Digital - ${fingerName}`}
        headerStyle={{ padding: 15 }}
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        style={{ width: "80vw", height: "60vw" }}
        modal
        dismissableMask
      >
        <div
          style={{
            display: "flex",
            gap: "32px",
            minHeight: "600px",
            marginLeft: 10,
          }}
        >
          {/* Lado esquerdo - Imagem */}
          <div
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              padding: "5px",
            }}
          >
            {imageToShow && (
              <Image
                src={`data:image/jpeg;base64,${imageToShow}`}
                width={700}
                height={700}
                alt={`${fingerName} - ${viewMode === "raw" ? "Original" : "Filtrada"}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            )}
          </div>

          {/* Lado direito - Formulário */}
          <div
            style={{
              flex: "0 0 300px",
              display: "flex",
              padding: 10,
              paddingRight: 20,
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Tipo de Padrão
              </label>
              <Dropdown
                value={patternType}
                onChange={(e) => setPatternType(e.value)}
                options={patternOptions}
                placeholder="Selecione o padrão"
                style={{ width: "100%", padding: 5 }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Número de deltas
              </label>
              <InputNumber
                value={delta}
                onValueChange={(e) => setDelta(e.value ?? null)}
                placeholder="Digite o número de deltas"
                inputStyle={{ padding: 5 }}
                style={{ width: "100%", padding: 5 }}
                min={0}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Número de linhas
              </label>
              <InputNumber
                value={numberOflines}
                onValueChange={(e) => setNumberOflines(e.value ?? null)}
                placeholder="Digite o número de linhas"
                inputStyle={{ padding: 5 }}
                style={{ width: "100%", padding: 5 }}
                min={0}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "auto",
                paddingTop: "24px",
              }}
            >
              <Button
                label="Cancelar"
                icon="pi pi-times"
                outlined
                onClick={() => setModalVisible(false)}
                style={{ flex: 1, padding: 10 }}
              />
              <Button
                label="Salvar"
                icon="pi pi-check"
                onClick={handleSaveAnalysis}
                style={{ flex: 1, padding: 10 }}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default FingerprintDisplay;
