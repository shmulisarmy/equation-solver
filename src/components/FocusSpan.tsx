import { JSX } from "solid-js";

export function FocusSpan({ children }: { children: JSX.Element }) {
  return (
    <span
      tabIndex={0}
      onmouseenter={(e) => {
        if (e.target.querySelector("button")) e.target.focus();
      }}
    >
      {children}
    </span>
  );
}
