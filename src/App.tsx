import { createEffect, createSignal, For, JSX, onCleanup, onMount, Show } from "solid-js";
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
import { Levels } from "./components/LevelInfo";

import { Router, Route, Routes, Navigate, A, useParams } from "@solidjs/router";
import Marquee from "./components/Marquee";

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
          disabled={parseInt(useParams().questionNumber) < 1}
          class={styles.control}
          onclick={() => state.currentEquation_id--}
        >
          previous question (press ←)
        </button>
        <button class={styles.control} onclick={() => {state.currentEquation_id++; state.currentEquation_id}}>
      restart question
      </button>
      <A href={`/question/${parseInt(useParams().questionNumber)-1}`}
          plain-action="ArrowLeft"
          disabled={parseInt(useParams().questionNumber) < 1}
          class={styles.control}
          // onclick={() => state.currentEquation_id++}
        >
          previous question (press ←)
        </A>
      <A href="/levels" class={styles.control}>levels</A>
        <A href={`/question/${parseInt(useParams().questionNumber)+1}`}
          plain-action="ArrowRight"
          disabled={parseInt(useParams().questionNumber) >= equations.length - 1}
          class={styles.control}
          // onclick={() => state.currentEquation_id++}
        >
          next question (press →)
        </A>
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


function unLevelComplete(){
  levelInfo[state.currentEquation_id].completed_in = state.previousPositions.length;
  if (state.currentEquation_id < levelInfo.length-1){
    levelInfo[state.currentEquation_id+1].locked = false;
  };
}


