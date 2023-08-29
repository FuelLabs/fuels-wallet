import type { render } from '@fuel-ui/test-utils';
import { fireEvent, screen, waitFor } from '@fuel-ui/test-utils';

import { SignUpProvider } from '../SignUpProvider';

import { CreatePassword } from './CreatePassword';

import { renderWithProvider } from '~/systems/Core/__tests__';

const onSubmitHandler = jest.fn();
const onCancelHandler = jest.fn();

type UserPatch = ReturnType<typeof render>['user'];

const Content = () => (
  <SignUpProvider>
    <CreatePassword
      step={2}
      onSubmit={onSubmitHandler}
      onCancel={onCancelHandler}
    />
  </SignUpProvider>
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
    fireEvent.mouseOver(screen.getByLabelText('Password strength'));

    const fuelPopoverContent = await screen.findByText(/weak/i);
    expect(fuelPopoverContent).toBeVisible();
  });

  it("should validate if password and confirmPassword doesn't match", async () => {
    const { user } = renderWithProvider(<Content />);

    await fillInputs(user, 'Qwe123456$', 'Qwe1234567$');
    await waitFor(() =>
      expect(screen.getByLabelText('Error message')).toBeInTheDocument()
    );
  });

  it('should be able to click on cancel button', async () => {
    const { user } = renderWithProvider(<Content />);
    const btn = await screen.findByText('Back');
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(onCancelHandler).toBeCalledTimes(1);
  });
});
