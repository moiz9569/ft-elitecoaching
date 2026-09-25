import { Suspense } from "react";
import ResetForm from "./ResetForm";

export const metadata = {
  title: "Set a new password — FT Elite Coaching",
  description: "Choose a new password for your FT Elite account.",
  openGraph: { title: "Reset password — FT Elite Coaching", description: "Choose a new password." },
};

export default function ResetPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}