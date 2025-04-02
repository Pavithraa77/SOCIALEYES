import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../DashBoard"; // Updated import to match file name in structure

// Mock child components
jest.mock("../YoutubeAnalytics", () => () => <div data-testid="youtube-analytics">YouTube Analytics Component</div>);
jest.mock("../Settings", () => () => <div data-testid="settings-component">Settings Component</div>);

describe("Dashboard Component", () => {
  test("renders dashboard title and default home content", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Social Eyes/i)).toBeInTheDocument();
    expect(screen.getByText(/Social Media Insights/i)).toBeInTheDocument();
    expect(screen.getByText(/Engagement Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/New Followers/i)).toBeInTheDocument();
  });

  test("switches to YouTube Analytics when clicking YouTube icon", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const youtubeButton = screen.getAllByRole("button")[0]; // First button is YouTube
    fireEvent.click(youtubeButton);

    expect(screen.getByTestId("youtube-analytics")).toBeInTheDocument();
  });

  test("switches to Settings when clicking Settings icon", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const settingsButton = screen.getAllByRole("button")[1]; // Second button is Settings
    fireEvent.click(settingsButton);

    expect(screen.getByTestId("settings-component")).toBeInTheDocument();
  });

  test("navigates to home when clicking Logout button", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(window.location.pathname).toBe("/");
  });
});
