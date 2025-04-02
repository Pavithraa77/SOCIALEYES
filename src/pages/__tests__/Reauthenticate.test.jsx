import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Reauthenticate from "../Reauthenticate";
import { getAuth, reauthenticateWithCredential, signInWithPopup, deleteUser } from "firebase/auth";
import { BrowserRouter } from "react-router-dom";

// Mock window.alert since Jest does not support it
global.alert = jest.fn();

jest.mock("firebase/auth", () => {
  const mockAuth = {
    currentUser: { email: "test@example.com", providerData: [{ providerId: "password" }] }
  };

  return {
    getAuth: jest.fn(() => mockAuth),
    EmailAuthProvider: {
      credential: jest.fn((email, password) => ({ email, password })),
    },
    reauthenticateWithCredential: jest.fn(),
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(() => Promise.resolve()),
    deleteUser: jest.fn(() => Promise.resolve()),
  };
});

describe("Reauthenticate Component", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // ✅ Suppress error logs
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error.mockRestore(); // ✅ Restore console after each test
  });

  test("renders Reauthenticate component", () => {
    render(
      <BrowserRouter>
        <Reauthenticate />
      </BrowserRouter>
    );
    expect(screen.getByText(/Re-authenticate to Continue/i)).toBeInTheDocument();
  });

  test("renders email re-authentication form for password users", () => {
    render(
      <BrowserRouter>
        <Reauthenticate />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Re-authenticate/i })).toBeInTheDocument();
  });

  test("displays error when password re-authentication fails", async () => {
    reauthenticateWithCredential.mockRejectedValue(new Error("Wrong password"));

    render(
      <BrowserRouter>
        <Reauthenticate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Re-authenticate/i }));

    await waitFor(() => {
      expect(screen.getByText("Wrong password")).toBeInTheDocument();
    });
  });

  test("successfully re-authenticates and deletes the account", async () => {
    reauthenticateWithCredential.mockResolvedValue();
    deleteUser.mockResolvedValue();

    render(
      <BrowserRouter>
        <Reauthenticate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Re-authenticate/i }));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
    });
  });

  test("displays error when account deletion fails", async () => {
    reauthenticateWithCredential.mockResolvedValue();
    deleteUser.mockRejectedValue(new Error("Failed to delete account"));

    render(
      <BrowserRouter>
        <Reauthenticate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Re-authenticate/i }));

    await waitFor(() => {
      expect(screen.getByText("Failed to delete account")).toBeInTheDocument();
    });
  });

  test("re-authenticates with Google and deletes the account", async () => {
    const auth = getAuth();
    auth.currentUser.providerData[0].providerId = "google.com";

    signInWithPopup.mockResolvedValue();
    deleteUser.mockResolvedValue();

    render(
      <BrowserRouter>
        <Reauthenticate />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Re-authenticate with Google/i }));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
    });
  });

  test("displays error when Google re-authentication fails", async () => {
    const auth = getAuth();
    auth.currentUser.providerData[0].providerId = "google.com";

    signInWithPopup.mockRejectedValue(new Error("Google sign-in failed"));

    render(
      <BrowserRouter>
        <Reauthenticate />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Re-authenticate with Google/i }));

    await waitFor(() => {
      expect(screen.getByText("Google sign-in failed")).toBeInTheDocument();
    });
  });
});
