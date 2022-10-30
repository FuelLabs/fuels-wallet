import { act, render, screen, testA11y } from '@fuel-ui/test-utils';

import { HomeActions } from './HomeActions';

describe('HomeActions', () => {
  it('a11y', async () => {
    await testA11y(<HomeActions />);
  });

  it("should show 'Send' and 'Receive' button", async () => {
    render(<HomeActions />);
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByText('Receive')).toBeInTheDocument();
  });

  it("should show 'Send' and 'Receive' button disabled", async () => {
    render(<HomeActions isDisabled />);
    expect(screen.getByText('Send')).toBeDisabled();
    expect(screen.getByText('Receive')).toBeDisabled();
  });

  it("should call 'Send' and 'Receive' actions when clicked", () => {
    const receiveAction = jest.fn();
    const sendAction = jest.fn();
    render(
      <HomeActions
        receiveAction={() => receiveAction()}
        sendAction={() => sendAction()}
      />
    );

    const receiveButton = screen.getByText('Receive');
    const sendButton = screen.getByText('Send');

    act(() => {
      receiveButton.click();
      sendButton.click();
    });

    expect(receiveAction).toBeCalled();
    expect(sendAction).toBeCalled();
  });
});
