/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@storybook/react';

export async function storyToComponent<T>(
  story: Story<T>,
  args: any = {},
  loaded: any = {},
): Promise<React.FC> {
  return () => {
    const context: any = {
      id: '',
      kind: '',
      name: '',
      parameters: {},
      argTypes: {},
      globals: {},
      args,
      loaded,
    };
    // @ts-expect-error: story expects T instead of Partial<T> | undefined
    return story(story.args, context);
  };
}
