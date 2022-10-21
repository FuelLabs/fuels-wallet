/// <reference types="vite/client" />

// Add script module importing
declare module '*?script&module' {
  const src: string;
  export default src;
}
