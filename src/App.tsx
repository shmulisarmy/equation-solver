import { createEffect, createReaction, createSignal, For, JSX, onCleanup, onMount, Show } from "solid-js";
import { createMutable, createStore } from "solid-js/store";
import styles from "./App.module.css";
import { distanceToAnswer, equations, needsDivision } from "./data/equations";
import { PartialRefactor, Side, Variable } from "./types/side";
import { FocusSpan } from "./components/FocusSpan";
import { objCopy } from "./utils/objCopy";
import { ArrowBoxSVG, UndoArrow } from "./components";
import { withPlusSignIfPositive } from "./utils/math";
import { state } from "./state";
import { undo } from "./undo";
import { saveCurrentEquationPosition } from "./actions/undo";
import "./accessability/keydown";
import { slideVariableToOtherSide } from "./actions/slideVarible";
import { breakSubExpressionByMapping } from "./actions/breakSubExpression";
import { divideEntireSide } from "./actions/divideEntireSide";
import { timesEntireSide } from "./actions/timesEntireSide";
import { divideBothSides } from "./actions/divideBothSides";
import { timesBothSides } from "./actions/timesBothSides";
import Slider from "./components/Slider";
import { squareBothSides, squareRootBothSides } from "./actions/squaring";
import { levelInfo, userState } from "./userState";
import { side_only_contains_squareRoot } from "./insights/side_only_contains_squareRoot";
import { getDeviceType } from "./utils/Device";
import { minusFromBothSides } from "./actions/minusFromBothSides";
import { Portal } from "solid-js/web";
import SquaredDisplay from "./components/MathExpression";
import SquareRootDisplay from "./components/SquareRootDisplay";
import ConfettiCelebration from "./components/celebration";
import profile_image from "./assets/profile.jpg";
import { ProfileCard } from "./components/ProfileCard";
import { InfoCard } from "./InfoCard";
import { difficulty_tag_colors } from "./routes/levels";
import Levels_page from "./routes/levels";
import { Router, Route, Routes, Navigate, A, useParams, createAsyncStore } from "@solidjs/router";
import Marquee from "./components/Marquee";
import { Variable_C } from "./routes/question/components/Variable";
import controls_styles from "./shared_styles/controls.module.css";
import Coefficient_C from "./routes/question/components/coefficient";
import SquareRootSection from "./routes/question/components/squareRootSection";
import Question_page from "./routes/question";
import "@/logicalFlow/endOfLevel"


export function UserMessage(props: { message: string, when?: boolean }) {
  return (
    <Show when={props.when}>
    <Portal mount={document.querySelector("#messages")!}>

      <p >{props.message}</p>
    </Portal>
    </Show>
  );
}

function Equation_Side_C(props: { side: Side }) {
  return <Expression_C isFullSide={true} side={() => props.side} />;
}

export function shouldDisplayInReverse(num: number): boolean {
  return (0 < num && num < 1) || (-1 < num && num < 0);
}

function PastExpressionSideDisplay(props: {
  equation: {
    lhs: Side;
    rhs: Side;
  };
}) {
  return (
      <div class={`flex ${styles.question}}`}>
        <Expression_C isFullSide={false} side={() => props.equation.lhs} />
        =
        <Expression_C isFullSide={false} side={() => props.equation.rhs} />
      </div>
  );
}

export function Expression_C({
  side,
  isFullSide,
}: {
  isFullSide: boolean;
  side: () => Side;
}) {
  









  function side_only_contains_squared(side: Side){
    return Object.keys(side).every((key) => !(!(["squared", "side"].includes(key)) && side[key])) 
  }


  function SquaredSection(){
    return(
      <FocusSpan>
        <SquaredDisplay>
            <Expression_C side={() => side().squared!} isFullSide={false} />
            </SquaredDisplay>
             
            <div class={controls_styles.controls}>
              <Show when={side_only_contains_squared(side())}>

              <button
                onclick={() => {
                  saveCurrentEquationPosition();
                  squareRootBothSides(state.currentEquation!)}
                }
                >
                square root both sides
              </button>
                </Show>
            </div>
          </FocusSpan>
    )
  }

  return (
    <Show when={side()}>
        <Show when={side().variable! && side().variable!.product != 0}>

      <Variable_C side={() => side()} isFullSide={isFullSide} />
      </Show>
      <Show when={side().squareRoot}>
        <SquareRootSection side={() => side()} isFullSide={isFullSide} />
      </Show>
      <Show when={side().squareRoot && side().coefficient}>+</Show>
      <Show when={side().coefficient}>
        <Coefficient_C side={() => side()} isFullSide={isFullSide} />
      </Show>
      <Show when={side().squared}>
      <SquaredSection />
        </Show>
      <Show
        when={
          side().coefficient == 0 &&
          !(side().variable && side().variable!.product) &&
          !side().squareRoot &&
          !side().squared
        }
      >
        0
      </Show>
      
      <Show when={side().subExpression}>
        <FocusSpan>
          + {side().subExpression.product}(
          <Expression_C side={() => side().subExpression} />)
          {/* <span style={{background: "pink"}}>

{JSON.stringify(side())}
</span> */}
          <div class={controls_styles.controls}>
            <button
              onclick={() => {
                saveCurrentEquationPosition();
                breakSubExpressionByMapping(side());
              }}
            >
              breakSubExpressionByMapping
            </button>
          </div>
        </FocusSpan>
      </Show>
    </Show>
  );
}

