import { redirect } from "next/navigation";

// default redirect...
export default async function ProjectRoot({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/project/${projectId}/document`);
}
