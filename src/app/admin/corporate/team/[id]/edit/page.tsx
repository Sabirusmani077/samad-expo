import TeamForm from "../../_TeamForm";

export const metadata = { title: "Edit Team Member — Samad Expo Admin" };

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TeamForm id={id} />;
}
