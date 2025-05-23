import { JSX, Show } from "solid-js";
import styles from "./coefficient.module.css";
import { FocusSpan } from "@/components/FocusSpan";
import { userState } from "@/userState";
import { ArrowBoxSVG } from "@/components";
import { getDeviceType } from "@/utils/Device";
import { saveCurrentEquationPosition } from "@/actions/undo";
import { minusFromBothSides } from "@/actions/minusFromBothSides";
import { withPlusSignIfPositive } from "@/utils/math";
import { state } from "@/state";
import { Side } from "@/types/side";
import controls_styles from "@/shared_styles/controls.module.css";
import arrowBox_styles from "/Users/shmuli/repositories/step-solve/src/shared_styles/arrowBoxParent.module.css";


type coefficientProps = {
    side: () => Side;
    isFullSide: boolean;
};
export default function Coefficient_C({ side, isFullSide }: coefficientProps) {
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
              class={arrowBox_styles["arrow-box-parent"]}
            >
              {side().coefficient}
              <Show when={!userState.hasHovered && side().variable}>
                <ArrowBoxSVG
                  message={`${getDeviceType() == "mobile" ? "tap" : "hover"} to see options`}
                />
              </Show>
            </div>
            <Show when={isFullSide && (side().variable || side().squareRoot)}>
              <div class={controls_styles.controls}>
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