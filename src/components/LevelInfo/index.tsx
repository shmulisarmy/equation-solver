import { For, Show } from "solid-js";
import { difficulty_tag_colors } from "../../App";
import { state } from "../../state";
import { levelInfo } from "../../userState";
import styles from "./.module.css";

export const LevelInfo = () => {
  const levelComponentWidth = 200;
  const unlockedLevelOpacity = 1;
  const lockedLevelOpacity = 0.4;

  return (
    <div>
      <h1
        style={{
          "font-size": "1.5rem",
          "font-weight": "bold",
          "margin-bottom": "1.5rem",
        }}
      >
        Levels
      </h1>
      <div
        style={{
          display: "grid",
          "grid-template-columns": `repeat(auto-fill, minmax(${levelComponentWidth}px, 1fr))`,
          gap: "20px",
          margin: "5%",
          padding: "5%",
          background: "#f0f0f0",
        }}
      >
        {levelInfo.map(
          (level: {
            number: number;
            difficulty: string;
            completed_in: number;
            locked: boolean;
            "contains square root"?: boolean;
            stars?: number;
          }) => (
            <div
              class={styles.level}
              style={{
                position: "relative",
                padding: "12px",
                border: "2px solid #bbb",
                "border-radius": "8px",
                background: level.locked ? "#eee" : "#fafafa",
                "box-shadow": "3px 3px 8px rgba(0, 0, 0, 0.15)",
              }}
            >
              <span
                style={{
                  "font-weight": "bold",
                  color: level.locked ? "#999" : "#111",
                  "font-size": "1.1em",
                }}
              >
                Level {level.number}
              </span>
              <span
                style={{
                  "padding-top": "4px",
                }}
              >
                <Show when={level.stars}>

                <For each={Array.from({ length: level.stars })}>
                  {(_, i) => (
                    <svg
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    fill={i() < 3 ? "rgba(173, 231, 130, 0.93)" : "white"}
                    xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        />
                    </svg>
                  )}
                </For>
                  </Show>
              </span>

              <span style={{ display: "block", "margin-top": "6px" }}>
                <p
                  style={{
                    color: level.locked ? "#999" : "#333",
                    "font-size": "0.9em",
                  }}
                >
                  {level.completed_in
                    ? `λ => F(${level.completed_in})`
                    : "Not completed"}
                </p>
              </span>

              <span style={{ display: "block", "margin-top": "6px" }}>
                {level["contains square root"] && <></>}
              </span>
              <marquee
                behavior="scroll"
                direction="left"
                style={{
                  // border: "solid 1px rgba(0, 0, 0, .3)",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                  }}
                >
                  <span
                    style={{
                      border: "solid 1px black",
                      padding: "4px",
                      "border-radius": "10px",
                    }}
                  >
                    <svg
                      fill="#000000"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      width="20px"
                      height="20px"
                      viewBox="0 0 445.878 445.878"
                    >
                      <g>
                        <path
                          d="M426.024,86.447H209.705l-84.911,298.911c-2.568,7.967-9.854,13.482-18.22,13.771c-0.236,0-0.464,0.006-0.688,0.006
		c-8.092,0-15.41-4.924-18.436-12.478l-34.714-86.782H19.851C8.884,299.876,0,290.986,0,280.022
		c0-10.965,8.893-19.854,19.851-19.854H66.18c8.109,0,15.421,4.941,18.436,12.483l19.237,48.09l72.472-260.218
		c2.639-8.213,10.279-13.781,18.903-13.781h230.798c10.97,0,19.854,8.89,19.854,19.851S436.988,86.447,426.024,86.447z
		 M436.723,353.227l-78.259-87.904l74.576-82.783c1.318-1.454,1.638-3.547,0.857-5.341c-0.804-1.791-2.577-2.946-4.54-2.946h-47.18
		c-1.442,0-2.802,0.629-3.759,1.72l-50.059,58.047l-49.674-58.029c-0.939-1.103-2.317-1.738-3.771-1.738h-49.334
		c-1.956,0-3.729,1.149-4.521,2.929c-0.81,1.785-0.479,3.875,0.824,5.332l73.743,82.81l-77.641,87.923
		c-1.297,1.465-1.605,3.552-0.813,5.325c0.813,1.785,2.586,2.92,4.528,2.92h48.9c1.472,0,2.867-0.65,3.807-1.785l51.819-62.181
		l53.05,62.229c0.951,1.11,2.328,1.743,3.782,1.743h49.97c1.962,0,3.735-1.141,4.527-2.926
		C438.354,356.779,438.035,354.692,436.723,353.227z"
                        />
                      </g>
                    </svg>
                    square roots
                  </span>
                  <span
                    style={{
                      border: "solid 1px black",
                      padding: "4px",
                      "border-radius": "10px",
                    }}
                  >
                    <svg
                      fill="#000000"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      width="20px"
                      height="20px"
                      viewBox="0 0 512 512"
                      enable-background="new 0 0 512 512"
                      xml:space="preserve"
                    >
                      <g id="5151e0c8492e5103c096af88a51f2639">
                        <path
                          display="inline"
                          d="M317.616,299.695c-13.419,12.875-25.163,21.957-34.687,26.502c-10.021,4.753-20.372,7.153-30.748,7.153
		c-12.68,0-22.976-4.038-30.574-12.015c-7.61-7.955-11.465-19.366-11.465-33.934l0.985-14.58l2.017-0.349
		c35.555-5.997,62.374-12.858,79.681-20.418c17.121-7.46,29.617-16.339,37.148-26.378c7.473-9.956,11.245-19.973,11.245-29.704
		c0-11.811-4.475-21.267-13.703-28.985c-9.257-7.706-22.609-11.611-39.659-11.611c-23.691,0-46.11,5.531-66.637,16.438
		c-20.485,10.9-36.87,26-48.692,44.883c-11.777,18.88-17.761,38.874-17.761,59.4c0,22.918,7.065,41.29,20.992,54.576
		c13.981,13.324,33.514,20.057,58.049,20.057c17.428,0,33.917-3.497,49.017-10.408c14.438-6.604,29.372-18.057,44.455-33.501
		C324.407,304.702,319.65,301.2,317.616,299.695z M213.495,257.956c5.29-29.878,14.625-53.69,27.729-70.849
		c9.27-12.28,19.537-18.497,30.537-18.497c5.817,0,10.745,2.237,14.634,6.679c3.768,4.333,5.692,10.296,5.692,17.707
		c0,17.175-7.718,32.802-22.942,46.513c-11.037,9.839-28.76,17.046-52.651,21.412l-3.656,0.674L213.495,257.956z M267.439,426.04
		C138.471,446.898,24.59,404.448,3.797,323.037c-13.291-51.994,14.435-108.392,68.154-153.895l-41.02-24.269l153.878-39.697
		c-1.443,0.491-3.293,1.322-5.373,2.312c2.033-0.757,3.963-1.609,6.017-2.345C103.332,142.84,55.504,225.449,75.702,304.481
		C95.884,383.502,177.412,432.743,267.439,426.04z M440.052,342.844l41.016,24.273l-153.874,39.693
		c1.435-0.499,3.294-1.314,5.369-2.329c-2.029,0.773-3.959,1.618-6.01,2.366c82.127-37.696,129.942-120.311,109.748-199.347
		C416.124,128.485,334.588,79.244,244.56,85.968c128.964-20.88,242.846,21.587,263.646,102.978
		C521.488,240.94,493.771,297.342,440.052,342.844z"
                        ></path>
                      </g>
                    </svg>
                    square numbers
                  </span>
                  <span
                    style={{
                      border: "solid 1px black",
                      padding: "4px",
                      "border-radius": "10px",
                    }}
                  >
                    <span
                      style={{
                        "font-size": ".7em",
                        "text-shadow": "3px 3px 2px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      2(x3 + 2)
                    </span>
                    subexpressions
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px",
                      border: "1px solid",
                      "border-radius": "4px",
                      background: difficulty_tag_colors[level.difficulty],
                      "border-color": difficulty_tag_colors[level.difficulty],
                      opacity: lockedLevelOpacity,
                      // background: "rgb(3, 3, 3)",
                      // color: level.locked ? 'rgba(0, 0, 0, 0.5)' : 'white',
                      "font-size": "1em",

                      // position: 'absolute',
                      // bottom: '10px',
                      // right: '10px',
                      // "z-index": '1'
                    }}
                  >
                    {level.difficulty}
                  </span>
                </div>
              </marquee>
              <Show when={!level.locked}>
                <button
                  style={{
                    "margin-top": "8px",
                    padding: "4px 8px",
                    background: "black",
                    color: "white",
                    "border-radius": "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => (state.currentEquation_id = level.number - 1)}
                >
                  Play
                </button>
              </Show>

              {level.locked && (
                <svg
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    fill: "grey",
                  }}
                  width="40"
                  height="40"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4ZM7 13V9H9V13H7Z"
                  />
                </svg>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
