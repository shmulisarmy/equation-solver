import { createMutable } from "solid-js/store";
import { Side } from "./types/side";

export const state: { currentEquation_id: number; currentEquation: { rhs: Side; lhs: Side; } | null; previousPositions: { lhs: Side; rhs: Side; }[]; } = createMutable({ currentEquation_id: 0, currentEquation: null, previousPositions: [] });
