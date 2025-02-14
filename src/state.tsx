import { createMutable } from "solid-js/store";
import { Side } from "./types/side";
import { Equation_T } from "./data/equations";

export const state: {
  currentEquation_id: number;
  currentEquation: Equation_T | null;
  previousPositions: { lhs: Side; rhs: Side }[];
} = createMutable({
  currentEquation_id: 0,
  currentEquation: null,
  previousPositions: [],
});
