import { For, JSX } from "solid-js";
import { EndOfLevelProps } from "./types";
import styles from "./EndOfLevel.module.css";
import { levelInfo } from "@/userState";
import { state } from "@/state";
import ConfettiCelebration from "@/components/celebration";
import SwitchLevelControls from "../SwitchLevelControls";


export default function  EndOfLevel(){
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
  
  