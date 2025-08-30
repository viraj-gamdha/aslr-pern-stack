import { redirect } from "next/navigation";

// defaulr redirect...
export default async function ProjectRoot({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/project/${id}/document`);
}
