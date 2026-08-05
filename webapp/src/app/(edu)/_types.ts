// Shape of the snippet manifests emitted by scripts/split-home.py.

export type HeadResource =
  | { t: "css"; href: string; media: string }
  | { t: "style"; css: string }
  | { t: "icon"; rel: string; href: string; sizes: string | null };

export type ScriptDesc =
  | { type: "src"; src: string; async: boolean; defer: boolean }
  | { type: "inline"; id: string; code: string };
