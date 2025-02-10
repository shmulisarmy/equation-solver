
import { state } from "../state";
import { objCopy } from "../utils/objCopy";

export function saveCurrentEquationPosition(){
    state.previousPositions.push((objCopy({lhs: state.currentEquation!.lhs, rhs: state.currentEquation!.rhs})))
  }
