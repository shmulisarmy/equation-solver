import styles from "./.module.css";

function Slider(props: { value: () => number }) {
  const maxValue = 5;

  return (
    <div class={styles.container}>
      <div class={styles.sliderContainer}>
        <input
          type="range"
          min="1"
          max={maxValue}
          step="1"
          value={props.value()}
          onInput={(e) => e.currentTarget.value = props.value().toString()}
          class={styles.slider}
        />
        <div class={styles.tickMarks}>
          {Array.from({ length: maxValue }, (_, i) => i).map((num) => (
            <div class={`${styles.tick} ${num === props.value() ? styles.active : ""}`}>
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
