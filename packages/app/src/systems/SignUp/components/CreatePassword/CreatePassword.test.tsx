import type { render } from '@fuel-ui/test-utils';
import { fireEvent, screen, waitFor } from '@fuel-ui/test-utils';

import { CreatePassword } from './CreatePassword';

import { renderWithProvider } from '~/systems/Core/__tests__';

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
    renderWithProvider(<Content />);
    const btn = screen.getByText(/next/i);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-disabled');
  });

  it('should show "password strength: Weak" when focus in password field', async () => {
    renderWithProvider(<Content />);

    const password = await screen.findByPlaceholderText('Type your password');
    fireEvent.focus(password);

    const fuelPopoverContent = await screen.findByText('Weak');
    expect(fuelPopoverContent).toBeVisible();
  });

  it("should validate if password and confirmPassword doesn't match", async () => {
    const { user } = renderWithProvider(<Content />);

    await fillInputs(user, 'Qwe123456$', 'Qwe1234567$');
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
    const { user } = renderWithProvider(<Content />);
    const btn = await screen.findByText('Back');
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(onCancelHandler).toBeCalledTimes(1);
  });
});
