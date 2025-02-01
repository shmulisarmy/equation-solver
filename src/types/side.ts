


type Operator = "8" | "/" | "+" | "-"


export type Side = {
//   varible_value: null|number,
//   variable_letter: string|null,
//   product: null|number,
  coefficient: number,
  side: "right" | "left",
  variable: Variable | null
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