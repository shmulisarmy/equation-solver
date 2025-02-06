import { createEffect, createSignal, Show } from "solid-js"
import { createMutable, StoreNode } from "solid-js/store"
import styles from "./App.module.css"
import { equations } from "./data/equations"
import { PartialRefactor, Side, Variable } from "./types/side"
import { FocusSpan } from "./components/FocusSpan"
import { objCopy } from "./utils/objCopy"
import { UndoArrow } from "./components"



const state: {currentEquation_id: number, currentEquation: {rhs: Side, lhs: Side}|null, previousPositions: {lhs: Side, rhs: Side}[]} = createMutable({currentEquation_id: 0, currentEquation: null, previousPositions: []})


createEffect(() => {state.currentEquation = createMutable(objCopy(equations[state.currentEquation_id]))})


function Equation_Side_C(props: {side: Side}){
  return(<Expression isFullSide={true} side={() => props.side}/>)
}


function shouldDisplayInReverse(num: number): boolean{
  return (0 < num && num < 1) || (-1 < num && num < 0)
}

function undo(){
  const lastPosition = state.previousPositions.pop()
  state.currentEquation!.lhs = lastPosition!.lhs
  state.currentEquation!.rhs = lastPosition!.rhs
}


function saveCurrentEquationPosition(){
  state.previousPositions.push((objCopy({lhs: state.currentEquation!.lhs, rhs: state.currentEquation!.rhs})))
}



