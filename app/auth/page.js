import { Suspense } from "react";
import AuthForm from "./AuthForm";

export const metadata = {
  title: "Sign in — FT Elite Coaching",
  description: "Sign in or create your FT Elite member account.",
  openGraph: { title: "Sign in — FT Elite Coaching", description: "Access your FT Elite member dashboard." },
};

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}