export function Question() {
  createEffect(() => {
    
    state.currentEquation_id = parseInt(useParams().questionNumber)-1;
  })


  createEffect(() => {
    if (distanceToAnswer(state.currentEquation!) == 0) {
      unLevelComplete()
    }
  })

  return (
    <>
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
  "Super Easy": "rgb(127, 234, 234)",
  Easy: "rgb(160, 160, 22)",
  Medium: "rgb(193, 107, 21)",
  Hard: "rgb(122, 10, 10)",
}





export default function App() {
  return (
    <>
    <Router>
        <Route path="/levels" component={Levels} />
        <Route path="/question/:questionNumber" component={Question} />
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


const logos = {
  javascript: "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg",
  react: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  typescript: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
  vite: "data:image/jpeg;base64,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",
  "css": "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
  html: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
  "golang": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRom9flyBXVzKYEmQ2wGnRWXgVdf-XXqHNYYA&s",
  "burger": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhMVFRUVFRUYFxcVFxYXFRUXFxYXFhUVFxUYHSggGBolHhYWITEhJSkrLi4uFyAzODMtNygtLisBCgoKDg0OGhAQGy0gHyYvLS0vLS0tLS0tLS0tLS8tKy0tLS0tKy8tLS0tLy0tLS0tNS0tLSstLS0tLy0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAAECAwUGBwj/xABAEAABAwIEAwUGBAQFAwUAAAABAAIRAyEEEjFBBQZREyJhcYEUMpGhsdEjQlLhBxXB8DNicpLxgqKyFkNEU9L/xAAaAQACAwEBAAAAAAAAAAAAAAAAAgEDBAUG/8QAMREAAgIBAgMECQUBAQAAAAAAAAECEQMEIRIxQQUiUaETFTJSYXGBkfBCscHR4RTx/9oADAMBAAIRAxEAPwDhs0WTgpmXN0aGiEo5Br7IYtkok0k5owEEA5aVJoKaSiWmApoAfKVZCuZUCi6sEANTpEp3UCE3bHZSbUJU0RYwclSpyUgLq4wNE1EFdQRZVFsKVUboZ7jKaiLJVVGmlUNlQ16miAvKFXlQ5qqYd1U0QO4TorW1nNVDakFPUqyigLqlTMq3shV0jdWuuigJ06sBQ1KYQpUngFQSM5RVtRwJUMqKCy0VDCZ9QQpBtkIHQbqKJsNwWEzXOisxrBoFZRxgDYCzq9SSVJBWNVMFVBqJbSQAzynwlMucITVFPC1cpQBouw56pLPqYwklJSA9NgdooVJBVNKqQr2tzXWctLe2UKjynpUeqlVpwgCEJZiihBaqKjYCkCBYVEKdOqntKlCk2NnRRAIKJw1YBQxTpNkyIIMoElKq2EVQqw26zcXjRoLn5BEpRirkTCEpuooTnqtxlRp0ydf2RlGkNFz8uva2ijr4Oyk95sop4aUbQ4bP5ZRFKlJsAtLCvcBaD/VcvNrcz/UdXHoMEf0oEZwhnQD0P2RVPhrNMh01/ZaFHE7kDaCQJkR/fqj2ZCfdvr6rnZNTk6t/c0rDCP6Uc+7gdMxGW/UtEed7Kl/LrcxGUOA6OsfUFdlh8gcIa2QJk6eRkK99Nh7xa0g6gWPjpfZLHX5oraT+5RPFhb70F9kefu5Y/SSPUFAV+AVWmxB+K9Up8IpvGbvAeBB+uyVblqASDPS31W/F2hrEuJbr8+pjnptFLZqmeOYjAVWe8w+l0M2ovX63CnCGuGvu3Dvr9Fh4/ltj5DmAHqLFasXbtOs0a+X9MzZOyYvfFP7/ANnACqFeysEbxTlepTuzvjp+b91jNtrYhdvBqceeN43Zyc2nyYXU1RqB0CVQQDdQ7a0KkOV7RRZbOysDFS0q41rKKJEHAKx1VCqaiibLAkqxIUtVNEWKElKEkUwKAVfTrQFUGKYaqS0sFQohl1QxqvpC6ghEi2E1YWU3gyneLIJYLRpnVNF0XQdZUgXToVk201bSIBlxgC5KYLK4tipORug18T0UTmoKxseN5JcKHx+OzuhgIb13P2SoUfBD0maiOi1KdIggaEa+i5GfK5O2ei0unjjWwqTLR0ReDp3Ft9EqGHJjx2131R1Oj0Gp26kLBkmdCKJm8kn0FhA2tsiX0srGkb6RPhuo9kTP9f7/ALlWteXUmjcSAN4kz5/ssjZYWAgEAd6R5QfNadClpGpN/AaoOjRBJmACNx5WWngLyTf6eX7rLkaoiUqQXgcNIcdSDb6wqcLWLnkASASJ8fPyWnhxGlgdtummnRSp4UB7oFiSbePRJwprbmY3l3dhGFMNABuBoPS99kQcQ8WnYEfKR8PmhMZRgkNd+UTFzmEbqqtRLm5Q6xHWbg2WtZJQ7vVeH2MvDGW76htOoKrCTG4I8d7aoZwDh35MDuuAGby8fuEXicQZacoBIuBuel/RX0cFAu6DvAHmR+6seOWR0t65/HwK+NQV8vA5+tw+0kf6Ta/QrmOYeVhWGZgy1BuND4OXpGFgki8NJ/YSVHEYIHWx2S48GTFWXBLceWojNcGRWj55xVF1NxY8Q5pgj+9QoMuvUOeOV+2pmowfiM6fmG7T/ReY0bFer0GsWqx3VSXNfnRnD1WD0Utt0+RYBCYImpUBVRhbqM1jAKxirJV9BshKSQJEpilUZdOxtkWAoSSSRYURv0KsfTLTDgQV3GA5L7StTp9plzE96JiASbdbKnnvlVuDfSa2rnzhxgtALYIE22M/JZpWmkXKmjkWSdldSaToFEuLbBTw9UhMQH4fBVHaNn4JVuH1Bq36Ld5T4xTp1CazS5pFrAwfJG8y8YpVCDSaQPID5KQOMFAjUKFbDOAzRZb2Ey1qrGaDfRGc50WUmNYzUwmQNHF43E5GEjU2HmVl4SjMSiOLu9ydLn1t9/mp0KrANfuufq8jukdPQQSXEwzD4YTB0JH1A/qfitBlEybXH1kD7IHDYwOsAXEdBO9tEbVrODmt7OpncRDS0gvm1hvJhcmam2dmMooKoUO8NLAR8P3WkKcHwHohRwXG2LsM8DYy37+K6ng3KT6jfxqrWno0ZzfqZEFZMkW2lfmD1GOKtswqbZBB/u//AAnpUoIjQRG831/otninK1djvwS1zYF3GDPlGiHwXAna4ioGeDL7frcPlCon3PadDrUY2rTshhmiACR4aXWhhwyAAdPr5I7D8u4QZZqOBubvAzeZi3pCIZwbC3c172gGPfEW8x/VUyxKe6kimWrg9t/sD0qzWAktzXMHbbbwui6HEaUe/EbWm9vUIJ+ApQQ/EjWDMR/tJ1SNPh7HBr6wdsCasA2m4aQIT4FJdV+fLcpySxPxb+H+h9KtSM94Enx1+6m2tSBDS9gPi4A/Vcw/CcPzODazwJ/K9pHoYkhOzheA17V4AN5eIPmYkJlJRe/7EOMPFnYVaAs6bC4OuylSrC4J0CAwYwjGZabyG2Nnkj/uJiVGhhqAeXMxDzb3ZFttYkq2WdKVxa+O5n4U007+GwaypFQ7B311CKrOEgGxket5ny+yF9jom/auPqJ+iHdwQF4f7RUme7ppuCN/OyIZZpNbO34+P55ivgb3bX0DcRRm3gvEOdeHihjKjQIa6Ht8na/MFe70sO4QCc3Q6H1ErzH+M/CiDRxABjvU32695nh+r4hdTs1uOdS5Xs/3X58TJqGpY650cBTak5iGpuKva8r0lnOomVZTqkKLGypEKCR83VPnUXaKKgBy5JVpIIPRKvMrabm1KZBcwyAdD1B8xK5zm3mx+OqtcWCm1jcrWg5tTJJMDw+CDwuCmwKnjuBOpjPsqpRTakWRdKjOD5VtNDAmUdgwDqpINbh9OQp1nbKeEYPkqqrod1UrmBby4JxLPCSiecw5+IAAkBo06m5QTHZH5wIO0eO6hxLHkj3jPTr56LDqtY8U1CCt+Rpw4FNcUnSKKvL9KqGmrVczLNmBpPzSqcMwFEtIdUqEXPaGx8wAJ8lktZVq6gwD+UsHzc7VVcVwtOnk7ziXAlzQ6mS3SPcP1hYXhzZHxTn9Fsa4ZscFwpHYM58o0j3aQFo7jWgWsLeSH4h/FAOj8N1tJi3leV5+/BFx3A6ST8VfQ4X0ak/4tPFd5t/Ul6l3sjrKn8VKxGVrCR4wgHfxBxmrWhp6yZ+SHw/C2NAL4H99FrYTlWpUGam0Ob1kR9VVJaLHu4r5sreol4mPX5w4hUmaxaDs0LLq1cQ+761V3m933Xc0OTazn5C0MjUmI9ANUncl1gCcoIBicw+PkiOt0sNo8K+xU8sn1OEp0KmuZ3xKJZRqH8zl6FS5LbDZeZHvWsfBvTzXRYblXDMBBY2S28mXDxBOh8VTl7XxLlv9BfSPxPH/AOWuOpPxKLwPKpquygQepBjw9V65geD0aGbJ+ZwkOIMAafAqePcwOBJEZR8RpHwWWXbE22oL8+QjyS8Tzal/DyuA4gtEAxDiC6NvBQHKuLZAy1JdplcSPUgwPVd+eLCCZtveAR0+ai3jDQfe8xr81X6x1T5pP6Eenl0Z55i+Xcew90VPAQD8HCyEqYbiNO57ZvpI+S9RbxUOJAfaLRBIt0GqsHE3s3FSdBp5FWR7Sy8pQi/oOtXJHlVHjePpakkeLT+y1OG8/wBdp70f933XpzMVTc0ONNs9InzhVVOB4SsHZqLHX0c0SCOhN/gj/rwZdp4l9P8AxDrWyAuXucHViM0x1DSV1PEcFTxeGfQqF2WoBJbANiHCCR1AWDh+XaNFwNNuQgbWkdD1Whi+IOpsllMvPTMGz5E2VOPN6LLxRTS6W/8AaHefFkjvszynmvkatgWCqXtqUi7LmbILSfdzNPXwK56iwkLo+e+YcZWf2dam6jRsW0zBDo/MXizr7DRYlOq0NXt9HKc8SlOr+G5gnw33eRW1SCra+VZKvsUk4qAEpRdWhwCggXYFJXe2BJTsBs8vuZRDnPJJ2sjOJceFSnlA+XwXRs5owHs7WkszZRbLoQLyYXC8R4hSe5zqYAElZpSVbmpYmuQKx7TqFd7LbM1Y54k0awtLhvFQWEWOqbiIWFsPwQLyG7roKfLb+zLyQIEi11zPCuKtp1mucBEmfUQuj4tzWx9NzWPgRGqHNJjw0sp8gPh3CqtUF4Ngsh1PvkObuQVu8t80MZQNLU3j13WDx3EZadR+hdYHpO6ScYZE3JCzhkwOnswHE8VbJp0mM/SX5QT45Tt5qXDeGNeblo6k7Dy3WLwlmc5WiTIAHif3VPG6bGy05jVNgGu0IN8wE5rSIteOkHFLTSe0XXmO4TriZ2mLwmEYwRWYHA3c86+AA0TDGtyZKFIOcdajyGj/AKQbwuF4Nwy+Z1v6eZ2WxiWsY3vEjxk38lVHs+K9uTl+fAIY295GnQ4XWfiBTq1KYDmuP4bgXCxLbG2sfFZB5hqYSqWh0wdWSLf5mm0oc1vZ8Q6DnbDYyExJaDqRsTB8vIoDilJz6tWrltIeYLZAMCYbaBIv4jRalp8cu7JKhsuPGod1bnonDv4gsfBe4AgAE+7O263Wc5Yc08nbNudyJG+3ovJeC4B1anUDab8ktBfHdBnTNoNvitlvCWUhFQBpAgAi8kS3u6xcE7wfFc3N2Pp3La0LDTuSuzvm8fw+UTXbY9bRfqfJNiObsLF6rTPiXekD0XnzeGvLf8RlVp2Mt22btAJ06lW/yVzGEsYQbQCQ5t9dBI00PXwuj7Gw83J+Qy0kup1PFObcgMNqu6EMAHxXLYrniq8nKx1h+a8eceKKpvq0MorNdTze6SDldAEgB3SRtutB+FpVw0ZWNJs57HEF0nQt0EeS04tDp8fOJZ/xrmjj6/MeJmJAO9jb5p8LjqlQ9+oT8lsV+W3NrBnYl17tl3e8LXOxtqn/APRdWmM73OjUtp957RMd6PdPVbVhx/pighijB2zZq8To0cLlpZXVnlpc+BmawC7Bmu5xcdW7DXZYdDm1x/xGPECZO/jBKPwNMU2RRY/t3vFxLy6iWghp2kkA2BN9tFa5jwAHtpHU/wCJS7SNTILs0+B9EZcGPIlxLcXJjUnZdg+c6UavA6QdVo4bmZjzYPHQkCDtOq51/CqTwXZbyZIO5uLDTfzWXWwFWkc1J8tB9QfHquZk7Nw9NiiWndbHodXjdanYO0vBO21jPVX4PmerYHL6kNn1svNMbxJhvlOe1w6AIFzounfh3A9TAnxMXKxZdHGCXFzZnfEuZ19TH0cQzLXoNe3zFj1BFwfFcfzXy/SpNFbDueGZgHU3wS2dC12pHgb31V+DYW2FpvHj5ITj/Ew4di0zcFx8R+VXdmxzQzqOJvh6rpRHMwGqyUsqZwXqgJZZUxRKswVjdaDCCUyRBmHDpIiqDJSRYUcEKrz+Y/FIYl4BAcYPilWkWUadOVnrxL3fJMgXnqrsNiHtMNcQnFJWUqV1JCu+YYajjq4qkuM6lO5yZuqV8jRiviW50PLNIkyUXzrjRlbRa3uzLnEaugw0emqI5aow2Vg86YqoK7Ng1vdI3BN1Ed0GpcVk23B6OOdTEtAlwLSRuD1nfxCqrOBdmyhsADYCwiSdyVnOxT3wJ0ECwWlgOHA5X1RmaTEA3JtY9Br8CkyVHdj4Zynsh6PEXAxTbnd6wOhKTqJNWk6s/OC6IEZR3iBF7gkT6ol/CD2jm0iWAtLiwyS0Agw7wsDKH4jhizKA3IWgEzOZ8nMHRtEjRLHInyHljklcv8/PmbHEMA959/uCMu4tJiJEQn4JwBxc7tnhrHA0yGEZnTBgDN7piCdBKzsLxEmBlcSNcostGnWxD2E0qZaBq9wuIgmG+Egz6pZSp7s1RhCVs66hzDQwdEUy2nIOVlKlq6RBzPggAkyXA7nWwXAYjG16j3Pc1pDie6zusZcmG2Ntfn4rpeXOEsqB9QvBz5g22Z7CQRcEzJE2B2PWULxcGjVe0hppPquAaJBBi3djpaY/NJE2CenjxcPUHgftLZGBUxtQR3ImIvM+R0KJr1MS2nLx2YOgcHNc7xE+eyrx+Erue1wYZaIAMmzczgL6mJA0mLBbVCvVqAUqs91rSA1nu6gG8ZXt7wzExuRaU6ae5W3KmmAcJqGs8NqvNaYAD3OzMIFw3Nb7wEXXNBrTkqFjwPce11iCe6QQYOnh5LKGEqU6rX/qLiQbEgOgkEm536rqK2Bo18rsS0k5QA4EtJHXMP6pZON78i3EpOO3NeYbwHnNrqYp1g8kaPa6HjUARa0EAwevWxuP4Xh8Rhi72mpRdu1ku7QkXaW2OWBu6JWEzlXDghzH4g2ES+m4zaRPZgEaha9HAspU4LKmWZDqtRrRMWjLlJHXW3RCyRTqxpYZSVtNMlwd/YtDKFJ4zAXPfqlosC60MbsGgSdSYiSH8DgdpVaNZjQx1dNvQeMxZA1OP0qcdk1ru8IbSBdc90HtHyQJJGYdSqOLMqy6viKoLWwRTBJaS0ZiJ94nKLE6RN4hS+9uyttLZczN4k8VXk4aq1nZWce+A49MzZjSxiDOupQXtdQH8UAG1wIb0aTFrxquko8PpwKj8tmnvtyiWhjjnL2CAC4EAXkNnewWI4e5wqV3VHdmWUwGODiMpj8xsYBzdL+cVd2CroQouRz3EeGNMvp2J1aNHE7+crSw/HajqTQWzUaDL9BA3I3d1RzeXq5o56GR4cJdSzRUZMxGa0W38YlYOoJNicpIJktgWvtY/IK2MMWauJXXiZNRipXRbiOI1HfndHQGB8lQxRYJVlFklb4QjFVFUc8nnUcysyCVB4gpqAm6okzEEKJhQUAE+0HokqQUlG4HI4kd4q3CtslicO5roeCD4o/B4SWyqWzSluUCkpsaphuyTdVKIKK7d0+EZJCd7JKNwWFMggbpJF+DnZ2XDobTAVfE+H067ctQaaEat8QqmVYACIa9OjNkk5O2ee8SwXYVjTzSBEHeCJutzl5+YtZAIu4lxADbRJJsNAoc7YQAsqjU90+lx/VB8LxTcj2vLpLQGZYyyXXz7xfZU6iNxL9JOpG9h6xoVC99NtRpdZxBgkyYIOsiPISp4ys2pRexzWkiGtDWXknvX1AAGn3WZhOJ5WZXHM2QYMawRp6qXDcTDzrAa4DqA4mRMdCQsLg1v1R0ozT26M6GlSZTwpaBNQHMCWuGdpYA0xHuhzRa8TtsJj+IPLqVOA0AFrnF+rXAyItAAmJg2Guis7OvUI9mp1agyOa9rWuqC+4Ab3DYI7h/K3EKzX1vZ3sfRpy1tUFrqhaPcaIzOkC3n4qqC3tj5MqXdujW4fQZTwzhRcx7jklrhLRJEwL3iWzfrsFxFOv+Ke0YCSSIFhJc4k5j01E6QFo8NxtUUnurP70uJplsBpBHd85mR8p0GbgKvZOxYAc3tMrg2S5ozOh3+mRHwUY4uDlxP4fUaU7po2sI4U2Ew1zmCRclzHTv/umfqsd/4r+1IcMl3hoy3khpJgwZi8RI2lXe3sqAEEWGU3ABb0vpvotajXpuM02MaMhAaXENJDZg3tqYj/heNw33sfaW2xRwNnahzXNYajmyXvjKDma4ZBaLNi1hOiG4gKtM9mwhzWNAG5E5nEZRqPTr1UauKLc5a4NtHV0X3bfVV4XiDzTLRIkATHds4EQTvM/2U3FN7vkQ1FbJ0yNfidduRpcymXGBLBmJNxA92bjbcK91Euqn2hzqxcAJJIa2Tc5Y2jQCNFs4XiwdlpuDQGXaXXIIIdlmLCW+KB7dgqVKQfmcQXNblIIBMn8Q6mHAxGgVXpWn3VQ/B77sLa5jclMtYabMnfEM0M03ExE2t16yFPA4jPhXBz34h7H5QO6JaRkyvDmzOZzT3QQIm0EivhOKq03dnmYwOBvUAcP8ut48fBamJfTHZP8A/ea9veaG5ahJkNIAm1/O6sWopU3YjwK7SDMK4UWZKeWo4NjtAMvccSe8Zd3IytBIkdb2zcVxcYcNosBaaoLiXFuRx0IZTjfaSNhpCJq4otqFgY5jawdFNgykiSGN7PY91x63mLK7DcExGIex7qTyXZyHMphhpgmzS+rYQC64gmUiyOUq6CtRirZXg69LsS6qPfpgPY5pmW5mtIiCBqNDq02Xn3Em0wH9nI70DeWg2BI8I+C9gofw/rVe5iajWUASWspOcalzeXOECd9ftynPP8Pa9G2DpvrUfegZS9lu9NwXGRaATfwWzBCUZpy23MWo1EJRaTvY88pP2R1KwlAZS1xa4Frhq1wLXDzabhXdquyjjsINzKZxBQ4qKbXBSwCi0QqQ5Vdom7RLZIQKqZDZ0kAbmIbTrN74B+qDpcIe1pLBmYNfBVGqZt8lr8F4m+nbLIOo6hYVxLkbrje5yeJbDihhqui47gAamam0gG8HYrNHC3+Cvim0UuUU+YE1ez4KpgBwumzKztDTZbLD+0tmcXecryqnwtw1IXQ43iDX02sbTazLF5JmE3DK+RZDPjjFq9zN4hW/Efl90GAose/LmbfqNwpUyWuzNdBGhGq2mcztY0doySIu3r1jZZtZLPjinijf1/gTTrFklU3RyXF8R2jCx4cLyDGhCxcLhHFri3vBp2XqFDmLDVKjXZcsa90CfM9dlrPxHDngvqU6YcWxZovlnKLbLmz7UyR2ljZtjo4p3FnnnLXJuIxTO1zso05gF4Jc6DqGjbW8r1TgPJ2CpNbnBrOAu6oTB/6AcsecoLhvHuHMaA9zWAWAJzNHhHqimcw4J0Cm9rh1acuniCufqtZqZu1FpfL92aMeGMdr3O5wFRjWhjGta0WDWgAAeAC0qLgvNKPNOFY7K+oxg8al/DUrcwfNFCBDzcWOoM6XFoS4dVkg+/H6leXTX7JucX5WwmIcX1aNNz3AAuMyY0mNT4qrhXA6WGaadINDCdPrc6oXBcfZUkOqNadrj+myqrcRAcS+qMoiCLfHqp1Gtg6ai/v/AARDBlVxbNSrwrDuBD6NNwOoLGkfMIWpyjgHMLfZaMXPdYGuE9HNghVniNMi1QfEfRPQx7ItU26j1SR10Yuq2+YPDPxZHDcj8Pb/APHaZ1lzzNoOrkRiuSsJUZlY11GBA7IwB07hlvyUqePbHvzHXzRDOJgGMwWmGvwvaX8FTx5k7Tfmc47+GLA7NTxDg6Qe8xpEjqAQub5k5C4iTnayg/KTHZPd2jgY/WGgbwAV6R/NpMSPS8KY4jBu4fQfVMtbpLtDcWoSps+eXYmtJpCjWzsMOpsouc+mf80ixJ8Nlv8AD+A4mqab3YLFfhye4HUi+wgvnceEG5C9mr8bptIzZZPrKjU42GibAeX7qyWp0q5SHWXP7tnn/KWFBxQIZV7UNlz6oIfTaXZsrwd5JAsCco209SbiIb3lm/zZpuS0yBcC8fVDPx9OqSBU01iLfFUPWY8bcsTtvoJkjPLXEqo3cNVzX2RBcFz+FxTaYHfsesSqqvGhPvCNrj+yrIdqQhjXH7RS9LKUu7yDeYuXcLjKZZiKbXEizwAKjDsWvFx9DvK8B4lyHj6VSoxuHfUYxzg2ozKQ9oPdcGzNxtC92pYpjvzHyn6rjecufxQfUw+GE1G93OfdY4gH/qIn4hatP2jkyusUU/r59KRXPAo+06PFyCCQZBBIINiCNQRsU+Yoqrh3vc57nS5xLiTuSZJ+JSGBf4Lu/MybA+ZSZTJ0RIwp3BUmNg7jxIQAP7K5JdHQ4fRc0E4lgJ2III+SSCLAxX8E4xZCHkHQg+RBUXnqqR9gipiSd0JVe7aU3bDa6QqnohToHFMrNfzUTUTYlp1kIfM3d/wVydlbVBJeq6xkQVFtSluXFWnEUYPccTBgkqXuiFzAaBftCINV43BPTRZWHxZCudWJ0XNljdnYhK1sGue4+8B8VWaPgB85UDmMWOyeHaJUq5D7k2NboWgjw+y08NxPIMrSQ3yMDr81mMpuzADUozDUyCS7RrgCOoP/ACq8ii1vuWwckbPC+Iw7Me9HwPgugONbVEmxA6i3ksnC4mk1oHZMIA3/ADaWJRTK2HcJbRmAe6ajiD6H+5XIzRUpXwvy/s3xutw/DUHFs06b3jrYAjwJ19EW3HtaMrmvpPGkg+tim4ZzIwU2tYwtAFpMq/EcdcWd4NcLWIBIWOUZN1KPmOPgcc0mDUM+UBE1sS39c+Uk/IKnCYrDvILqYHk4C99vgjqePaGxSAAnQAfRZ5xSd0wfyMiriXa03E+sIahzG5joeC6DofutLiXEmg/iUxrfugfBwUqlOi9gLKQkiQ4MzR67qxcNd6NpkSVlNbmljzIpuzf6QTO0ELPxHFaxuaRjoZy+t0dR4h2IOZrXMmJaGgt822KtxPFKToJE9Bt5eSlKMX3YWvmLwrkZWH4jiiO4Hx/kED4j7qNAYp5LgXydiHSPVdRw/HNyyRH1HRaVDE0NWZWnciM3UwpjlW/dSK5Lh6HL4PhVcjMapnW4dEDxJB+Ss4tg6+Vvd797u/w2tAnNa58l1X80pRJc1xG0yfOy5rjvHCyhUqPIJykN8XGYVsEpSj1be2xVKckm+VHmx5lxILhTxFQMcdjFtBG7fRAUzuf3KFZRdsQiGMf0C9ljxQx+xGvkjz8pym7k7CA9TFQoXO4fkKcYrq1w9E9iBraxTCsVQ3GsUvagi0BaajuiZUHGn9KSAOfr8HxFM96k8eQJ+YVLcTVZbM4eB+xXp1GBbwlW1aLHCHtDr7iZm3j0Wf03ijS9P4M8wbxSqPzT5gK1vGH7hvzXU8Z5Spvl9A5Hfp1addOm2k+S4vEYR7CQ4ER8PirFKMiqUJRNFvGerPgfuk7HMdsR6LHUg5NSXISzWa4HRw+acsdtdZjK0IuhiwFNsgrq4d4MhpVlFzt2laeFxQO6PpvB6JJJPmWwyyhyKsHxNoABb4aeqMOLpHMRAJvMJhRB2CQw46BZXpIN2ma12hNLkiAx9PM2bbEx4qipiwDUGocT8jYj4BEHDD9ITHDj9IQtJFdQfaEn+koZXV9DHFpt8d03s46Jjhh0Q9JF9SV2hJdPMKZiG3g2M7wBOyI9uGUGb6G+p1WZ2A6Juy/u6rehT6li7Tfu+ZojiDfsf3VlXjTm5MrjE6bGOqyxTPj81LKfH4qPV8erD1nL3TtcNzJRLPx3McLQ0NzO8iClh+aMPTgUhVsTbRsEyYF1xjWn9R+JUwXfrd/uP3Wf1Pj8WT60l7p2p4hSrhwa6CRMPEabT5K9uIptZOYNMA9fAW+HzXBEO/U7/cVAsPU/EpfU8eXE6G9av3fM6qtxstd3e8Oo6eFoUKmNpuEw4uMzmJaBPlruuXFM+KdtBXLsrGuTYj7Tm/0o1Rj3BxyMcG5jJDSTGwA1O/hohuLYiviXCaZYxvutkT5u6lDtw3grGYcdAtWLSYsclJLdGTLq8mRcL5FTOGv6D1cwfUq4cOP6qY86lP8A/StbRHQKxtMLXxGaij+X9a1Ier3f+LSpewt3rA/6abz/AOWVXZR1T2UcTCgU8MonU1D5MY3553fRPS4ZQGlOof8AVVt8G0x9UT2jRum9qYN0Wwoj7LT/APpp/wC6v/SqkmPE6f6h8UlNsKB8TxBo363hCO5mY0b/ADTpLPCKk9zVObitiVLm1ovlIHWE1fGYfE6S136gNdrghJJTOCStCwyNumc/xbhRputBB0I39NllJJJ8Um1uJmik9hJJJK0pJNnZXsxVRu5SSUDVtYdQ408aifJEt475pJIoCY40Fczi7TqkkloC5vE2+Kl7e1JJRZND+3BL2wJJIsCQxgS9rCSSLChjjAmOOCSSLChvbmpvb2pkkAI8RCQ4mAkkgBfzYeKZ3F0kkwFTuNKl3GikkoAgeLPVb+Iv6p0lJDKvbHH8xUu09Ukk6QrEHpJJIA//2Q==",
  "sprite": "https://sfbeverages.com/cdn/shop/products/SpriteCans_grande.jpg?v=1633582584",
  "coke": "https://drdrinksusa.com/cdn/shop/products/Coke_grande.jpg?v=1546134439",
}

const colors = {
  javascript: "rgb(221, 196, 22)",
  react: "rgb(97, 218, 251)",
  typescript: "rgb(0, 122, 255)",
  vite: "rgb(250, 189, 47)",
  html: "rgb(255, 48, 48)",
  "css": "rgb(38, 166, 255)",
  "golang": "rgb(0, 174, 240)",
  "burger": "rgb(237, 28, 36)",
  "sprite": "rgb(0, 174, 240)",
  "coke": "rgb(237, 28, 36)",

}


function Stuff() {
  const text = "hello i am a dev who uses javascript and react and typescript with a foundation of html and css and vite, i also enjoy coding with a sprite of creativity while working on the backend with golang and sometimes grab a burger to fuel my coding sessions";
  return (
    <>
  <div
  style={{
    display: "flex",
    "flex-wrap": "wrap",
    "align-items": "center",
    padding: "10px",
    "box-shadow": "3px 6px 8px rgba(0, 0, 0, 0.15)",
  }}
  
  >
    <For each={text.split(" ")}>{(word) => <Show when={logos[word]}
      fallback={
        <span
        style={{
          padding: "0px",
          display: "inline-block",
        }}
        >{word}</span>
      }
    >
      <LogoTag text={word}  image={logos[word]!}></LogoTag>
      </Show>}
  </For>

  </div>
    </>
  );
}


function LogoTag({text, image}: {text: string, image: string}) {
  const color = colors[text]
  return (
    <>
    <span style={{
      cursor: "pointer",
      padding: "0px",
      display: "inline-flex", "align-items": "center", "justify-content": 
      "center",
      //  background: "white",
      // background: `linear-gradient(45deg, white 0%, ${color})`,
       "border-radius": "4px", "margin": "2px", border: `1px solid ${color}`}}>  
      <img 
      style={{margin: "0px",width: "20px", height: "20px"}} src={image}
      ></img>
      <span style={{"margin-right": "2px" , padding: "0", "padding-left": "0px"}}>{text}</span>
      </span>
    </>
)
}