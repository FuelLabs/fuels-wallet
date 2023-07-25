// Errors to be ignored (not saved in DB, and not reported)
export const WHITE_LIST = [
  // TODO: remove this when SDK gets fixed to don't throw it anymore
  `WebAssembly.compile(): Refused to compile or instantiate WebAssembly module because neither 'wasm-eval' nor 'unsafe-eval' is an allowed source of script`,
];
