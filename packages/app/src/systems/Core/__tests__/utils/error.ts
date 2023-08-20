export function byPassDataSpaceError() {
  // TODO: remove completely this after fuel-ui `dataSpace` problem gets fixed
  beforeEach(() => {
    const consoleError = console.error;

    jest.spyOn(console, 'error').mockImplementation((e) => {
      if (e.startsWith('Warning: React does not recognize the `%s` prop')) {
        return; // suppress specific warning
      }
      consoleError(e); // call original console.error with any other messages
    });
  });

  afterEach(() => {
    jest.spyOn(console, 'error').mockRestore();
  });
}
