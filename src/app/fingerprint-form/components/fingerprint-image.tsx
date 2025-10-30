import { API_BASE_URL } from "@/app/utils/constants";
import { Fingerprint } from "@/app/utils/types/fingerprint";
import Image from "next/image";
import { useState, useRef, FC, useEffect } from "react";

interface Point {
  x: number;
  y: number;
}

const POINT_SIZE = 50;

const FingerprintImage: FC<PropTypes> = ({
  imageToShow,
  fingerprint,
  viewMode,
}) => {
  const [pointCore, setPointCore] = useState<Point>({ x: 100, y: 100 });
  const [pointDelta, setPointDelta] = useState<Point>({ x: 300, y: 200 });
  const [dragging, setDragging] = useState<"pointCore" | "pointDelta" | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown =
    (pointId: "pointCore" | "pointDelta") => (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(pointId);
    };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log({ x, y });

    if (x < 0 || y < 0) return;

    if (dragging === "pointCore") {
      setPointCore({ x, y });
    } else if (dragging === "pointDelta") {
      setPointDelta({ x, y });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    const fetchDetection = async () => {
      if (!fingerprint) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/fingerprint/detect-singular-points`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fingerprint_id: fingerprint.id,
              image_type: "filtered",
            }),
          },
        );

        const data = await response.json();

        if (data?.cores?.length > 0) {
          setPointCore(data.cores[0]);
        }
        if (data?.deltas?.length > 0) {
          setPointDelta(data.deltas[0]);
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchDetection();
  }, [fingerprint]);

  return (
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
      {/* Sua imagem */}
      <Image
        src={`data:image/jpeg;base64,${imageToShow}`}
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

      {/* SVG para a linha */}
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
        <line
          x1={pointCore.x}
          y1={pointCore.y}
          x2={pointDelta.x}
          y2={pointDelta.y}
          stroke="#0f0"
          strokeWidth="2"
        />
      </svg>

      {/* Point Core */}
      <div
        style={{
          position: "absolute",
          left: pointCore.x - POINT_SIZE / 2,
          top: pointCore.y - POINT_SIZE / 2,
          cursor: "grab",
        }}
      >
        <svg
          width={POINT_SIZE}
          height={POINT_SIZE}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          onMouseDown={handleMouseDown("pointCore")}
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

      {/* Point Delta */}
      <div
        style={{
          position: "absolute",
          left: pointDelta.x - POINT_SIZE / 2,
          top: pointDelta.y - POINT_SIZE / 2,
          cursor: "grab",
        }}
      >
        <svg
          width={POINT_SIZE}
          height={POINT_SIZE}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          onMouseDown={handleMouseDown("pointDelta")}
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
    </div>
  );
};

interface PropTypes {
  imageToShow: Blob | string;
  fingerprint: Fingerprint | undefined;
  viewMode: string;
}

export default FingerprintImage;
