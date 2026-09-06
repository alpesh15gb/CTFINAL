export const FINISHES = [
  { id: "signal", label: "Signal Red", hex: "#c91f16" },
  { id: "chalk", label: "Chalk", hex: "#e4dfd3" },
  { id: "graphite", label: "Graphite", hex: "#353b42" },
] as const;

export type Finish = (typeof FINISHES)[number];
