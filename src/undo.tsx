import { state } from "./state";

export function undo() {
  const lastPosition = state.previousPositions.pop();
  state.currentEquation!.lhs = lastPosition!.lhs;
  state.currentEquation!.rhs = lastPosition!.rhs;
}
