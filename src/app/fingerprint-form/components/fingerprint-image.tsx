import { API_BASE_URL, PatternEnum } from "@/app/utils/constants";
import Image from "next/image";
import type React from "react";
import {
  useState,
  useRef,
  FC,
  SetStateAction,
  Dispatch,
  useEffect,
  useCallback,
} from "react";

interface Point {
  x: number;
  y: number;
}

const POINT_SIZE = 50;
const MAX_POINTS = 2;

interface PropTypes {
  imageToShow: Blob | string;
  hand: "leftHand" | "rightHand";
  viewMode: string;
  cores: Point[];
  deltas: Point[];
  setCores: Dispatch<SetStateAction<Point[]>>;
  setDeltas: Dispatch<SetStateAction<Point[]>>;
  fingerprintType: PatternEnum | null;
  onClearInputs: () => void;
  setNumberDeltas: Dispatch<SetStateAction<number | null>>;
  number_deltas: number | null;
  fingerprintId: number | undefined;
  onRidgesCalculated?: Dispatch<SetStateAction<number | null>>;
}

type DraggingState =
  | { type: "core"; index: number }
  | { type: "delta"; index: number }
  | null;

const FingerprintImage: FC<PropTypes> = ({
  imageToShow,
  viewMode,
  cores,
  deltas,
  setCores,
  setDeltas,
  fingerprintType,
  number_deltas,
  hand,
  setNumberDeltas,
  onClearInputs,
  fingerprintId,
  onRidgesCalculated,
}) => {
  const [dragging, setDragging] = useState<DraggingState>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageSrc =
    typeof imageToShow === "string"
      ? `data:image/jpeg;base64,${imageToShow}`
      : "";

  const hasCores = cores.length > 0;
  const hasDeltas = deltas.length > 0;

  const getDefaultPoint = (): Point => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: rect.width / 2,
        y: rect.height / 2,
      };
    }
    return { x: 350, y: 350 };
  };

  const handleMouseDown =
    (type: "core" | "delta", index: number) =>
    (e: React.MouseEvent<HTMLOrSVGElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging({ type, index });
    };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x <= 0 || y <= 0) return;

    if (dragging.type === "core") {
      setCores((prev) =>
        prev.map((p, idx) => (idx === dragging.index ? { x, y } : p)),
      );
    } else if (dragging.type === "delta") {
      setDeltas((prev) =>
        prev.map((p, idx) => (idx === dragging.index ? { x, y } : p)),
      );
    }
  };

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleClearPoints = useCallback(() => {
    setDragging(null);
    setCores([]);
    setDeltas([]);
    onClearInputs();
  }, [setCores, setDeltas, onClearInputs]);

  const handleAddCore = () => {
    setCores((prev) => {
      if (prev.length >= MAX_POINTS) return prev;
      return [...prev, getDefaultPoint()];
    });
  };

  const handleAddDelta = () => {
    setDeltas((prev) => {
      if (prev.length >= MAX_POINTS) return prev;
      return [...prev, getDefaultPoint()];
    });
    setNumberDeltas((number_deltas || 0) + 1);
  };

  // se o tipo de digital virar "arch", limpa tudo
  useEffect(() => {
    if (
      fingerprintType &&
      fingerprintType.toString().toLowerCase() === "arch"
    ) {
      handleClearPoints();
    }
  }, [fingerprintType, handleClearPoints]);

  // ============================
  // CHAMAR BACKEND /count-ridges
  // quando usuário parar de mover (dragging === null)
  // e tiver pelo menos 1 core e 1 delta
  // ============================

  const callRidgesApi = useCallback(async () => {
    if (!hasCores || !hasDeltas) return;
    if (!fingerprintId) return;

    try {
      const formData = new FormData();
      formData.append("fingerprint_id", String(fingerprintId));
      formData.append("core", JSON.stringify(cores));
      formData.append("deltas", JSON.stringify(deltas));

      const response = await fetch(`${API_BASE_URL}/fingerprint/count-ridges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fingerprint_id: fingerprintId,
          cores: cores,
          deltas: deltas,
        }),
      });

      if (!response.ok) {
        console.error("Erro ao contar ridges:", await response.text());
        return;
      }

      const data = await response.json();
      if (onRidgesCalculated) {
        onRidgesCalculated(data.total_count);
      }
    } catch (error) {
      console.error("Erro ao chamar /count-ridges:", error);
    }
  }, [cores, deltas, hasCores, hasDeltas, fingerprintId, onRidgesCalculated]);

  useEffect(() => {
    console.log("dragging", dragging);
    if (!dragging && !hasCores && !hasDeltas) return;

    const timeoutId = window.setTimeout(() => {
      void callRidgesApi();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dragging, hasCores, hasDeltas, cores, deltas, callRidgesApi]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
      }}
    >
      {/* Área da imagem + overlays */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          position: "relative",
          display: "inline-block",
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            {hand == "leftHand" ? "ULNA" : "RÁDIO"}
          </h3>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            {hand == "rightHand" ? "ULNA" : "RÁDIO"}
          </h3>
        </div>

        <Image
          src={imageSrc}
          width={700}
          height={700}
          alt={viewMode === "raw" ? "Original" : "Filtrada"}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: "8px",
          }}
        />

        {/* Linhas entre pares core/delta (core[i] ↔ delta[i]) */}
        {hasCores && hasDeltas && (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {cores.map((core, index) => {
              const delta = deltas[index];
              if (!delta) return null;
              return (
                <line
                  key={index}
                  x1={core.x}
                  y1={core.y}
                  x2={delta.x}
                  y2={delta.y}
                  stroke="#0f0"
                  strokeWidth={2}
                />
              );
            })}
          </svg>
        )}

        {/* Cores */}
        {cores.map((core, index) => (
          <div
            key={`core-${index}`}
            style={{
              position: "absolute",
              left: core.x - POINT_SIZE / 2,
              top: core.y - POINT_SIZE / 2,
              cursor: "grab",
            }}
          >
            <svg
              width={POINT_SIZE}
              height={POINT_SIZE}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              onMouseDown={handleMouseDown("core", index)}
            >
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="#00f"
                strokeWidth="8"
              />
              <circle cx="50" cy="50" r="10" fill="#00f" />
            </svg>
          </div>
        ))}

        {/* Deltas */}
        {deltas.map((delta, index) => (
          <div
            key={`delta-${index}`}
            style={{
              position: "absolute",
              left: delta.x - POINT_SIZE / 2,
              top: delta.y - POINT_SIZE / 2,
              cursor: "grab",
            }}
          >
            <svg
              width={POINT_SIZE}
              height={POINT_SIZE}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              onMouseDown={handleMouseDown("delta", index)}
            >
              <path
                d="M 50 20 L 20 80 L 80 80 Z"
                fill="#f00"
                fillOpacity="0.15"
                stroke="#f00"
                strokeWidth="8"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Barra de controles na lateral direita */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "40px",
        }}
      >
        <button
          type="button"
          onClick={handleAddCore}
          disabled={cores.length >= MAX_POINTS}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: 500,
            borderRadius: "6px",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: cores.length >= MAX_POINTS ? "not-allowed" : "pointer",
            backgroundColor: cores.length >= MAX_POINTS ? "#9ca3af" : "#2563eb",
            color: "#ffffff",
            minWidth: "150px",
          }}
        >
          <i
            className="pi pi-bullseye"
            style={{ fontSize: "14px", color: "inherit" }}
          />
          <span>Adicionar core</span>
        </button>

        <button
          type="button"
          onClick={handleAddDelta}
          disabled={deltas.length >= MAX_POINTS}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: 500,
            borderRadius: "6px",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: deltas.length >= MAX_POINTS ? "not-allowed" : "pointer",
            backgroundColor:
              deltas.length >= MAX_POINTS ? "#9ca3af" : "#dc2626",
            color: "#ffffff",
            minWidth: "150px",
          }}
        >
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "14px", color: "inherit" }}
          />
          <span>Adicionar delta</span>
        </button>

        <button
          type="button"
          onClick={handleClearPoints}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: 500,
            borderRadius: "6px",
            border: "1px solid #9ca3af",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            backgroundColor: "#e5e7eb",
            color: "#1f2937",
            minWidth: "150px",
          }}
        >
          <i
            className="pi pi-eraser"
            style={{ fontSize: "14px", color: "inherit" }}
          />
          <span>Limpar pontos</span>
        </button>
      </div>
    </div>
  );
};

export default FingerprintImage;
