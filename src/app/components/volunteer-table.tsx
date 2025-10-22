"use client";

import Link from "next/link";
import { User } from "../utils/types/user";
import { Volunteer } from "../utils/types/volunteer";
import { Button } from "primereact/button";
import { genderParse, statusParse } from "../utils/constants";
import { useDelete } from "../hooks/use-delete";
import { useRouter } from "next/navigation";
import { Project } from "../utils/types/project";

const statusStyles: Record<string, { backgroundColor: string; color: string }> =
  {
    completed: { backgroundColor: "#d1fae5", color: "#065f46" },
    incompleted: { backgroundColor: "#fee2e2", color: "#991b1b" },
    pending: { backgroundColor: "#fef3c7", color: "#92400e" },
  };

const VolunteerTable = ({
  user,
  volunteer,
  project,
}: {
  user: User;
  volunteer: Volunteer;
  project: Project | undefined;
}) => {
  const router = useRouter();
  const { deleteItem, loading } = useDelete("/volunteers");

  const handleDelete = async (id: number) => {
    const sucesso = await deleteItem(id);

    if (sucesso) {
      console.log("Item deletado com sucesso!");
    }
  };

  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        padding: "12px 16px",
        alignItems: "center",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "15px",
      }}
    >
      <Link
        key={volunteer.id}
        style={{ width: "90%" }}
        href={`/fingerprint-form?volunteer_id=${volunteer.id}&user_id=${user?.id}`}
      >
        <div key={volunteer.id} className="table-row">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "500", color: "#111827" }}>
              {volunteer.name}
            </span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              ID: {volunteer.id}
            </span>
          </div>

          <div>
            <span style={{ fontWeight: "500", color: "#111827" }}>
              {volunteer.age} anos
            </span>
          </div>
          <div>
            <span style={{ fontWeight: "500", color: "#111827" }}>
              {volunteer.height} cm
            </span>
          </div>
          <div>
            <span style={{ fontWeight: "500", color: "#111827" }}>
              {volunteer.weight} kg
            </span>
          </div>

          <div>
            <span style={{ fontWeight: "500", color: "#111827" }}>
              {genderParse[volunteer.gender]}
            </span>
          </div>

          <div>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 500,
                ...statusStyles[volunteer.status],
              }}
            >
              {statusParse[volunteer.status]}
            </span>
          </div>
        </div>
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <Button
          aria-label="Editar"
          icon="pi pi-pencil"
          size="small"
          severity="secondary"
          rounded
          outlined
          onClick={() =>
            router.push(
              `/create-volunteers?user_id=${user.id}&project_id=${project?.id}&volunteer_id=${volunteer.id}`,
            )
          }
        ></Button>
        <Button
          icon="pi pi-trash"
          size="small"
          severity="danger"
          rounded
          outlined
          aria-label="Remover"
          disabled={loading}
          onClick={() => handleDelete(volunteer.id)}
        ></Button>
      </div>
    </div>
  );
};

export default VolunteerTable;
