import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Login from "./Login";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Mock Firebase authentication functions
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock("../config/firebase", () => ({
  auth: {},
}));

const MockLogin = () => (
  <BrowserRouter>
    <Login />
  </BrowserRouter>
);

describe("Login Component", () => {
  test("renders login form", () => {
    render(<MockLogin />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("displays error when email or password is empty", async () => {
    render(<MockLogin />);

    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText("Email and password are required!")).toBeInTheDocument();
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
    fireEvent.click(screen.getByText("Login"));

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
    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText("Please verify your email before logging in.")).toBeInTheDocument();
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
    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText("Incorrect password. Please try again.")).toBeInTheDocument();
  });

  test("calls signInWithPopup for Google login", async () => {
    signInWithPopup.mockResolvedValue({});

    render(<MockLogin />);

    fireEvent.click(screen.getByText("Sign in with Google"));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    });
  });
});
