import { render } from "solid-js/web";
import coefficient from "./index";

describe("coefficient component", () => {
  test("it renders without crashing", () => {
    render(() => <coefficient />);
  });
});
