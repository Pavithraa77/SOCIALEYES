import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Reauthenticate from "../components/Reauthenticate";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup, deleteUser } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { email: "test@example.com", providerData: [{ providerId: "password" }] },
  })),
  reauthenticateWithCredential: jest.fn(),
  EmailAuthProvider: { credential: jest.fn() },
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  deleteUser: jest.fn(),
}));

describe("Reauthenticate Component", () => {
  test("renders email re-authentication form", () => {
    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByText(/Re-authenticate/i)).toBeInTheDocument();
  });

  test("handles email re-authentication and account deletion", async () => {
    reauthenticateWithCredential.mockResolvedValue();
    deleteUser.mockResolvedValue();
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByText(/Re-authenticate/i));

    await waitFor(() => {
      expect(EmailAuthProvider.credential).toHaveBeenCalledWith("test@example.com", "password123");
      expect(reauthenticateWithCredential).toHaveBeenCalled();
      expect(deleteUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("✅ Account deleted successfully. Redirecting to login...");
    });
  });

  test("shows error if email re-authentication fails", async () => {
    reauthenticateWithCredential.mockRejectedValue(new Error("Invalid credentials"));
    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByText(/Re-authenticate/i));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("handles Google re-authentication and account deletion", async () => {
    signInWithPopup.mockResolvedValue();
    deleteUser.mockResolvedValue();
    window.alert = jest.fn();

    const authMock = getAuth();
    authMock.currentUser.providerData[0].providerId = "google.com";

    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Re-authenticate with Google/i));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(deleteUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("✅ Account deleted successfully. Redirecting to login...");
    });
  });

  test("shows error if Google re-authentication fails", async () => {
    signInWithPopup.mockRejectedValue(new Error("Google authentication failed"));
    render(
      <MemoryRouter>
        <Reauthenticate />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Re-authenticate with Google/i));

    await waitFor(() => {
      expect(screen.getByText(/Google authentication failed/i)).toBeInTheDocument();
    });
  });
});