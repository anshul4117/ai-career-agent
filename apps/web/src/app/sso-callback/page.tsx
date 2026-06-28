import { redirect } from "next/navigation";

export default function SSOCallbackPage() {
  redirect("/dashboard");
}
