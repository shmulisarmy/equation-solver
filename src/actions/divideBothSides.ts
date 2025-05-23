import { Side } from "../types/side";
import { divideEntireSide } from "./divideEntireSide";

export function divideBothSides(currentEquation: { lhs: Side; rhs: Side; }, amount: number) {
  divideEntireSide(currentEquation.lhs, amount);
  divideEntireSide(currentEquation.rhs, amount);
}
