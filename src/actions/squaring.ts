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
  } else if (side.variable && side.variable.product) {
    side.squared = objCopy(side);
    side.variable = null;
  }


  if (side.squareRoot == null) {
    //can only be removed once the square root is null because of reactive ui elements
    delete side.squareRoot;
  }
}


function applySquareRoot(side: Side) {
  console.log(`applying square root on the ${side.side}`);
  if (side.squared) {
    side.variable = objCopy(side.squared.variable);
    side.coefficient = objCopy(side.squared.coefficient);
    side.squared = null;
    return
  }
  if (side.coefficient && !side.variable && !side.subExpression && !side.squareRoot) {
    console.log(`on the ${side.side} side there is only a coefficient`, side.coefficient);
    side.coefficient = Math.sqrt(side.coefficient);
    return
  }
  if ((side.variable && side.variable.product) && side.coefficient) {
    console.log(`on the ${side.side} side there is a variable and a coefficient`, side.variable, side.coefficient);
    side.squareRoot = objCopy(side);
    side.variable = null;
    side.coefficient = 0;
    return
  }
  
  if (side.squared) {
    side.variable = objCopy(side.squared);
    side.squared = null;
  }
}


export function squareRootBothSides(currentEquation: { lhs: Side; rhs: Side; }) {
  applySquareRoot(currentEquation.lhs);
  applySquareRoot(currentEquation.rhs);
}