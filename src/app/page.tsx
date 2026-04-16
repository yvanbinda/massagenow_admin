import { redirect } from "next/navigation";

export default function RootPage() {
  // Logic to check session would go here.
  // For now, redirecting to login as the entry point.
  redirect("/login");
}
