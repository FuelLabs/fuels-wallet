import { fireEvent, render, screen, waitFor } from '@fuel-ui/test-utils';

import { CreatePassword } from './CreatePassword';

import { TestWrapper } from '~/systems/Core/components/TestWrapper';

const onSubmitHandler = jest.fn();
const onCancelHandler = jest.fn();

type UserPatch = ReturnType<typeof render>['user'];

const Content = () => (
  <CreatePassword onSubmit={onSubmitHandler} onCancel={onCancelHandler} />
);

function fillInput(el: HTMLElement, value: string) {
  fireEvent.input(el, { target: { value } });
}

async function fillInputs(user: UserPatch, pass: string, confirm?: string) {
  const password = screen.getByPlaceholderText('Type your password');
  const confirmPass = screen.getByPlaceholderText('Confirm your password');

  await user.tab();
  expect(password).toHaveFocus();
  fillInput(password, pass);
  await user.tab();

  if (confirm) {
    await user.tab();
    expect(confirmPass).toHaveFocus();
    fillInput(confirmPass, confirm);
    await user.tab();
  }
}

describe('CreatePassword', () => {
  it('should next button be disabled by default', async () => {
    render(<Content />, { wrapper: TestWrapper });
    const btn = screen.getByText('Next');
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("should validate if password don't have min length equals 8", async () => {
    const { user } = render(<Content />, { wrapper: TestWrapper });

    await fillInputs(user, '123456');
    expect(screen.getByText(/at least 8 characters/)).toBeInTheDocument();
  });

  it("should validate if password and confirmPassword doesn't match", async () => {
    const { user } = render(<Content />, { wrapper: TestWrapper });

    await fillInputs(user, '12345678', '12345679');
    await waitFor(() =>
      expect(screen.getByLabelText('Error message')).toBeInTheDocument()
    );
  });

  /**
   * TODO: try to fix this case later
   * btw, this is already testes using Cypress E2E
   */
  // it("should be able to click on next if form is valid", async () => {
  //   const { user } = render(<Content />, { wrapper: TestWrapper });

  //   await fillInputs(user, "123456789", "123456789");
  //   const checkbox = await screen.findByRole("checkbox");
  //   await user.click(checkbox);

  //   await waitFor(async () => {
  //     expect(checkbox.getAttribute("data-state")).toBe("checked");
  //     await user.tab();
  //   });

  //   await waitFor(async () => {
  //     const btn = await screen.findByText("Next");
  //     await user.click(btn);
  //     expect(btn.getAttribute("aria-disabled")).toBe("false");
  //     expect(onSubmitHandler).toBeCalledTimes(1);
  //   });
  // });

  it('should be able to click on cancel button', async () => {
    const { user } = render(<Content />, { wrapper: TestWrapper });
    const btn = screen.getByText('Cancel');
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(onCancelHandler).toBeCalledTimes(1);
  });
});
