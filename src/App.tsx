import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { createMutable } from "solid-js/store";
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
import { LevelInfo } from "./components/LevelInfo";

function Equation_Side_C(props: { side: Side }) {
  return <Expression isFullSide={true} side={() => props.side} />;
}

function shouldDisplayInReverse(num: number): boolean {
  return (0 < num && num < 1) || (-1 < num && num < 0);
}

function PastExpressionSideDisplay({
  side,
  isFullSide,
}: {
  isFullSide: boolean;
  side: () => Side;
}) {
  return (
    <>
      <Expression isFullSide={false} side={() => side()} />
    </>
  )
}

function Expression({
  side,
  isFullSide,
}: {
  isFullSide: boolean;
  side: () => Side;
}) {
  function Variable_C() {
    return (
      <>
          <FocusSpan>
            <Show
              when={!shouldDisplayInReverse(side().variable?.product!)}
              fallback={
                <span>
                  {side().variable?.letter +
                    "/" +
                    1 / side().variable?.product!}
                </span>
              }
            >
              {side().variable!.product != 1 && side().variable!.product}
              {side().variable!.letter}
            </Show>
            <Show when={isFullSide}>
              <div class={styles.controls}>
                <Show
                  when={
                    side().variable!.product > 1 ||
                    side().variable!.product < -1
                  }
                >
                  <button
                    onclick={() => {
                      saveCurrentEquationPosition();
                      divideBothSides(
                        state.currentEquation!,
                        side().variable!.product
                      );
                    }}
                  >
                    divide both sides by {side().variable!.product} to isolate{" "}
                    {side().variable?.letter}
                    <abbr
                      title={`to this side to isolate ${
                        side().variable?.letter
                      } and the other side to keep the statement true`}
                    ></abbr>
                  </button>
                </Show>
                <Show when={otherSide(side()).variable}>
                  <button
                    onclick={() => {
                      saveCurrentEquationPosition();
                      slideVariableToOtherSide(side());
                    }}
                  >
                    apply{" "}
                    {withPlusSignIfPositive(-1 * side().variable!.product)}
                    {side().variable?.letter} to{" "}
                    <abbr
                      title={`to this side to isolate ${
                        side().variable?.letter
                      } and the other side to keep the statement true`}
                    >
                      both sides
                    </abbr>
                    to get rid of extra variable
                  </button>
                </Show>
                <Show
                  when={
                    side().variable!.product < 1 &&
                    side().variable!.product > -1 &&
                    side().variable?.product != 0
                  }
                >
                  <button
                    onclick={() => {
                      saveCurrentEquationPosition();
                      timesBothSides(
                        state.currentEquation!,
                        1 / side().variable!.product
                      );
                    }}
                  >
                    times both sides by {1 / side().variable!.product} to
                    complete {side().variable?.letter}
                    <abbr
                      title={`to this side to isolate ${
                        side().variable?.letter
                      } and the other side to keep the statement true`}
                    ></abbr>
                  </button>
                </Show>
              </div>
            </Show>
          </FocusSpan>

        
        
      </>
    );
  }

  let message_ids = 0
  function doIf<T>(e: T, f: (e: T) => void) {
    if (e) f(e)
  }

  function UserMessage(props: { message: string, when?: boolean }) {
    return (
      <Show when={props.when}>
      <Portal mount={document.querySelector("#messages")!}>

        <p >{props.message}</p>
      </Portal>
      </Show>
    );
  }


  function SquareRootSection(){
    return(
          <FocusSpan>
            <SquareRootDisplay>
            <Expression side={() => side().squareRoot!} isFullSide={false} />
              </SquareRootDisplay>
             
            <Show when={
              side_only_contains_squareRoot(side())}
              
              
            >
              <div class={styles.controls}>
                <button onclick={() => {
                  saveCurrentEquationPosition();
                  squareBothSides(state.currentEquation!)}
                }>
                  square both sides
                </button>
              </div>
            </Show>
            <UserMessage message="once the square root expression is isolated you can square both sides" when={!side_only_contains_squareRoot(side())} />

          </FocusSpan>
    )
  }

  function Coefficient_C() {
    return (
      <>
          <FocusSpan>
            {side().coefficient > 0 &&
            side().variable &&
            side().variable!.product
              ? "+ "
              : ""}
            <div
              onmouseenter={() => {
                setTimeout(() => (userState.hasHovered = true), 400);
              }}
              class={styles["arrow-box-parent"]}
            >
              {side().coefficient}
              <Show when={!userState.hasHovered && side().variable}>
                <ArrowBoxSVG
                  message={`${getDeviceType() == "mobile" ? "tap" : "hover"} to see options`}
                />
              </Show>
            </div>
            <Show when={isFullSide && (side().variable || side().squareRoot)}>
              <div class={styles.controls}>
                <button
                  onclick={function () {
                    saveCurrentEquationPosition();
                    const amount_to_minus = side().coefficient;
                    minusFromBothSides(state.currentEquation!, amount_to_minus);
                  }}
                >
                  apply {withPlusSignIfPositive(-1 * side().coefficient)} to{" "}
                  <abbr
                    title={`to this side to isolate ${
                      side().variable?.letter
                    } and the other side to keep the statement true`}
                  >
                    both sides
                  </abbr>
                </button>
              </div>
            </Show>
          </FocusSpan>

        
      </>
    );
  }

  function side_only_contains_squared(side: Side){
    return Object.keys(side).every((key) => !(!(["squared", "side"].includes(key)) && side[key])) 
  }


  function SquaredSection(){
    return(
      <FocusSpan>
        <SquaredDisplay>
            <Expression side={() => side().squared!} isFullSide={false} />
            </SquaredDisplay>
             
            <div class={styles.controls}>
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

      <Variable_C />
      </Show>
      <Show when={side().squareRoot}>
        <SquareRootSection />
      </Show>
      <Show when={side().squareRoot && side().coefficient}>+</Show>
      <Show when={side().coefficient}>
        <Coefficient_C />
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
          <Expression side={() => side().subExpression} />)
          {/* <span style={{background: "pink"}}>

{JSON.stringify(side())}
</span> */}
          <div class={styles.controls}>
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

function DiologDisplay(props: { diolog: string[] }) {
  const [diologIndex, setDiologIndex] = createSignal(0);
  return (
    <div class={styles.diolog}>
      <p>
        {(diologIndex() % props.diolog.length) + 1}/{props.diolog.length}
      </p>
      <p>{props.diolog[diologIndex() % props.diolog.length]}</p>
      <button
        onclick={() =>
          setDiologIndex((prev) => (prev - 1) % props.diolog.length)
        }
      >
        prev
      </button>
      <button
        onclick={() =>
          setDiologIndex((prev) => (prev + 1) % props.diolog.length)
        }
      >
        next
      </button>
    </div>
  );
}

function QuestionDisplay() {
  let divideInputRef: undefined | HTMLInputElement = undefined;
  let timesInputRef: undefined | HTMLInputElement = undefined;
  return (
    <>

      <div id={styles.main_question} class={styles.question}
        style={{
          background: "white",
          color: "black",
          border: "1px solid black",
          "margin-top": "10px",
        }}
      >
        <For each={state.previousPositions}>
          {(position: { lhs: Side; rhs: Side }) => (
            <div
              class={`flex ${styles["past-expression"]} ${styles.question}}`}
            >
              <PastExpressionSideDisplay
                side={() => position.lhs}
                isFullSide={false}
              />
              =
              <PastExpressionSideDisplay
                side={() => position.rhs}
                isFullSide={false}
              />
            </div>
          )}
        </For>
        <div class="flex">
          <Equation_Side_C side={state.currentEquation!.lhs} />
          <span>=</span>
          <Equation_Side_C side={state.currentEquation!.rhs} />
        </div>
      </div>
      <InfoDisplay />
    </>
  );
}


function Moves(){
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


function SwitchLevelControls(){
  return(
    <div class={styles['bottom-controls']}>
        <button
          plain-action="ArrowLeft"
          disabled={state.currentEquation_id < 1}
          class={styles.control}
          onclick={() => state.currentEquation_id--}
        >
          previous question (press ←)
        </button>
        <button class={styles.control} onclick={() => {state.currentEquation_id++; state.currentEquation_id--}}>
      restart question
      </button>
        <button
          plain-action="ArrowRight"
          disabled={state.currentEquation_id > equations.length - 2}
          class={styles.control}
          onclick={() => state.currentEquation_id++}
        >
          next question (press →)
        </button>
      </div>
  )
}

const [ph, setPh] = createSignal(true);

createEffect(() => {
  state.currentEquation = createMutable(
    objCopy(equations[state.currentEquation_id])
  );
  setPh((prev) => !prev);
  setPh((prev) => !prev);
  state.previousPositions = [];
});


function EndOfLevel(){
  const stars = Math.max(state.currentEquation!.fastest_route_to_answer - state.previousPositions.length+3, 0);


  levelInfo[state.currentEquation_id].completed_in = state.previousPositions.length
  levelInfo[state.currentEquation_id].stars = stars

  return(
    <>
    <ConfettiCelebration>
                <span
                style={{
                  "font-weight": "bold",
                  position: "absolute",
                  top: "-4%",
                  right: "-4%",
                  "font-size": "1.1em",
                  border: "1px solid black",
                  "border-top-left-radius": "4px",
                  "border-bottom-right-radius": "4px",
                  padding: "4px",
                  // "box-shadow": "3px 6px 8px rgba(0, 0, 0, 0.15)",
                  transform: "rotate(15deg)",
                  background: "white",
                }}
                >{state.previousPositions.length} {state.previousPositions.length == 1 ? "move" : "moves"}</span>
                <span>
                  <For each={Array.from({ length: stars })}>
                    {() => (
                      <svg
                        width="32px"
                        height="32px"
                        viewBox="0 0 24 24"
                        fill="rgba(237, 244, 29, 0.93)"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    )}
                  </For>
                </span>
              </ConfettiCelebration>
              <SwitchLevelControls />
                </>
  )
}

export default function App() {
  return (
    <>
    <LevelInfo/>
      <div id={styles.app}>
        <h1>Interactive Equation Solver</h1>

        <Show
          when={distanceToAnswer(state.currentEquation!)}
          fallback={
            <>
              <EndOfLevel/>
            </>
          }
        >
          <div
            style={{
              background: "black",
              color: "white",
              padding: "10px",
              height: "200px",
            }}
          >
            <h1>moves from the answer: </h1>
            <Slider value={() => distanceToAnswer(state.currentEquation!)} />
              
          </div>
        </Show>

        {/* <pre style={{ width: "800px" }}>{JSON.stringify(state.currentEquation, undefined, 2)}</pre> */}
        {ph() && QuestionDisplay()}
        <Show
          when={distanceToAnswer(state.currentEquation!)}>
      <Moves />
        </Show>

      </div>

      <footer>
      <InfoCard info="This game is a work in progress. The goal is to solve each equation by breaking it down into steps. The game will tell you how many steps you are from the answer. The game is currently only displaying the first couple of questions. The game will also not work if you go back to a question that you have already answered. The game will also not work if you undo a question and then try to go to the next question.">
      <ProfileCard phone="+1 574-329-1927" name="shmuli keller" email="shmulikeller@gmail.com" image={profile_image}></ProfileCard>
      </InfoCard>
        
      </footer>
    </>);
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






export const difficulty_tag_colors = {
  "Super Easy": "rgb(63, 223, 223)",
  Easy: "rgb(223, 223, 63)",
  Medium: "rgb(227, 141, 56)",
  Hard: "rgb(208, 67, 67)",
}




