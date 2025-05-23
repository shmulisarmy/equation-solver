import { createMutable } from "solid-js/store";
import { Side } from "./types/side";
import { Equation } from "./data/equations";

export const state: {
  currentEquation_id: number;
  currentEquation: Equation | null;
  previousPositions: { lhs: Side; rhs: Side }[];
  atLevelEnd: boolean;
} = createMutable({
  currentEquation_id: 0,
  currentEquation: null,
  previousPositions: [],
  atLevelEnd: false,
});
