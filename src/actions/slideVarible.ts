import { otherSide } from "../App";
import { Side } from "../types/side";
import { saveCurrentEquationPosition } from "./undo";


export function slideVariableToOtherSide(side_of_variable: Side) {
    saveCurrentEquationPosition();
    if (!otherSide(side_of_variable).variable) {
      otherSide(side_of_variable).variable = {
        product: 0,
        letter: side_of_variable.variable!.letter,
        value: side_of_variable.variable!.value,
      };
    }
    otherSide(side_of_variable).variable!.product -=
      side_of_variable.variable!.product;
    side_of_variable.variable!.product = 0;
  }
  