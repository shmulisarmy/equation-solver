import { Side } from "../types/side";

export function divideEntireSide(side: Side, divideBy: number) {
  if (side.variable) {
    side.variable.product /= divideBy;
  }
  if (side.coefficient) {
    side.coefficient /= divideBy;
  }
  if (side.subExpression) {
    side.subExpression.product /= divideBy;
  }
}
