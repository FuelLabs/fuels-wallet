import { render, screen } from "@fuel-ui/test-utils";

import { CreatePassword } from "./CreatePassword";

import { Providers } from "~/systems/Core";

const onSubmitHandler = jest.fn();
const onCancelHandler = jest.fn();

type UserPatch = ReturnType<typeof render>["user"];

const Content = () => (
  <CreatePassword onSubmit={onSubmitHandler} onCancel={onCancelHandler} />
);

async function fillInputs(user: UserPatch, pass: string, confirm?: string) {
  const password = screen.getByPlaceholderText("Type your password");
  const confirmPass = screen.getByPlaceholderText("Confirm your password");

  await user.tab();
  expect(password).toHaveFocus();
  await user.type(password, pass);
  await user.tab();

  if (confirm) {
    await user.tab();
    expect(confirmPass).toHaveFocus();
    await user.type(confirmPass, confirm);
    await user.tab();
  }
}

describe("CreatePassword", () => {
  it("should next button be disabled by default", async () => {
    render(<Content />, { wrapper: Providers });
    const btn = screen.getByText(/next/i);
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("should validate if password don't have min length equals 8", async () => {
    const { user } = render(<Content />, { wrapper: Providers });

    await fillInputs(user, "123456");
    expect(screen.getByText(/at least 8 characters/)).toBeInTheDocument();
  });

  it("should validate if password and confirmPassword doesn't match", async () => {
    const { user } = render(<Content />, { wrapper: Providers });

    await fillInputs(user, "12345678", "12345679");
    expect(screen.getByText(/must match/)).toBeInTheDocument();
  });

  it("should be able to click on next if form is valid", async () => {
    const { user } = render(<Content />, { wrapper: Providers });

    await fillInputs(user, "12345678", "12345678");
    const btn = screen.getByText(/next/i);
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();

    const checkbox = screen.getByText(/i agree/i);
    expect(checkbox).toBeInTheDocument();
    await user.click(checkbox);
    expect(btn).not.toBeDisabled();

    await user.click(btn);
    expect(onSubmitHandler).toBeCalledTimes(1);
  });

  it("should be able to click on cancel button", async () => {
    const { user } = render(<Content />, { wrapper: Providers });
    const btn = screen.getByText(/cancel/i);
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(onCancelHandler).toBeCalledTimes(1);
  });
});
