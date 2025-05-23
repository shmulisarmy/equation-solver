import { Component, JSX } from "solid-js";
import styles from "./.module.css";

function SquaredDisplay ({children}: {children: JSX.Element}) {
  return (
    <p class={styles.expression}>
      {children}<sup class={styles.superscript}>2</sup>
    </p>
  );
};

export default SquaredDisplay;
