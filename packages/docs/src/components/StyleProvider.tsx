'use client';

import { getCssText } from '@fuel-ui/css';
import { useServerInsertedHTML } from 'next/navigation';

export function StyleProvider() {
  useServerInsertedHTML(() => (
    <>
      <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
    </>
  ));
  return null;
}
