import { Suspense } from "react";
import HomePageClient from "./home-page";

export default function CreateProjectPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <HomePageClient />
    </Suspense>
  );
}
