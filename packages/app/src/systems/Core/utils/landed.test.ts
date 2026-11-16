import { act, renderHook } from '@testing-library/react';
import { markLanded, useLanded } from './landed';

describe('useLanded', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('lands once, then clears after the hold', () => {
    markLanded('asset:a');
    const { result } = renderHook(() => useLanded('asset:a'));
    expect(result.current).toBe(true);
    act(() => jest.advanceTimersByTime(1600));
    expect(result.current).toBe(false);
  });

  it('clears when the surface switches to another id mid-hold', () => {
    markLanded('account:1');
    const { result, rerender } = renderHook(({ id }) => useLanded(id), {
      initialProps: { id: 'account:1' },
    });
    expect(result.current).toBe(true);
    rerender({ id: 'account:2' });
    expect(result.current).toBe(false);
    act(() => jest.advanceTimersByTime(5000));
    expect(result.current).toBe(false);
  });
});
