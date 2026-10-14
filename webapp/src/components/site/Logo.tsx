import Image from "next/image";
import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/site";

// The real CODE wordmark (transparent PNG). Never redrawn or substituted.
export function Logo({ className = "h-9 w-auto sm:h-10", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label={`${BUSINESS_NAME} — home`}>
      <Image src="/logo.png" alt={BUSINESS_NAME} width={272} height={99} priority={priority} className={className} />
    </Link>
  );
}
