import { Side } from "../types/side";
import { timesEntireSide } from "./timesEntireSide";

export function timesBothSides(currentEquation: { lhs: Side; rhs: Side; }, amount: number) {
  timesEntireSide(currentEquation.lhs, amount);
  timesEntireSide(currentEquation.rhs, amount);
}
