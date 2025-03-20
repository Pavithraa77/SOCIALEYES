import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { auth } from "../config/firebase";
import ChangeEmail from "../pages/ChangeEmail";

// Mock Firebase auth
jest.mock("../config/firebase", () => ({
  auth: {
    currentUser: {
      email: "testuser@example.com",
      providerData: [{ providerId: "password" }],
      emailVerified: true,
    },
  },
}));

describe("ChangeEmail Component", () => {
  test("renders ChangeEmail form correctly", () => {
    render(
      <BrowserRouter>
        <ChangeEmail />
      </BrowserRouter>
    );

    expect(screen.getByText(/Current email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Change Email/i })).toBeInTheDocument();
  });

  test("allows input in email and password fields", () => {
    render(
      <BrowserRouter>
        <ChangeEmail />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("New email");
    const passwordInput = screen.getByPlaceholderText("Current password");

    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("newemail@example.com");
    expect(passwordInput.value).toBe("password123");
  });
});
