import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export const metadata = { title: "Payment successful — FT Elite Coaching", robots: { index: false } };

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessClient />
    </Suspense>
  );
}