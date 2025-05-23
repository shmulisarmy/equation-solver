import { JSX } from "solid-js";

export function InfoCard({ children, info }: { info: string; children?: JSX.Element; }) {
  //children is a profile
  return (
    <div
      class="card"
      style={{
        padding: "4px",
        border: "1px solid black",
        width: "fit-content",
        "border-radius": "10px",
        "box-shadow": "0 10px 6px rgba(0, 0, 0, .48)",
      }}
    >

      {children}
      <p
        style={{
          padding: "10px",
          "padding-top": "0px",
        }}
      >
        {info}
      </p>
    </div>
  );
}
