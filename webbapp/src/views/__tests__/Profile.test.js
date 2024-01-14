import React from "react";
import { render } from "@testing-library/react";
import Hero from "../Hero";
import Profile from "../Profile";

// Mock react-leaflet
jest.mock('react-leaflet', () => ({
  TileLayer: () => null, // eller annan dummy-komponent
  Marker: () => null,
  Popup: () => null,
  MapContainer: () => null,
  Circle: () => null,
}));

describe("Home Component", () => {
  it("renders Hero component", () => {
    const { getByText } = render(<Hero />);

    // Perform assertions based on what you expect in the Hero component
    expect(getByText("Your Hero Component Content")).toBeInTheDocument();
  });

  it("renders Profile component", () => {
    const { getByText } = render(<Profile />);

    // Perform assertions based on what you expect in the Profile component
    expect(getByText("Your Profile Component Content")).toBeInTheDocument();
  });
});