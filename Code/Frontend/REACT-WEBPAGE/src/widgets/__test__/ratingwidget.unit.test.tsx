import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { RatingWidget } from "../ratingwidget";
import ratingService from "../../services/ratingService";

jest.spyOn(ratingService, "getAvg").mockResolvedValue({ rating: 3 });
jest.spyOn(ratingService, "getUserRating").mockResolvedValue({ rating: 4 });

describe("Rating Widget Unit Test", () => {
  it("Should render correctly", async () => {
    render(<RatingWidget recipe_id={0} />);

    await waitFor(() =>
      expect(ratingService.getUserRating).toHaveBeenCalledTimes(1)
    );
    expect(ratingService.getAvg).toHaveBeenCalledTimes(1);

    expect(screen.getByText("3.0")).toBeInTheDocument();
    expect(screen.getAllByTestId("StarBorderIcon")).toHaveLength(1);
    expect(screen.getAllByTestId("StarIcon")).toHaveLength(4);
  });
});
