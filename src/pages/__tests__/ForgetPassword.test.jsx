import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../ForgetPassword"; // Updated to match the file name
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

jest.mock("../../config/firebase", () => ({ // Fixed path for firebase mock
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

  test("shows validation message if email field is empty", async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Send Reset Link/i));

    await waitFor(() => {
      expect(screen.getByText("Please enter your email")).toBeInTheDocument();
    });
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

  test("displays error message for Firebase error", async () => {
    sendPasswordResetEmail.mockRejectedValue(new Error("Firebase error message"));

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByText(/Send Reset Link/i));

    await waitFor(() => {
      expect(screen.getByText("Firebase error message")).toBeInTheDocument();
    });
  });
});
