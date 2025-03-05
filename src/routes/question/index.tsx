import { createEffect, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { state } from "../../state";
import { distanceToAnswer } from "../../data/equations";
import styles from "./question.module.css";
import { Moves, ph, QuestionDisplay, onLevelComplete } from "@/App";
import Slider from "@/components/Slider";
import EndOfLevel from "./components/EndOfLevel";

export default function Question_page() {
    createEffect(() => {
      
      state.currentEquation_id = parseInt(useParams().questionNumber)-1;
    })
  
  
  
    return (
      <>
        <div id={styles.app}>
          <h1>Interactive Equation Solver</h1>
  
      <Show when={state.atLevelEnd}><EndOfLevel/></Show>
          <Show
            when={distanceToAnswer(state.currentEquation!)}
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
  
          {/* the question resets when the question_id_is_changed */}
          {ph() && QuestionDisplay()}
          <Show
            when={distanceToAnswer(state.currentEquation!)}>
        <Moves />
          </Show>
  
        </div>
  
      
      </>);
  }



  
  createEffect(() => {
    state.currentEquation_id;
    state.atLevelEnd = false;
  })
  