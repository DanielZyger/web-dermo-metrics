import { Suspense } from "react";
import CreateProjectPageClient from "./create-project-page-client";

export default function CreateProjectPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CreateProjectPageClient />
    </Suspense>
  );
}
