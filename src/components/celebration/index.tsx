import { JSX, onMount } from "solid-js";
import confetti from "canvas-confetti";
import styles from "./celebration.module.css";
import { state } from "../../state";


const ConfettiCelebration = ({children}: {children?: JSX.Element}) => {
  console.log("ConfettiCelebration", JSON.stringify(state, undefined, 2));
  let canvasRef;

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  onMount(() => {
    fireConfetti();
  });

  return (
    <div class={styles.container}
    style={{
      position: "relative"
    }}
    >
      <canvas ref={canvasRef} class={styles.canvas} ></canvas>
      <h1 class={styles.title}>You did it! 🎉</h1>
      <button class={styles.celebration} onclick={fireConfetti}>Fire Confetti Again</button>
      {children}
    </div>
  );
};

export default ConfettiCelebration;
