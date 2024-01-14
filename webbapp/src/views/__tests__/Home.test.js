import React from "react";
import { render } from "@testing-library/react";
import Home from "../Home";

it("renders", () => {
  render(  <Fragment>
    <Hero/>
    <MapComponentCity/>
  </Fragment>);
});
