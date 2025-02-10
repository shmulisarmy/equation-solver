import { Side } from "../types/side";
import { objCopy } from "../utils/objCopy";

export function squareBothSides(currentEquation: { lhs: Side; rhs: Side; }) {
  squareSide(currentEquation.lhs);
  squareSide(currentEquation.rhs);
}
function squareSide(side: Side) {
  console.log("squaring side", side);
  if (side.coefficient) {
    side.coefficient *= side.coefficient;
  }
  else if (side.squareRoot) {
    console.log("squaring squareRoot");
    side.coefficient = objCopy(side.squareRoot.coefficient);
    side.variable = objCopy(side.squareRoot.variable);
    side.squareRoot = null;
  }

  if (side.variable && side.variable.product) {
    side.squared = objCopy(side);
    side.variable = null;
  }
}


function applySquareRoot(side: Side) {
  if (side.variable && side.variable.product) {
    side.squareRoot = objCopy(side.variable);
    delete side.variable;
  }
  if (side.coefficient) {
    side.coefficient = Math.sqrt(side.coefficient);
  }
  if (side.squared) {
    side.variable = objCopy(side.squared);
    delete side.squared;
  }
}


export function squareRootBothSides(currentEquation: { lhs: Side; rhs: Side; }) {
  applySquareRoot(currentEquation.lhs);
  applySquareRoot(currentEquation.rhs);
}