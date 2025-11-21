import CreateProjectPageClient from "./create-project-page-client";

type CreateProjectPageProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: any;
};

export default async function CreateProjectPage({
  searchParams,
}: CreateProjectPageProps) {
  // se for Promise, o await resolve; se já for objeto, o await só retorna o valor
  const params = await searchParams;

  const rawUserId = (params?.user_id ?? undefined) as
    | string
    | string[]
    | undefined;

  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

  return <CreateProjectPageClient userId={userId} />;
}
