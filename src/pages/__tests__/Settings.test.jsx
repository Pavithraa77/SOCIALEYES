import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Settings from "../Settings";
import { getAuth } from "firebase/auth";

// Mock Firebase Auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { email: "test@example.com", providerData: [{ providerId: "password" }] },
  })),
}));

jest.mock("../ChangeEmail", () => () => <div data-testid="change-email-component">Change Email Component</div>);

describe("Settings Component", () => {
  test("renders all settings options", () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    expect(screen.getByText(/Change Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete Account/i)).toBeInTheDocument();
  });

  test("opens Change Email modal when clicking Update on Change Email", async () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    const changeEmailButton = screen.getByText(/Change Email/i).nextSibling;
    fireEvent.click(changeEmailButton);

    expect(screen.getByTestId("change-email-component")).toBeInTheDocument();
  });
});
