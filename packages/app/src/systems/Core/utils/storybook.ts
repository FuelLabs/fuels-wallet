import type { Story } from '@storybook/react';

export async function storyToComponent<T>(
  story: Story<T>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  args: any = {},
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  loaded: any = {}
): Promise<React.FC> {
  return () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
