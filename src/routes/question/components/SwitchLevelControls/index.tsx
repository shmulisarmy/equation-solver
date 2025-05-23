import { JSX } from "solid-js";
import { SwitchLevelControlsProps } from "./types";
import styles from "./SwitchLevelControls.module.css";
import { A, useParams } from "@solidjs/router";
import { state } from "@/state";
import { equations } from "@/data/equations";


export default function SwitchLevelControls(){
    return(
      <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    padding: "20px",
    background: "#f0f0f0",
    borderTop: "2px solid #ccc",
  }}
>
  <button
    plain-action="ArrowLeft"
    disabled={parseInt(useParams().questionNumber) <= 1}
    style={{
      padding: "10px 15px",
      "font-size": "14px",
      cursor: "pointer",
      background: "#007BFF",
      color: "white",
      border: "none",
      "border-radius": "5px",
      opacity: parseInt(useParams().questionNumber) <= 1 ? 0.5 : 1,
    }}
    onclick={() => state.currentEquation_id--}
  >
    previous question (press ←)
  </button>

  <button
    onclick={() => {
      state.currentEquation_id++;
      state.currentEquation_id;
    }}
    style={{
      padding: "10px 15px",
      "font-size": "14px",
      cursor: "pointer",
      background: "#28a745",
      color: "white",
      border: "none",
      "border-radius": "5px",
    }}
  >
    restart question
  </button>

  <A
    href={`/question/${parseInt(useParams().questionNumber) - 1}`}
    plain-action="ArrowLeft"
    disabled={parseInt(useParams().questionNumber) < 1}
    style={{
      padding: "10px 15px",
      "font-size": "14px",
      "text-decoration": "none",
      color: "white",
      background: "#17a2b8",
      "border-radius": "5px",
      opacity: parseInt(useParams().questionNumber) < 1 ? 0.5 : 1,
      "pointer-events": parseInt(useParams().questionNumber) < 1 ? "none" : "auto",
    }}
  >
    previous question (press ←)
  </A>

  <A
    href="/levels"
    style={{
      padding: "10px 15px",
      "font-size": "14px",
      "text-decoration": "none",
      color: "white",
      background: "#6c757d",
      "border-radius": "5px",
    }}
  >
    levels
  </A>

  <A
    href={`/question/${parseInt(useParams().questionNumber) + 1}`}
    plain-action="ArrowRight"
    disabled={parseInt(useParams().questionNumber) >= equations.length - 1}
    style={{
      padding: "10px 15px",
      "font-size": "14px",
      "text-decoration": "none",
      color: "white",
      background: "#ffc107",
      "border-radius": "5px",
      opacity:
        parseInt(useParams().questionNumber) >= equations.length - 1 ? 0.5 : 1,
      "pointer-events":
        parseInt(useParams().questionNumber) >= equations.length - 1
          ? "none"
          : "auto",
    }}
  >
    next question (press →)
  </A>
</div>

    )
  }
  
  