import CreateProjectPageClient from "./create-project-page-client";

type CreateProjectPageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function CreateProjectPage({
  searchParams,
}: CreateProjectPageProps) {
  const rawUserId = searchParams?.user_id;
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

  return <CreateProjectPageClient userId={userId} />;
}
