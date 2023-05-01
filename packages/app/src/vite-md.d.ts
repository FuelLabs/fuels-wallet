declare module '*.md' {
  import type React from 'react';

  const ReactComponent: React.VFC;
  export { attributes, toc, html, ReactComponent };
}
