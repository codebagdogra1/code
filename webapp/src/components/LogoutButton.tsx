"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ro/Icon";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button onClick={logout} disabled={loading} className="ro-btn ro-btn--ghost w-full">
      <Icon name="logout" size={15} />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
