import { render } from "solid-js/web";
import Marquee from "./index";

describe("Marquee component", () => {
  test("it renders without crashing", () => {
    render(() => <Marquee />);
  });
});
