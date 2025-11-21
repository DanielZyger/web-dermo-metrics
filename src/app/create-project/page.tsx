// src/app/create-project/page.tsx

import CreateProjectPageClient from "./create-project-page-client"; // confira o nome do arquivo

type CreateProjectPageProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: any;
};

export default function CreateProjectPage({
  searchParams,
}: CreateProjectPageProps) {
  const rawUserId = (searchParams?.user_id ?? undefined) as
    | string
    | string[]
    | undefined;

  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

  return <CreateProjectPageClient userId={userId} />;
}
