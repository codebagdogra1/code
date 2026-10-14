import Image from "next/image";
import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/site";

// The real CODE wordmark (transparent PNG). Never redrawn or substituted.
// `sizes` tells the browser the logo is ~110 CSS px wide (h-9/h-10 at the
// wordmark's 2.74:1 ratio), so it picks the 256/384 variant instead of 640.
export function Logo({ className = "h-9 w-auto sm:h-10", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label={`${BUSINESS_NAME} — home`}>
      <Image
        src="/logo.png"
        alt={BUSINESS_NAME}
        width={272}
        height={99}
        sizes="110px"
        priority={priority}
        className={className}
      />
    </Link>
  );
}
