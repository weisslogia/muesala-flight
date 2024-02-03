import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { FlightTable } from "../components/flight/FlightTable";
import { BrowserRouter as Router } from "react-router-dom";
import * as Flights from "../services/flight";

describe("List all Flights", () => {
  test("renders", async () => {
    vi.spyOn(Flights, "getFlights").mockImplementation(() => {
      return Promise.resolve({
        total: 1,
        count: 1,
        resources: [
          {
            code: "CoDeOE",
            capacity: 20,
            departureDate: "2024-01-01",
            status: "none",
            img: "",
            id: "some-ramdon-id",
          },
        ],
      });
    });
    render(
      <Router>
        <FlightTable /> 
      </Router>
    );
    const result = await screen.findByText(/CoDeOE/i);
    expect(result).toBeInTheDocument();
  });
});
