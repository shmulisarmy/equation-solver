import { render } from "solid-js/web";
import SwitchLevelControls from "./index";

describe("SwitchLevelControls component", () => {
  test("it renders without crashing", () => {
    render(() => <SwitchLevelControls />);
  });
});
