// Stepper.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react';

import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'SignUp/Components/Stepper',
  component: Stepper,
};

export default meta;
type Story = StoryObj<typeof Stepper>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Usage: Story = {
  render: () => <Stepper steps={3} active={2} />,
};
