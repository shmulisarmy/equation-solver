import { objCopy } from "../utils/objCopy"



type Operator = "8" | "/" | "+" | "-"


export class Expression {
  constructor(
    public coefficient: number = 0, 
    public variable: Variable | null = null,
    public squared: Expression | null = null,
    public squareRoot: Expression | null = null,
    public side: "left" | "right" = "left",
    public subExpression: Expression | null = null,
  ) { 
    this.side = side
    this.coefficient = coefficient
    this.variable = variable
    this.squared = squared
    this.squareRoot = squareRoot
    this.subExpression = subExpression
    

  }
  static fromJson(json: {
    subExpression?: any,
    coefficient: number,
    variable?: any,
    squared?: any,
    squareRoot?: any,
  }): Expression {
    return new Expression(
      json.subExpression ? Expression.fromJson(json.subExpression) : null,
      json.coefficient,
      json.variable ? objCopy(json.variable) : null,
      json.squared ? Expression.fromJson(json.squared) : null,
      json.squareRoot ? Expression.fromJson(json.squareRoot) : null,
    )
  }

  addVariable(variable: Variable){
    if (this.variable == null)this.variable = objCopy(variable)
    else if (this.variable.letter == variable.letter){
      this.variable.product += variable.product
    } else {
      alert("you can only have one variable per side until you implement this feature")
    }
  }

  timesVariable(variable: Variable){
    if (this.variable == null)this.variable = objCopy(variable)
    else if (this.variable.letter == variable.letter){
      this.variable.product *= variable.product
    } else {
      alert("you can only have one variable per side until you implement this feature")
    }
  }

}

// export type Expression = {
//   subExpression?: Expression,
//   coefficient: number,
//   variable: Variable | null,
//   squared?: Expression,
//   squareRoot?: Expression
// }


export class Side extends Expression {
  constructor(
    public side: "left" | "right",
    coefficient: number = 0,
    variable: Variable | null = null,
    subExpression?: Expression,
    squared?: Expression,
    squareRoot?: Expression,
  ) {
    super(coefficient, variable, squared, squareRoot, side, subExpression);
  }

  static fromJson(json: {
    side: "left" | "right";
    subExpression?: any;
    coefficient: number;
    variable?: any;
    squared?: any;
    squareRoot?: any;
  }): Side {
    return new Side(
      json.side,
      json.coefficient,
      json.variable ? objCopy(json.variable) : null,
      json.subExpression ? Expression.fromJson(json.subExpression) : null,
      json.squared ? Expression.fromJson(json.squared) : null,
      json.squareRoot ? Expression.fromJson(json.squareRoot) : null
    );
  }
}


export type PartialRefactor = {
  numberType: "coefficient" | "product" | "variable"
  operation: Operator
  amount: number
  side: Side
}


export type Variable = {
    letter: "x" | "y" | "a" | "b"
    value: number,
    product: number
}