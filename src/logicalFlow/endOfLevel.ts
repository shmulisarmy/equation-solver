import { createEffect } from "solid-js";
import { distanceToAnswer } from "../data/equations";
import { state } from "../state";
import { json } from "@solidjs/router";
import { onLevelComplete } from "@/App";


function areBasicallyTheSame(obj1: {[key: string]: any}, obj2: {[key: string]: any}) {
  console.log("areBasicallyTheSame")
  console.table(obj1)
  console.table(obj2)
  for (const key in obj1) {
    if (!obj1[key]) {
      continue;
    }
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  for (const key in obj2) {
    if (!obj2[key]) {
      continue;
    }
    if (obj2[key] !== obj1[key]) {
      return false;
    }
  }

  return true;
}

createEffect(() => {
  console.log("createEffect ren")
  // const lhs_is_the_same = areBasicallyTheSame(state.currentEquation?.lhs!, state.currentEquation?.simplified_form?.lhs!);
  // const rhs_is_the_same = areBasicallyTheSame(state.currentEquation?.rhs!, state.currentEquation?.simplified_form?.rhs!);
  if (state.currentEquation && distanceToAnswer(state.currentEquation) == 0) {
    onLevelComplete();
  }
})



// createEffect(() => {
//     state.atLevelEnd = false;
// })
