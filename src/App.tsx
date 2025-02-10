import { createEffect, createSignal, For, JSX, Show } from "solid-js";
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
import { userState } from "./userState";

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
  function Variable_C() {
    return (
      <>
        <Show when={side().variable! && side().variable!.product != 0}>
          <Show
            when={!shouldDisplayInReverse(side().variable?.product!)}
            fallback={
              <span>
                {side().variable?.letter + "/" + 1 / side().variable?.product!}
              </span>
            }
          >
            {side().variable!.product != 1 && side().variable!.product}
            {side().variable!.letter}
          </Show>
        </Show>
      </>
    );
  }

  function Coefficient_C() {
    return (
      <>
        <Show when={side().coefficient}>
          {side().coefficient > 0 && side().variable && side().variable!.product
            ? "+ "
            : ""}
          <div class={styles["arrow-box-parent"]}>{side().coefficient}</div>
        </Show>
        <Show
          when={
            side().coefficient == 0 &&
            !(side().variable && side().variable!.product)
          }
        >
          0
        </Show>
      </>
    );
  }

  return (
    <>
      <Variable_C />
      <Coefficient_C />
      <Show when={side().subExpression}>
        + {side().subExpression.product}(
        <Expression side={() => side().subExpression} />)
        {/* <span style={{background: "pink"}}>

{JSON.stringify(side())}
</span> */}
      </Show>
    </>
  );
}

function minusFromBothSides(
  currentEquation: { lhs: Side; rhs: Side },
  amount: number
) {
  currentEquation.lhs.coefficient -= amount;
  currentEquation.rhs.coefficient -= amount;
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
        <Show when={side().variable! && side().variable!.product != 0}>
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
        </Show>

        <Show when={side().squareRoot}>
          <FocusSpan>
            squareRoot of (
            <Expression side={() => side().squareRoot!} isFullSide={false} />) +
            <div class={styles.controls}>
              <button onclick={() => squareBothSides(state.currentEquation!)}>
                square both sides
              </button>
            </div>
          </FocusSpan>
        </Show>
        <Show when={side().squared}>
          <FocusSpan>
            (<Expression side={() => side().squareRoot!} isFullSide={false} />)
            squared +
            <div class={styles.controls}>
              <button
                onclick={() => squareRootBothSides(state.currentEquation!)}
              >
                square root both sides
              </button>
            </div>
          </FocusSpan>
        </Show>
      </>
    );
  }

  function Coefficient_C() {
    return (
      <>
        <Show when={side().coefficient}>
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
                <ArrowBoxSVG />
              </Show>
            </div>
            <Show when={isFullSide && side().variable}>
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
        </Show>
        <Show
          when={
            side().coefficient == 0 &&
            !(side().variable && side().variable!.product)
          }
        >
          0
        </Show>
      </>
    );
  }

  return (
    <>
      <Variable_C />
      <Coefficient_C />
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
    </>
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
      <h1>Interactive Equation Solver</h1>

      <div id={styles.main_question} class={styles.question}>
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

      <Show when={needsDivision(state.currentEquation)}>
        <div id={styles.forms}>
          <form onsubmit={(e) => e.preventDefault()}>
            divide both sides by <input ref={divideInputRef} type="number" />
            <button
              onclick={() => {
                saveCurrentEquationPosition();
                divideEntireSide(
                  state.currentEquation!.lhs,
                  parseInt(divideInputRef!.value)
                );
                divideEntireSide(
                  state.currentEquation!.rhs,
                  parseInt(divideInputRef!.value)
                );
              }}
            >
              submit
            </button>
          </form>
          <form onsubmit={(e) => e.preventDefault()}>
            times both sides by <input ref={timesInputRef} type="number" />
            <button
              onclick={() => {
                saveCurrentEquationPosition();
                timesEntireSide(
                  state.currentEquation!.lhs,
                  parseInt(timesInputRef!.value)
                );
                timesEntireSide(
                  state.currentEquation!.rhs,
                  parseInt(timesInputRef!.value)
                );
              }}
            >
              submit
            </button>
          </form>
        </div>
      </Show>
      <InfoDisplay />
      <div class={styles['bottom-controls']}>
        <button
          plain-action="ArrowLeft"
          disabled={state.currentEquation_id < 1}
          class={styles.control}
          onclick={() => state.currentEquation_id--}
        >
          previous question (press ←)
        </button>
        {/* <button class={styles.control} onclick={() => {state.currentEquation_id++; state.currentEquation_id--}}>
      <ReStartIcon/>
      </button> */}
        <button
          plain-action="ArrowRight"
          disabled={state.currentEquation_id > equations.length - 2}
          class={styles.control}
          onclick={() => state.currentEquation_id++}
        >
          next question (press →)
        </button>
      </div>
    </>
  );
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

export default function App() {
  return (
    <>
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
      {ph() && QuestionDisplay()}
    </>
  );
}

function InfoDisplay() {
  return (
    <>
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
