// Authored line icons for the Records Office admin world. One consistent stroke
// (1.6, round caps/joins), currentColor — no icon library dependency, no emoji.

type IconName =
  | "dashboard"
  | "registrations"
  | "courses"
  | "new"
  | "check"
  | "alert"
  | "arrow-right"
  | "arrow-left"
  | "search"
  | "trash"
  | "logout"
  | "user"
  | "stamp"
  | "x";

const PATHS: Record<IconName, React.ReactNode> = {
  // a stack of files / drawer
  dashboard: (
    <>
      <rect x="3.5" y="4.5" width="17" height="6" rx="1" />
      <rect x="3.5" y="13.5" width="17" height="6" rx="1" />
      <path d="M8 7.5h4M8 16.5h4" />
    </>
  ),
  // ruled register sheet
  registrations: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="1" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  // open book / course
  courses: (
    <>
      <path d="M12 6.2C10.5 5 8.5 4.6 6 4.8c-.8 0-1.5.6-1.5 1.4v10.2c0 .8.7 1.4 1.5 1.4 2.5-.2 4.5.2 6 1.4 1.5-1.2 3.5-1.6 6-1.4.8 0 1.5-.6 1.5-1.4V6.2c0-.8-.7-1.4-1.5-1.4-2.5-.2-4.5.2-6 1.4Z" />
      <path d="M12 6.2v11.6" />
    </>
  ),
  new: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  alert: (
    <>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10v4.2" />
      <path d="M12 17.2h.01" />
    </>
  ),
  "arrow-right": <path d="M5 12h13M13 6l6 6-6 6" />,
  "arrow-left": <path d="M19 12H6M11 18l-6-6 6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.2" />
      <path d="M20 20l-3.6-3.6" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.5h15M9 6.5V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5" />
      <path d="M6.5 6.5 7.4 19a1 1 0 0 0 1 1h7.2a1 1 0 0 0 1-1l.9-12.5" />
      <path d="M10 10v6M14 10v6" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4.5H6.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1H14" />
      <path d="M11 12h9M16.5 8l4 4-4 4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5.5 19.5c.7-3.3 3.3-5 6.5-5s5.8 1.7 6.5 5" />
    </>
  ),
  stamp: (
    <>
      <path d="M9 4.5h6a1 1 0 0 1 1 1.2l-1 4.3a1 1 0 0 0 1 1.2h1a2 2 0 0 1 2 2v.8H4v-.8a2 2 0 0 1 2-2h1a1 1 0 0 0 1-1.2l-1-4.3a1 1 0 0 1 1-1.2Z" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
};

export function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
