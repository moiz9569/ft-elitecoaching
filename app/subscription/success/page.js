import { Suspense } from "react";
import SubscriptionSuccessClient from "./SubscriptionSuccessClient";

export const metadata = {
  title: "Subscription active — FT Elite Coaching",
  robots: { index: false },
};

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionSuccessClient />
    </Suspense>
  );
}