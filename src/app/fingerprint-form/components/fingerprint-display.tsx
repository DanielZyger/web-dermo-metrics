import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import {
  FingerKey,
  fingerParse,
  PatternEnum,
  API_BASE_URL,
} from "@/app/utils/constants";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Toast } from "primereact/toast";
import {
  Fingerprint,
  FormDataFingerprint,
  Point,
} from "@/app/utils/types/fingerprint";
import Image from "next/image";
import { updateFingerprints } from "../utils/fingerprint-api";
import { useVolunteerStore } from "@/store/use-volunteer-store";
import { useApiItem } from "@/app/hooks/use-api-item";
import FingerprintImage from "./fingerprint-image";

type FingerprintDisplayProps = {
  hand: "leftHand" | "rightHand";
  fingerprints: Fingerprint[];
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
  fingerprints,
  setFormData,
  toast,
  viewMode,
}: FingerprintDisplayProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedVolunteerId } = useVolunteerStore();

  const [patternType, setPatternType] = useState<PatternEnum | null>(null);
  const [number_deltas, setNumber_deltas] = useState<number | null>(null);
  const [numberOflines, setNumberOflines] = useState<number | null>(null);

  const [corePoint, setCorePoint] = useState<Point>({ x: 100, y: 100 });
  const [deltaPoint, setDeltaPoint] = useState<Point>({ x: 300, y: 200 });

  const correctFingerprint = useMemo(() => {
    if (!fingerprints || !fingerprints.length) return;
    return fingerprints.find((fp) => {
      const handLabel = hand === "leftHand" ? "left" : "right";
      return fp.hand === handLabel && fp.finger === finger;
    });
  }, [fingerprints, hand, finger]);

  const { data: updatedFingerprint, refetch } = useApiItem<Fingerprint>(
    `/fingerprints/${correctFingerprint?.id}`,
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
    if (!selectedVolunteerId || !correctFingerprint) return;

    await updateFingerprints({
      id: correctFingerprint.id,
      volunteerId: selectedVolunteerId,
      hand,
      finger,
      number_deltas,
      pattern_type: patternType,
      numberOflines,
      notes: formData.notes,
      core: corePoint
        ? {
            x: Math.round(corePoint.x),
            y: Math.round(corePoint.y),
          }
        : null,
      deltas: deltaPoint
        ? [
            {
              x: Math.round(deltaPoint.x),
              y: Math.round(deltaPoint.y),
            },
          ]
        : [],
    });

    toast.current?.show({
      severity: "success",
      summary: "Análise Salva",
      detail: `Análise da digital ${fingerName} atualizada com sucesso`,
      life: 3000,
    });

    setModalVisible(false);
  }, [
    correctFingerprint,
    corePoint,
    number_deltas,
    deltaPoint,
    finger,
    fingerName,
    formData,
    hand,
    numberOflines,
    patternType,
    selectedVolunteerId,
    toast,
  ]);

  const openModal = useCallback(() => {
    refetch();
    setModalVisible(true);
  }, [refetch]);

  useEffect(() => {
    if (!modalVisible) return;

    if (
      updatedFingerprint &&
      (updatedFingerprint.core ||
        (updatedFingerprint.deltas && updatedFingerprint.deltas.length > 0))
    ) {
      console.log("usando updatedFingerprint", updatedFingerprint);

      if (updatedFingerprint.pattern_type) {
        setPatternType(updatedFingerprint.pattern_type as PatternEnum);
      } else {
        setPatternType(null);
      }

      setNumber_deltas(updatedFingerprint.number_deltas ?? null);
      setNumberOflines(updatedFingerprint.ridge_counts ?? null);

      if (updatedFingerprint.core) {
        setCorePoint({
          x: updatedFingerprint.core.x,
          y: updatedFingerprint.core.y,
        });
      }

      if (updatedFingerprint.deltas && updatedFingerprint.deltas.length > 0) {
        setDeltaPoint({
          x: updatedFingerprint.deltas[0].x,
          y: updatedFingerprint.deltas[0].y,
        });
      }

      return;
    }

    const runDetection = async () => {
      if (!correctFingerprint) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/fingerprint/detect-singular-points`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fingerprint_id: correctFingerprint.id,
              image_type: "filtered",
            }),
          },
        );

        if (!response.ok) {
          console.error("Erro na detecção:", await response.text());
          return;
        }

        const data = await response.json();
        console.log("response detect-singular-points", data);

        if (data?.cores?.length > 0) {
          setCorePoint({
            x: data.cores[0].x,
            y: data.cores[0].y,
          });
        }

        if (data?.deltas?.length > 0) {
          setNumber_deltas(data.deltas.length);
          setDeltaPoint({
            x: data.deltas[0].x,
            y: data.deltas[0].y,
          });
        }

        if (data?.ridge_counts != null) {
          setNumberOflines(data.ridge_counts);
        }

        if (data?.pattern_type) {
          setPatternType(data.pattern_type as PatternEnum);
        }
      } catch (error) {
        console.error("Erro ao detectar pontos singulares:", error);
      }
    };

    runDetection();
  }, [modalVisible, updatedFingerprint, correctFingerprint]);

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
              alt={`${fingerName} - ${
                viewMode === "raw" ? "Original" : "Filtrada"
              }`}
              style={{
                objectFit: "cover",
                borderRadius: "12px",
                width: "100%",
                height: "100%",
              }}
            />

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
              <FingerprintImage
                imageToShow={imageToShow}
                viewMode={viewMode}
                corePoint={corePoint}
                deltaPoint={deltaPoint}
                setCorePoint={setCorePoint}
                setDeltaPoint={setDeltaPoint}
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
                value={number_deltas}
                onValueChange={(e) => setNumber_deltas(e.value ?? null)}
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
