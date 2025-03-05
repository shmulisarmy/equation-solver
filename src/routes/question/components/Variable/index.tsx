import { Show } from "solid-js";
import { FocusSpan } from "@/components/FocusSpan";
import { saveCurrentEquationPosition } from "@/actions/undo";
import { divideBothSides } from "@/actions/divideBothSides";
import { otherSide, shouldDisplayInReverse } from "@/App";
import { slideVariableToOtherSide } from "@/actions/slideVarible";
import { withPlusSignIfPositive } from "@/utils/math";
import { timesBothSides } from "@/actions/timesBothSides";
import { state } from "@/state";
import controls_styles from "@/shared_styles/controls.module.css";


export function Variable_C({ side, isFullSide }: { side: () => Side, isFullSide: boolean }) {
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
              <div class={controls_styles.controls}>
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
  
  