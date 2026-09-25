import { redirect } from "next/navigation";

// Preserve old bookmarks without ever displaying a login screen.
export default function AdminLoginPage() {
  redirect("/admin");
}
