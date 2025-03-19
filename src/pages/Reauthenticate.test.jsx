import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Reauthenticate from "../pages/Reauthenticate";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup, deleteUser } from "firebase/auth";

jest.mock("firebase/auth", () => {
  const actualFirebaseAuth = jest.requireActual("firebase/auth");
  return {
    getAuth: jest.fn(() => ({
      currentUser: { email: "test@example.com", providerData: [{ providerId: "password" }] },
    })),
    reauthenticateWithCredential: jest.fn(() => Promise.resolve()), // Ensure success by default
    EmailAuthProvider: {
      credential: jest.fn(() => "mocked-credential"),
    },
    GoogleAuthProvider: jest.fn(() => new actualFirebaseAuth.GoogleAuthProvider()),
    signInWithPopup: jest.fn(() => Promise.resolve()),
    deleteUser: jest.fn(() => Promise.resolve()),
  };
});

beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert for all tests
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Reauthenticate Component", () => {
  test("renders email re-authentication form", () => {
    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Re-authenticate/i).length).toBeGreaterThan(0);
  });

  test("handles email re-authentication and account deletion", async () => {
    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Re-authenticate/i }));

    await waitFor(() => {
      expect(EmailAuthProvider.credential).toHaveBeenCalledWith("test@example.com", "password123");
      expect(reauthenticateWithCredential).toHaveBeenCalled();
      expect(deleteUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("✅ Account deleted successfully. Redirecting to login...");
    });
  });

  test("shows error if email re-authentication fails", async () => {
    reauthenticateWithCredential.mockRejectedValue(new Error("Invalid credentials")); // Simulate failure

    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Re-authenticate/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("handles Google re-authentication and account deletion", async () => {
    getAuth.mockReturnValue({
      currentUser: { providerData: [{ providerId: "google.com" }] },
    });

    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Re-authenticate with Google/i }));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(deleteUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("✅ Account deleted successfully. Redirecting to login...");
    });
  });

  test("shows error if Google re-authentication fails", async () => {
    signInWithPopup.mockRejectedValue(new Error("Google authentication failed")); // Simulate Google failure

    getAuth.mockReturnValue({
      currentUser: { providerData: [{ providerId: "google.com" }] },
    });

    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Re-authenticate with Google/i }));

    await waitFor(() => {
      expect(screen.getByText(/Google authentication failed/i)).toBeInTheDocument();
    });
  });
});
