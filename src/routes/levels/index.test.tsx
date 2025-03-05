import { render } from "solid-js/web";
import levels from "./index";

describe("levels component", () => {
  test("it renders without crashing", () => {
    render(() => <levels />);
  });
});
