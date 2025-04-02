import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Login from "../Login";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Mock Firebase authentication functions
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock("../../config/firebase", () => ({ // Fixed path for firebase mock
  auth: {},
}));

const MockLogin = () => {
  return (
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe("Login Component", () => {
  test("renders login form", () => {
    render(<MockLogin />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("displays error when email or password is empty", async () => {
    render(<MockLogin />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // ✅ Updated: Use a more flexible matcher for finding error message
    expect(await screen.findByText(/email and password are required/i)).toBeInTheDocument();
  });

  test("calls signInWithEmailAndPassword with correct credentials", async () => {
    const mockUser = { user: { emailVerified: true } };
    signInWithEmailAndPassword.mockResolvedValue(mockUser);

    render(<MockLogin />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "password123");
    });
  });

  test("shows error message if email is not verified", async () => {
    const mockUser = { user: { emailVerified: false } };
    signInWithEmailAndPassword.mockResolvedValue(mockUser);

    render(<MockLogin />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/please verify your email before logging in/i)).toBeInTheDocument();
  });

  test("displays error message on invalid credentials", async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: "auth/wrong-password" });

    render(<MockLogin />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/incorrect password. please try again/i)).toBeInTheDocument();
  });

  test("calls signInWithPopup for Google login", async () => {
    signInWithPopup.mockResolvedValue({});

    render(<MockLogin />);

    fireEvent.click(screen.getByRole("button", { name: /sign in with google/i }));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    });
  });
});
