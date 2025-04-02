import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Signup from "../../pages/Signup";
import { auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

// Mock Firebase authentication functions
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  sendEmailVerification: jest.fn(),
}));

jest.mock("../../config/firebase", () => ({
  auth: {},
}));

const MockSignup = () => {
  return (
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );
};

describe("Signup Component", () => {
  test("renders signup form", () => {
    render(<MockSignup />);

    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Create a password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  test("shows error message if fields are empty", async () => {
    render(<MockSignup />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/please fill all fields/i)).toBeInTheDocument();
  });

  test("calls createUserWithEmailAndPassword with correct credentials", async () => {
    const mockUser = { user: { emailVerified: false } };
    createUserWithEmailAndPassword.mockResolvedValue(mockUser);

    render(<MockSignup />);

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password123"
      );
    });
  });

  test("calls updateProfile with correct display name", async () => {
    const mockUser = { user: { emailVerified: false } };
    createUserWithEmailAndPassword.mockResolvedValue(mockUser);

    render(<MockSignup />);

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(mockUser.user, { displayName: "John Doe" });
    });
  });

  test("sends email verification", async () => {
    const mockUser = { user: { emailVerified: false } };
    createUserWithEmailAndPassword.mockResolvedValue(mockUser);

    render(<MockSignup />);

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(sendEmailVerification).toHaveBeenCalledWith(mockUser.user);
      expect(
        screen.getByText(/a verification email has been sent/i)
      ).toBeInTheDocument();
    });
  });

  test("shows error message if email is already in use", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({ code: "auth/email-already-in-use" });

    render(<MockSignup />);

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/this email is already in use/i)).toBeInTheDocument();
  });

  test("shows error message for weak password", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({ code: "auth/weak-password" });

    render(<MockSignup />);

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/password should be at least 6 characters/i)).toBeInTheDocument();
  });

  test("shows error message for invalid email format", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({ code: "auth/invalid-email" });

    render(<MockSignup />);

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });
});
