import { Side } from "../types/side";

export function timesEntireSide(side: Side, timesBy: number) {
  if (side.variable) {
    side.variable.product *= timesBy;
  }
  if (side.coefficient) {
    side.coefficient *= timesBy;
  }
  if (side.subExpression) {
    side.subExpression.product *= timesBy;
  }
}
