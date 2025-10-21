import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { FingerKey, fingerParse } from "@/app/utils/constants";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Toast } from "primereact/toast";
import { FormDataFingerprint } from "@/app/utils/types/fingerprint";
import Image from "next/image";

// Enum para os tipos de padrão (ajuste conforme sua definição)
enum PatternEnum {
  ARCH = "arch",
  LOOP = "loop",
  WHORL = "whorl",
  DOUBLE_WHORL = "double_whorl",
}

type FingerprintDisplayProps = {
  hand: "leftHand" | "rightHand";
  finger: FingerKey;
  formData: FormDataFingerprint;
  setFormData: Dispatch<SetStateAction<FormDataFingerprint>>;
  toast: RefObject<Toast | null>;
  viewMode: "raw" | "filtered";
};

const FingerprintDisplay = ({
  hand,
  finger,
  formData,
  setFormData,
  toast,
  viewMode,
}: FingerprintDisplayProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [patternType, setPatternType] = useState<PatternEnum | null>(null);
  const [delta, setDelta] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");

  const fingerData = formData[hand]?.[finger];
  const imageToShow =
    viewMode === "raw" ? fingerData?.image_data : fingerData?.image_filtered;
  const fingerName = fingerParse[finger];

  const patternOptions = [
    { label: "Arco", value: PatternEnum.ARCH },
    { label: "Presilha", value: PatternEnum.LOOP },
    { label: "Verticilo", value: PatternEnum.WHORL },
    { label: "Verticilo Duplo", value: PatternEnum.DOUBLE_WHORL },
  ];

  const handleRemove = () => {
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

    toast.current?.show({
      severity: "info",
      summary: "Removido",
      detail: `Digital ${fingerName} removida`,
      life: 3000,
    });
  };

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

  const quantifyImage = () => {
    
  }

  const handleSaveAnalysis = () => {
    // Salva os dados da análise no formData
    setFormData((prev) => ({
      ...prev,
      [hand]: {
        ...prev[hand],
        [finger]: {
          ...prev[hand]?.[finger],
          pattern_type: patternType,
          delta: delta,
          notes: notes,
        },
      },
    }));

    toast.current?.show({
      severity: "success",
      summary: "Análise Salva",
      detail: `Análise da digital ${fingerName} salva com sucesso`,
      life: 3000,
    });

    setModalVisible(false);
  };

  const openModal = () => {
    // Carrega dados existentes se houver
    const existingData = formData[hand]?.[finger];
    if (existingData) {
      //   setPatternType(existingData.pattern_type || null);
      //   setDelta(existingData.delta || null);
      //   setNotes(existingData.notes || "");
    }
    setModalVisible(true);
  };

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
        <button
          onClick={handleReplace}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontSize: "12px",
            padding: "4px",
            height: "24px",
            width: "24px",
            border: "1px solid #6366f1",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "#6366f1",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          <i className="pi pi-times" style={{ fontSize: "12px" }} />
        </button>

        {imageToShow ? (
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
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: "12px",
              backgroundColor: "#f9fafb",
            }}
          >
            <i
              className="pi pi-image"
              style={{ fontSize: "24px", marginBottom: "8px" }}
            />
            <span style={{ textAlign: "center" }}>
              {viewMode === "raw" ? "Imagem original" : "Imagem filtrada"}
              <br />
              não disponível
            </span>
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
                Delta (contagem)
              </label>
              <InputNumber
                value={delta}
                onValueChange={(e) => setDelta(e.value)}
                placeholder="Digite a contagem"
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
                  padding: 5,
                }}
              >
                Observações
              </label>
              <InputTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Digite suas observações..."
                rows={6}
                style={{ width: "100%", padding: 5, resize: "vertical" }}
              />
            </div>

            <div>
              <Button
                label="Quantificar imagem"
                onClick={quantifyImage}
                style={{
                  flex: 1,
                  width: "100%",
                  padding: 10,
                  backgroundColor: "green",
                }}
              />
            </div>

            {/* Botões de ação */}
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
