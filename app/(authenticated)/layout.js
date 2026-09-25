import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function AuthenticatedLayout({ children }) {
  const user = await getSessionUser();
  if (!user) redirect("/auth");
  return <>{children}</>;
}