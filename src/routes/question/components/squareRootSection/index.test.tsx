import { render } from "solid-js/web";
import squareRootSection from "./index";

describe("squareRootSection component", () => {
  test("it renders without crashing", () => {
    render(() => <squareRootSection />);
  });
});
