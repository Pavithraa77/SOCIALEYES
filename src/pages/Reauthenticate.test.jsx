import { render, screen, fireEvent } from "@testing-library/react";
import Reauthenticate from "../pages/Reauthenticate";
import { getAuth } from "firebase/auth";
import { BrowserRouter } from "react-router-dom";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { email: "test@example.com", providerData: [{ providerId: "password" }] }
  })),
  EmailAuthProvider: { credential: jest.fn() },
  reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(() => Promise.resolve()),
  deleteUser: jest.fn(() => Promise.resolve()),
}));

describe("Reauthenticate Component", () => {
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
    expect(screen.getByText(/Re-authenticate/i)).toBeInTheDocument();
  });

  test("displays error when password re-authentication fails", async () => {
    getAuth.mockReturnValue({ currentUser: { email: "test@example.com", providerData: [{ providerId: "password" }] } });
    const { getByPlaceholderText, getByText } = render(
      <BrowserRouter>
        <Reauthenticate />
      </BrowserRouter>
    );
    fireEvent.change(getByPlaceholderText(/Enter your password/i), { target: { value: "wrongpassword" } });
    fireEvent.click(getByText(/Re-authenticate/i));
    expect(getAuth).toHaveBeenCalled();
  });
});