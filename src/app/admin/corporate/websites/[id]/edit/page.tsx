import WebsiteForm from "../../_WebsiteForm";

export const metadata = { title: "Edit Website Listing — Samad Expo Admin" };

export default async function EditWebsitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WebsiteForm id={id} />;
}
