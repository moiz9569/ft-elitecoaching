// app/booking/success/page.js
import { Suspense } from "react";
import BookingSuccessClient from "./BookingSuccessClient";

export const metadata = {
  title: "Booking confirmed — FT Elite Coaching",
  robots: { index: false },
};

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BookingSuccessClient />
    </Suspense>
  );
}
