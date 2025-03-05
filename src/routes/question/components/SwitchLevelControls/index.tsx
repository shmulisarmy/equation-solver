import { JSX } from "solid-js";
import { SwitchLevelControlsProps } from "./types";
import styles from "./SwitchLevelControls.module.css";
import { A, useParams } from "@solidjs/router";
import { state } from "@/state";
import { equations } from "@/data/equations";


export default function SwitchLevelControls(){
    return(
      <div class={styles['bottom-controls']}>
          <button
            plain-action="ArrowLeft"
            disabled={parseInt(useParams().questionNumber) <= 1}
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
  
  