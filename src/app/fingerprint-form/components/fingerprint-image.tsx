import Image from "next/image";
import { useState, useRef, FC, SetStateAction, Dispatch } from "react";

interface Point {
  x: number;
  y: number;
}

const POINT_SIZE = 50;

interface PropTypes {
  imageToShow: Blob | string;
  viewMode: string;
  corePoint: Point;
  deltaPoint: Point;
  setCorePoint: Dispatch<SetStateAction<Point>>;
  setDeltaPoint: Dispatch<SetStateAction<Point>>;
}

const FingerprintImage: FC<PropTypes> = ({
  imageToShow,
  viewMode,
  corePoint,
  deltaPoint,
  setCorePoint,
  setDeltaPoint,
}) => {
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

    if (x <= 0 || y <= 0) return;

    if (dragging === "pointCore") {
      setCorePoint({ x, y });
    } else if (dragging === "pointDelta") {
      setDeltaPoint({ x, y });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const imageSrc =
    typeof imageToShow === "string"
      ? `data:image/jpeg;base64,${imageToShow}`
      : "";

  const hasCore = corePoint.x > 0 && corePoint.y > 0;
  const hasDelta = deltaPoint.x > 0 && deltaPoint.y > 0;

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
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <h3 className="text-xl font-semibold text-gray-800">ULNA</h3>
        <h3 className="text-xl font-semibold text-gray-800">RÁDIO</h3>
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

      {/* Linha entre core e delta (só se ambos existirem) */}
      {hasCore && hasDelta && (
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
            x1={corePoint.x}
            y1={corePoint.y}
            x2={deltaPoint.x}
            y2={deltaPoint.y}
            stroke="#0f0"
            strokeWidth="2"
          />
        </svg>
      )}

      {/* Point Core (apenas se existir) */}
      {hasCore && (
        <div
          style={{
            position: "absolute",
            left: corePoint.x - POINT_SIZE / 2,
            top: corePoint.y - POINT_SIZE / 2,
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
      )}

      {/* Point Delta (apenas se existir) */}
      {hasDelta && (
        <div
          style={{
            position: "absolute",
            left: deltaPoint.x - POINT_SIZE / 2,
            top: deltaPoint.y - POINT_SIZE / 2,
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
      )}
    </div>
  );
};

export default FingerprintImage;