function Expression({side, isFullSide}: {isFullSide: boolean, side: () => Side}){

  function Variable_C(){
    return(
      <>
      <Show when={side().variable! && side().variable!.product!=0}>
        
        <FocusSpan>
        <Show when={!shouldDisplayInReverse(side().variable?.product!)} 
        fallback={<span>{side().variable?.letter+"/"+1/side().variable?.product!}</span>}>
          {side().variable!.product != 1 && side().variable!.product}
          {side().variable!.letter}
        </Show>
          <Show when={isFullSide}>

          <Show when={canReduceVaribleProduct(side(), side().variable!)}          >
              <button 
              onclick={
                function(){
                  saveCurrentEquationPosition()
                  otherSide(side()).variable!.product-=side().variable!.product
                  side().variable!.product=0
                }
              }
              >
                apply -{side().variable!.product}{side().variable?.letter} to {" "} 
            <abbr title={`to this side to isolate ${side().variable?.letter} and the other side to keep the statement true`}>

            both sides
            </abbr>
              </button>
          </Show>
          <Show when={!canReduceVaribleProduct(side(), side().variable!)}          >
              <button 
              onclick={
                function(){
                  saveCurrentEquationPosition()
                  side().variable!.product=0-side().variable!.product
                  otherSide(side()).variable=side().variable!
                  side().variable=null
                }
              }
              >slide variable to other side</button>
          </Show>
              </Show>
              </FocusSpan>
      </Show>
      </>

    )
  }




  function Coefficient_C(){
    return(
      <>
      <Show when={side().coefficient}>
      <FocusSpan>
          {side().coefficient > 0 && side().variable && side().variable!.product? "+ " : ""}
          {side().coefficient}
          <Show when={isFullSide}>

          <button
            onclick={function () {
              saveCurrentEquationPosition()
              reconsileRefactor({
                numberType: "coefficient",
                operation: "-",
                amount: side().coefficient,
                side: side(),
              });
              side().coefficient = 0;
            }}
            >
           apply -{side().coefficient} to {" "} 
            <abbr title={`to this side to isolate ${side().variable?.letter} and the other side to keep the statement true`}>

            both sides
            </abbr>
          </button>
              </Show>
              </FocusSpan>
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
      <Show when={side().subExpression}>
      <FocusSpan>
      + {side().subExpression.product}(<Expression side={() => side().subExpression}/>)
      {/* <span style={{background: "pink"}}>

{JSON.stringify(side())}
</span> */}
      <button onclick={() => {saveCurrentEquationPosition(); breakSubExpressionByMapping(side());}}>
      breakSubExpressionByMapping
      </button>
</FocusSpan>
      </Show>
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
  if (side.subExpression){
    side.subExpression.product/=divideBy
  }

}


function timesEntireSide(side: Side, timesBy: number){
  if (side.variable){
    side.variable.product*=timesBy
  }
  if (side.coefficient){
    side.coefficient*=timesBy
  }
  if (side.subExpression){
    side.subExpression.product*=timesBy
  }

}


function canReduceVaribleProduct(side: Side, variable: Variable): boolean|null{
  return otherSide(side).variable && otherSide(side).variable!.letter == variable.letter    
}



function breakSubExpression(side: Side){
  console.log(side)
  if (!side.subExpression)return
  if (!(side.subExpression.product == 1)){
    console.error("you cant break a subExpression unless its product is 1");
  }
  side.variable = JSON.parse(JSON.stringify(side.subExpression.variable))
  side.subExpression.variable = null
  side.coefficient += side.subExpression.coefficient
  side.subExpression.coefficient = 0

  delete side.subExpression 
}

function breakSubExpressionByMapping(side: Side){
  console.log(side)
  if (!side.subExpression)return
  if (!side.variable){
    side.variable = {letter: side.subExpression.variable!.letter, product: 0}
  }
  side.variable!.product+=side.subExpression.variable!.product*=side.subExpression.product
  side.coefficient += side.subExpression.coefficient*side.subExpression.product

  delete side.subExpression 
}


function copyObject(obj: any){return JSON.parse(JSON.stringify(obj))}


function DiologDisplay(props: {diolog: string[]}){
  const [diologIndex, setDiologIndex] = createSignal(0)
  return(
    <div class={styles.diolog}>
      <p>{(diologIndex()%props.diolog.length)+1}/{props.diolog.length}</p>
    <p >{props.diolog[diologIndex()%props.diolog.length]}</p>
    <button onclick={() => setDiologIndex(prev => (prev - 1)%props.diolog.length)}>prev</button>
    <button onclick={() => setDiologIndex(prev => (prev + 1)%props.diolog.length)}>next</button>
    </div>
  )
}





export default function App(){
  let divideInputRef: undefined|HTMLInputElement = undefined
  let timesInputRef: undefined|HTMLInputElement = undefined
  return(
    <>
  {/* <Debug/> */}
  {state.currentEquation.diolog && <DiologDisplay diolog={state.currentEquation!.diolog}/>
  }
    <h1>Equation Solver</h1>

  <div id={styles.root}>
    <Equation_Side_C side={state.currentEquation!.lhs}/>
    <span>=</span>
    <Equation_Side_C side={state.currentEquation!.rhs}/>
   
  </div>    


  <div id={styles.forms}>

  <form onsubmit={e => e.preventDefault()}>
    divide both sides by <input ref={divideInputRef} type="number" />
    <button onclick={() => {saveCurrentEquationPosition(); divideEntireSide(state.currentEquation!.lhs, parseInt(divideInputRef!.value)); divideEntireSide(state.currentEquation!.rhs, parseInt(divideInputRef!.value))}}>submit</button>
    </form>
    <form onsubmit={e => e.preventDefault()}>
    times both sides by <input ref={timesInputRef} type="number" />
    <button onclick={() => {saveCurrentEquationPosition(); timesEntireSide(state.currentEquation!.lhs, parseInt(timesInputRef!.value)); timesEntireSide(state.currentEquation!.rhs, parseInt(timesInputRef!.value))}}>submit</button>
    </form>
  </div>
    <InfoDisplay/>
    <div class={styles.controls}>
      <button plain-action="ArrowLeft" disabled={state.currentEquation_id < 1} class={styles.control} onclick={() => state.currentEquation_id--}>previous question (press ←)</button>
      {/* <button class={styles.control} onclick={() => {state.currentEquation_id++; state.currentEquation_id--}}>
      <ReStartIcon/>
      </button> */}
      <button plain-action="ArrowRight" disabled={state.currentEquation_id > equations.length-2} class={styles.control} onclick={() => state.currentEquation_id++}>next question (press →)</button>
    </div>
    </>
  )
}



window.addEventListener("keydown", (e) => {
  console.log(e.key)
  let button_to_press
  if (e.ctrlKey) {
    button_to_press = document.querySelector(`[control-action="${e.key}"]`)
  } else {
   button_to_press = document.querySelector(`[plain-action="${e.key}"]`)
  }
  if(button_to_press){
    button_to_press.classList.add(styles["animate-press"])
    button_to_press.click()
    setTimeout(() => {
      button_to_press.classList.remove(styles["animate-press"])
    }, 1000)
  }

})



function InfoDisplay(){
  return (
    <>
     <div id={styles.info}>
      moves: {JSON.stringify(state.previousPositions.length)}{" "}
      <button control-action="u" style={{display: "inline-flex", "align-items": "center", gap: "4px"}} onclick={() => undo()}><UndoArrow/>
      (ctrl + u)
      </button>
      </div>
    <div id={styles.info}>
      <span style={{ padding: "10px" }}>
        Question: {state.currentEquation_id + 1}/{equations.length}
      </span>
      <span style={{ padding: "10px" }}>
        Difficulty: {state.currentEquation!.difficulty}
      </span>
    </div>
   
    </>
  );
}