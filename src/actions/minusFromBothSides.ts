import { Side } from "../types/side";

export function minusFromBothSides(
  currentEquation: { lhs: Side; rhs: Side },
  amount: number) {
    console.log("minusFromBothSides", JSON.stringify(currentEquation, undefined, 2), amount);

  currentEquation.lhs.coefficient -= amount;
  currentEquation.rhs.coefficient -= amount;
}
