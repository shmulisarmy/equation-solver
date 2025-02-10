import { Side } from "../types/side";

// function breakSubExpression(side: Side){
//   console.log(side)
//   if (!side.subExpression)return
//   if (!(side.subExpression.product == 1)){
//     console.error("you cant break a subExpression unless its product is 1");
//   }
//   side.variable = JSON.parse(JSON.stringify(side.subExpression.variable))
//   side.subExpression.variable = null
//   side.coefficient += side.subExpression.coefficient
//   side.subExpression.coefficient = 0
//   delete side.subExpression
// }
export function breakSubExpressionByMapping(side: Side) {
  console.log(side);
  if (!side.subExpression) return;
  if (!side.variable) {
    side.variable = { letter: side.subExpression.variable!.letter, product: 0 };
  }
  side.variable!.product += side.subExpression.variable!.product *=
    side.subExpression.product;
  side.coefficient +=
    side.subExpression.coefficient * side.subExpression.product;

  delete side.subExpression;
}
