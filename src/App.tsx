import { createEffect, createSignal, Show } from "solid-js"
import { createMutable, StoreNode } from "solid-js/store"
import styles from "./App.module.css"
import { equations } from "./data/equations"
import { PartialRefactor, Side, Variable } from "./types/side"



const state: {currentEquation_id: number, currentEquation: {rhs: Side, lhs: Side}|null} = createMutable({currentEquation_id: 0, currentEquation: null})


// function deepCopyObject(obj: {}){
//   const new_object = {}
//   for (const ([key, value]) of obj){
//     if (typeof value == "object"){
//       new_object[key] = deepCopyObject(value)

//     } else {

//       new_object[key] = value
//     }
//   }
// }

createEffect(() => {state.currentEquation = createMutable(equations[state.currentEquation_id])})





function Equation_Side_C(props: {side: Side}){
  console.count("Equation_Side_C")
  const side = () => props.side;

  function Variable_C(){
    return(
      <>
      <Show when={side().variable! && side().variable!.product!=0}>
        <span>
          {side().variable!.product != 1 && side().variable!.product}
          {side().variable!.letter}
          <Show when={canReduceVaribleProduct(side(), side().variable!)}          >
              <button 
              onclick={
                function(){
                  otherSide(side()).variable!.product-=side().variable!.product
                  side().variable!.product=0
                }
              }
              >reduce product to 0</button>
          </Show>
          <Show when={!canReduceVaribleProduct(side(), side().variable!)}          >
              <button 
              onclick={
                function(){
                  side().variable!.product=0-side().variable!.product
                  otherSide(side()).variable=side().variable!
                  side().variable=null
                }
              }
              >slide variable to other side</button>
          </Show>
        </span>
      </Show>
      </>

    )
  }


  function Coefficient_C(){
    return(
      <>
      <Show when={side().coefficient}>
        <span>
          {side().coefficient > 0 && side().variable && side().variable!.product? "+ " : ""}
          {side().coefficient}
          <button
            onclick={function () {
              reconsileRefactor({
                numberType: "coefficient",
                operation: "-",
                amount: side().coefficient,
                side: side(),
              });
              side().coefficient = 0;
            }}
            >
            refactor away
          </button>
        </span>
      </Show>
      <Show when={side().coefficient == 0 && !(side().variable && side().variable!.product)}>
        0
      </Show>
      </>
    )
  }

  return (
    <>
      <Variable_C/>
      <Coefficient_C/>
    </>
  );
}



function otherSide(side: Side): Side{
  return side.side == "left"? state.currentEquation!.rhs: state.currentEquation!.lhs
}


function minusFromSide(side: Side, amount: number){
  // if (side.coefficient){
  side.coefficient-=amount;
  // }
}


function reconsileRefactor(partialRefactor: PartialRefactor){
  console.log(partialRefactor.side)
  const reconsileSide = otherSide(partialRefactor.side)
  if (partialRefactor.numberType == "coefficient"){
    minusFromSide(reconsileSide!, partialRefactor.amount);
  } else if (partialRefactor.numberType == "product"){
    alert("partialRefactor.numberType == product shouldnt be able to happen yet");
    
  }
}


function divideEntireSide(side: Side, divideBy: number){
  if (side.variable){
    side.variable.product/=divideBy
  }
  if (side.coefficient){
    side.coefficient/=divideBy
  }
}


function canReduceVaribleProduct(side: Side, variable: Variable): boolean|null{
  return otherSide(side).variable && otherSide(side).variable!.letter == variable.letter    
}





export default function App(){
  let inputRef: undefined|HTMLInputElement = undefined
  return(
    <>
  {/* <Debug/> */}
  <div id={styles.root}>
    <Equation_Side_C side={state.currentEquation!.lhs}/>
    <span>=</span>
    <Equation_Side_C side={state.currentEquation!.rhs}/>
   
  </div>    

  <form onsubmit={e => e.preventDefault()}>
    divide both sides by <input ref={inputRef} type="number" />
    <button onclick={() => {divideEntireSide(state.currentEquation!.lhs, parseInt(inputRef!.value)); divideEntireSide(state.currentEquation!.rhs, parseInt(inputRef!.value))}}>submit</button>
    </form>
    <InfoDisplay/>
    <div class={styles.controls}>
      <button disabled={state.currentEquation_id < 1} class={styles.control} onclick={() => state.currentEquation_id--}>previous question</button>
      <button disabled={state.currentEquation_id > equations.length-2} class={styles.control} onclick={() => state.currentEquation_id++}>next question</button>
    </div>
    </>
  )
}

function Debug(){
  return(
    <div>{JSON.stringify(state)}</div>
  )
}


function InfoDisplay(){
  return(
    <div>Question: {state.currentEquation_id+1}/{equations.length}</div>
  )
}