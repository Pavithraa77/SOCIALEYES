import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

jest.mock("../config/firebase", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  sendPasswordResetEmail: jest.fn(),
}));

describe("ForgotPassword Component", () => {
  test("renders forgot password form", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
  });

  test("shows alert if email field is empty on submit", () => {
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Send Reset Link/i));

    expect(window.alert).toHaveBeenCalledWith("Please enter your email");
  });

  test("handles successful password reset request", async () => {
    sendPasswordResetEmail.mockResolvedValue();

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByText(/Send Reset Link/i));

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, "test@example.com");
    });

    expect(await screen.findByText(/Password reset link sent!/i)).toBeInTheDocument();
  });

  test("shows alert for Firebase error", async () => {
    window.alert = jest.fn();
    sendPasswordResetEmail.mockRejectedValue(new Error("Firebase error message"));

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByText(/Send Reset Link/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Firebase error message");
    });
  });
});
