import { createPopUp } from './popups';

describe('createPopUp', () => {
  let create: jest.Mock;

  beforeEach(() => {
    create = jest.fn();
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    (globalThis as any).chrome = {
      windows: {
        create,
        getLastFocused: jest.fn(async () => ({
          top: 0,
          left: 5000,
          width: 800,
        })),
      },
    };
  });

  it('opens next to the focused window', async () => {
    create.mockResolvedValue({ id: 1 });
    await expect(createPopUp('popup.html')).resolves.toBe(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0]).toHaveProperty('left');
  });

  it('lets Chrome place the popup when the position is off screen', async () => {
    create
      .mockRejectedValueOnce(
        new Error(
          'Invalid value for bounds. Bounds must be at least 50% within visible screen space.'
        )
      )
      .mockResolvedValueOnce({ id: 2 });
    await expect(createPopUp('popup.html')).resolves.toBe(2);
    expect(create).toHaveBeenCalledTimes(2);
    expect(create.mock.calls[1][0]).not.toHaveProperty('left');
    expect(create.mock.calls[1][0]).not.toHaveProperty('top');
  });
});
