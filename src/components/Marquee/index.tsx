import { createSignal, createEffect, For, onCleanup, JSX, children } from "solid-js";
import styles from "./.module.css";
import { createStore } from "solid-js/store";

function Marquee({children, shouldCount}: { children: JSX.Element[], shouldCount: () => boolean}) {
    const initial_jsx_items_array = children
  const [items, setItems] = createStore(initial_jsx_items_array);
  const [counter, setCounter] = createSignal(0);

  let containerRef: HTMLDivElement | undefined;
  let lastItemRef: HTMLDivElement | undefined;
  let firstItemRef: HTMLDivElement | undefined;

  createEffect(() => {
   
    if (counter() === 0 && containerRef) {
      setItems((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);

      lastItemRef = containerRef.children[containerRef.children.length - 1] as HTMLDivElement;
      firstItemRef = containerRef.children[0] as HTMLDivElement;

      if (firstItemRef && lastItemRef) {
        firstItemRef.style.setProperty("--travel-y", `${lastItemRef.offsetTop - firstItemRef.offsetTop}px`);
        firstItemRef.style.setProperty("--travel-x", `${lastItemRef.offsetLeft - firstItemRef.offsetLeft}px`);
      }
    }
  });

  const interval = setInterval(() => {
    if (shouldCount()) {
      setCounter((prev) => (prev + 1) % 50);
    }
  }, randint(35,45));

  onCleanup(() => clearInterval(interval));

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        "align-items": "center",
        "justify-content": "start",
        "flex-wrap": "wrap",
        overflow: "hidden",
        "margin-top": "10px",
        gap: "10px",
        width: "200px",
    }}
    >
      <For each={items}>
        {(item, index) => (
            <div
            class={index() === 0 ? "animo" : ""}
            style={{
                // background: "white",
              padding: "0",
              // background: `${index() != containerRef!.children.length - 1 ? "white" : `linear-gradient(90deg, rgb(202, 198, 198) ${counter() *2}%, white 0%)`}`,
              color: "darkblue",
            }}
          >
            {item}
          </div>
        )}
      </For>
    </div>
  );
}


function randint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Marquee;

