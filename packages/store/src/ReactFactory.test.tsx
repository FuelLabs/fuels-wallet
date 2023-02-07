import { mockStore } from './__mocks__';

describe('ReactFactory', () => {
  beforeEach(() => {
    mockStore.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
