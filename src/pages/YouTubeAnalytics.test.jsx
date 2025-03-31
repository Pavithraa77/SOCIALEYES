
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import YouTubeAnalytics from "./YoutubeAnalytics"; // adjust path as needed

beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation((msg) => {
      // Suppress ONLY the TensorFlow platform warning
      if (typeof msg === "string" && msg.includes("Platform browser has already been set")) {
        return;
      }
      console.warn(msg);
    });
  });

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ items: [] }),
    })
  );

  global.alert = jest.fn(); // 👈 prevent alert crashes
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("YouTubeAnalytics Component", () => {
  test("renders input and buttons", () => {
    render(<YouTubeAnalytics />);

    expect(screen.getByPlaceholderText("Enter YouTube Video Link")).toBeInTheDocument();
    expect(screen.getByText("Show Statistics")).toBeInTheDocument();
    expect(screen.getByText("Start Real-time Tracking")).toBeInTheDocument();
  });

  test("allows user to type a YouTube link", () => {
    render(<YouTubeAnalytics />);
    const input = screen.getByPlaceholderText("Enter YouTube Video Link");

    fireEvent.change(input, { target: { value: "https://youtu.be/dQw4w9WgXcQ" } });
    expect(input.value).toBe("https://youtu.be/dQw4w9WgXcQ");
  });

  test("calls fetch on 'Show Statistics' click", async () => {
    render(<YouTubeAnalytics />);
    const input = screen.getByPlaceholderText("Enter YouTube Video Link");
    fireEvent.change(input, { target: { value: "https://youtu.be/dQw4w9WgXcQ" } });

    fireEvent.click(screen.getByText("Show Statistics"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});