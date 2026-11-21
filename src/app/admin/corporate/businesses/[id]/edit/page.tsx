import BusinessDivisionForm from "../../_BusinessForm";

export const metadata = { title: "Edit Business Division — Samad Expo Admin" };

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BusinessDivisionForm id={id} />;
}
