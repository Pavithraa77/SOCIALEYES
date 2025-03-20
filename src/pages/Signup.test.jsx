import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "../pages/Signup";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";

jest.mock("../config/firebase", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  sendEmailVerification: jest.fn(),
}));

describe("Signup Component", () => {
  test("renders signup form", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Create a password/i)).toBeInTheDocument();
  });

  test("shows error message if fields are empty on submit", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Sign Up/i));

    expect(await screen.findByText(/Please fill all fields./i)).toBeInTheDocument();
  });

  test("handles successful signup and email verification", async () => {
    const mockUser = { user: { emailVerified: false, reload: jest.fn() } };
    createUserWithEmailAndPassword.mockResolvedValue(mockUser);
    updateProfile.mockResolvedValue();
    sendEmailVerification.mockResolvedValue();

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Create a password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "password123");
      expect(updateProfile).toHaveBeenCalledWith(mockUser.user, { displayName: "Test User" });
      expect(sendEmailVerification).toHaveBeenCalledWith(mockUser.user);
    });

    expect(await screen.findByText(/A verification email has been sent./i)).toBeInTheDocument();
  });

  test("shows error message for existing email", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({ code: "auth/email-already-in-use" });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Create a password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByText(/Sign Up/i));

    expect(await screen.findByText(/This email is already in use./i)).toBeInTheDocument();
  });
});