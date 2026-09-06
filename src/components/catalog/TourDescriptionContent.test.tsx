import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TourDescriptionContent } from "./TourDescriptionContent";
import { descriptionImageMarkdown, insertDescriptionImage } from "./tour-description";

describe("tour description content", () => {
  it("inserts an uploaded image on its own line at the cursor", () => {
    const result = insertDescriptionImage(
      "BeforeAfter",
      descriptionImageMarkdown("/storage/tour.jpg", "Temple [view]"),
      6,
      6,
    );

    expect(result.value).toBe(
      "Before\n\n![Temple view](/storage/tour.jpg)\n\nAfter",
    );
    expect(result.cursor).toBe(43);
  });

  it("renders image lines between description paragraphs", () => {
    render(
      <TourDescriptionContent
        description={"First paragraph\n![Temple](/storage/temple.jpg)\nLast paragraph"}
      />,
    );

    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Temple" })).toHaveAttribute(
      "src",
      "/storage/temple.jpg",
    );
    expect(screen.getByText("Last paragraph")).toBeInTheDocument();
  });
});
