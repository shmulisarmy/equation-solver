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
  side.variable=copyObject(side.subExpression!.variable)
  side.variable!.product*=side.subExpression.product
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

function ReStartIcon(){
  return(
    <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.7275 6C16.7275 5.58579 16.3917 5.25 15.9775 5.25C15.5633 5.25 15.2275 5.58579 15.2275 6V7.0232C12.9877 5.46956 9.91113 5.70783 7.92796 7.73802C5.69068 10.0283 5.69068 13.7346 7.92796 16.0249C10.1748 18.325 13.8252 18.325 16.072 16.0249C17.3754 14.6907 17.9168 12.8781 17.7055 11.1509C17.6552 10.7398 17.2812 10.4472 16.87 10.4975C16.4589 10.5478 16.1663 10.9219 16.2166 11.333C16.3757 12.6337 15.9667 13.9861 14.999 14.9767C13.3407 16.6744 10.6593 16.6744 9.00097 14.9767C7.33301 13.2692 7.33301 10.4937 9.00097 8.78618C10.324 7.4318 12.298 7.15792 13.8844 7.96452H13.3258C12.9116 7.96452 12.5758 8.3003 12.5758 8.71452C12.5758 9.12873 12.9116 9.46452 13.3258 9.46452H15.9775C16.3917 9.46452 16.7275 9.12873 16.7275 8.71452V6Z" fill="#1C274C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.4137 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.4137 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25H11.9426ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62177 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62178 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62177 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62178 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z" fill="#1C274C"/>
</svg>
  )
}

function Debug(){
  return(
    <div>{JSON.stringify(state)}</div>
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