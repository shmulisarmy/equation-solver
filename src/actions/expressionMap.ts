import { Expression, Variable } from "../types/side";


export function expressionMultiplication(expression1: Expression, expression2: Expression) {
    const newSide = new Expression()
    for (const key1 of Object.keys(expression1)) {
        for (const key2 of Object.keys(expression2)) {
            if (key1 == "coefficient"){

                if ( key2 == "coefficient") {
                    newSide.coefficient += expression1[key1] * expression2[key2]
                }
                else if (key2 == "variable") {
                    newSide.addVariable({
                      ...expression2["variable"] as Variable,
                      product:
                        expression2["variable"]!.product *
                        expression1["coefficient"],
                    });
                }
            } else if (key1 == "variable") {
                if (key2 == "coefficient") {
                    newSide.addVariable({
                      ...expression1["variable"] as Variable,
                      product:
                        expression1["variable"]!.product *
                        expression2["coefficient"],
                    });
                }
                else if (key2 == "variable") {
                    if (expression1["variable"]!.letter != expression2["variable"]!.letter){
                        throw new Error("variables are not the same")
                    }
                    newSide.addVariable({
                        ...expression1["variable"] as Variable,
                        product:
                        expression1["variable"]!.product *
                        expression2['variable']!.product,
                    });
                }
            }
        }
    }

}