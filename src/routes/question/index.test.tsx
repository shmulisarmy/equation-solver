import { render } from "solid-js/web";
import question from "./index";

describe("question component", () => {
  test("it renders without crashing", () => {
    render(() => <question />);
  });
});
