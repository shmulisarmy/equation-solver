import { Component, JSX } from "solid-js";
import styles from "./.module.css";

function SquareRootDisplay(props: { children: JSX.Element }): JSX.Element {
  return (
    <div class={styles.wrapper}>
      <span class={styles.rootSymbol}>√</span>
      <span class={styles.content}>{props.children}</span>
    </div>
  );
};

export default SquareRootDisplay;
