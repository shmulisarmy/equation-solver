import { JSX, Show } from "solid-js";
import { squareRootSectionProps } from "./types";
import styles from "./squareRootSection.module.css";
import { FocusSpan } from "@/components/FocusSpan";
import SquareRootDisplay from "@/components/SquareRootDisplay";
import { Expression, Side } from "@/types/side";
import { side_only_contains_squareRoot } from "@/insights/side_only_contains_squareRoot";
import { saveCurrentEquationPosition } from "@/actions/undo";
import { state } from "@/state";
import controls_styles from "@/shared_styles/controls.module.css";
import { squareBothSides } from "@/actions/squaring";
import { Expression_C, UserMessage } from "@/App";

export default function SquareRootSection({side, isFullSide}: {side: () => Side, isFullSide: boolean}){
    return(
          <FocusSpan>
            <SquareRootDisplay>
            <Expression_C side={() => side().squareRoot!} isFullSide={false} />
              </SquareRootDisplay>
             
            <Show when={
              side_only_contains_squareRoot(side())}
              
              
            >
              <div class={controls_styles.controls}>
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