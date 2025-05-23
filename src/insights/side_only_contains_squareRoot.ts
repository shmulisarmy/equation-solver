import { Side } from "../types/side";

export function side_only_contains_squareRoot(side: Side) {
    return side.coefficient == 0 && side.variable == null && side.subExpression == null;
  }