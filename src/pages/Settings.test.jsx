import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Settings from "../components/Settings";
import { getAuth, deleteUser, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { providerData: [{ providerId: "password" }] },
  })),
  deleteUser: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

describe("Settings Component", () => {
  test("renders settings options correctly", () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    expect(screen.getByText(/Change Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete Account/i)).toBeInTheDocument();
  });

  test("opens and closes change email modal", () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Update/i));
    expect(screen.getByText(/Change Email/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("✖"));
    expect(screen.queryByText(/Change Email/i)).not.toBeInTheDocument();
  });

  test("opens and cancels delete account modal", () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Delete/i));
    expect(screen.getByText(/Confirm Account Deletion/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(screen.queryByText(/Confirm Account Deletion/i)).not.toBeInTheDocument();
  });

  test("deletes account for Google users", async () => {
    signInWithPopup.mockResolvedValue();
    deleteUser.mockResolvedValue();
    window.alert = jest.fn();

    const authMock = getAuth();
    authMock.currentUser.providerData[0].providerId = "google.com";

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Delete/i));
    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(deleteUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Your account has been deleted successfully.");
    });
  });

  test("redirects email/password users to re-authentication", async () => {
    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Delete/i));
    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/reauthenticate");
    });
  });
});