export function otherSide(side: Side): Side {
  return side.side == "left"
    ? state.currentEquation!.rhs
    : state.currentEquation!.lhs;
}

function minusFromSide(side: Side, amount: number) {
  // if (side.coefficient){
  side.coefficient -= amount;
  // }
}

function reconsileRefactor(partialRefactor: PartialRefactor) {
  console.log(partialRefactor.side);
  const reconsileSide = otherSide(partialRefactor.side);
  if (partialRefactor.numberType == "coefficient") {
    minusFromSide(reconsileSide!, partialRefactor.amount);
  } else if (partialRefactor.numberType == "product") {
    alert(
      "partialRefactor.numberType == product shouldnt be able to happen yet"
    );
  }
}

function DialogDisplay(props: { diolog: string[] }) {
  const [dialogIndex, setDialogIndex] = createSignal(0);
  return (
    <div class={styles.diolog}>
      <p>
        {(dialogIndex() % props.diolog.length) + 1}/{props.diolog.length}
      </p>
      <p>{props.diolog[dialogIndex() % props.diolog.length]}</p>
      <button
        onclick={() =>
          setDialogIndex((prev) => (prev - 1) % props.diolog.length)
        }
      >
        prev
      </button>
      <button
        onclick={() =>
          setDialogIndex((prev) => (prev + 1) % props.diolog.length)
        }
      >
        next
      </button>
    </div>
  );
}

export function QuestionDisplay() {
  return (
    <>

      <div id={styles.main_question} class={`${styles.question} ${styles['past-expression']}`}
        style={{
          background: "white",
          color: "black",
          border: "1px solid black",
          "margin-top": "10px",
        }}
      >
        <For each={state.previousPositions}>
          {(position: { lhs: Side; rhs: Side }) => (
            
              <PastExpressionSideDisplay
                equation={position!}
              />
            
          )}
        </For>
        <div class="flex">
          <Equation_Side_C side={state.currentEquation!.lhs} />
          <span>=</span>
          <Equation_Side_C side={state.currentEquation!.rhs} />
        </div>
        </div>
        <Show when={state.currentEquation!.simplified_form}>
        <div 
          style={{
            border: "1px solid black",
            "margin-top": "10px",
            padding: "20px",
            background: "white",
          }}
        >

        <p style={{ "text-align": "center" }}>Simplify the above expression until it looks like this one</p>
        <div class={styles['simplified-form']} style={{
          display: "flex",
          "justify-content": "center",
        }}>

        <PastExpressionSideDisplay equation={state.currentEquation!.simplified_form!} />
          </div>
        </div>
          </Show>
      <InfoDisplay />
    </>
  );
}


export function Moves(){
  return(
    <div id={styles.info}>
        moves: {JSON.stringify(state.previousPositions.length)}{" "}
        <button
          control-action="u"
          style={{
            display: "inline-flex",
            "align-items": "center",
            gap: "4px",
          }}
          onclick={() => undo()}
        >
          <UndoArrow />
          (ctrl + u)
        </button>
      </div>
  )
}



export const [ph, setPh] = createSignal(true);

createEffect(() => {
  state.currentEquation = createMutable(
    objCopy(equations[state.currentEquation_id])
  );
  setPh((prev) => !prev);
  setPh((prev) => !prev);
  state.previousPositions = [];
});




export function onLevelComplete(){
  levelInfo[state.currentEquation_id].completed_in = state.previousPositions.length;
  if (state.currentEquation_id < levelInfo.length-1){
    levelInfo[state.currentEquation_id+1].locked = false;
  };
  state.atLevelEnd = true;
}





function InfoDisplay() {
  return (
    <>
      
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









export default function App() {
  return (
    <>
    <Router>
        <Route path="/levels" component={Levels_page} />
        <Route path="/question/:questionNumber" component={Question_page} />
        <Route path="*" component={() => <>404</>} /> {/* Catch-all for 404 */}
    </Router>
      <footer>
      <InfoCard info="This game is a work in progress. The goal is to solve each equation by breaking it down into steps. The game will tell you how many steps you are from the answer. The game is currently only displaying the first couple of questions. The game will also not work if you go back to a question that you have already answered. The game will also not work if you undo a question and then try to go to the next question.">
      <ProfileCard phone="+1 574-329-1927" name="shmuli keller" email="shmulikeller@gmail.com" image={profile_image}></ProfileCard>
      </InfoCard>
        
      </footer>
    </>
  );
};








