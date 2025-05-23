import { render } from "solid-js/web";
import celebration from "./index";

describe("celebration component", () => {
  test("it renders without crashing", () => {
    render(() => <celebration />);
  });
});
