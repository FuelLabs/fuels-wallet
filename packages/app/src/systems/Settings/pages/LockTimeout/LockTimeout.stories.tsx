// import { LockTimeout } from "./LockTimeout";
// import { Meta, Story } from '@storybook/react';

// export default {
//     component: LockTimeout,
//     title: 'Settings/Pages/4. LockTimeout',
//     parameters: {
//         viewport: {
//             defaultViewport: 'chromeExtension',
//         },
//     },
//     // loaders: [
//     //     async () => {
//     //     // await AccountService.clearAccounts();
//     //     // await AccountService.addAccount({ data: MOCK_ACCOUNTS[0] });
//     //         return {};
//     //     },
//     // ],
// } as Meta;

// const Template: Story = (args) => <LockTimeout />;

import type { Meta, Story } from '@storybook/react';
// LockTimer.stories.tsx
import React from 'react';
import { LockTimeout } from './LockTimeout'; // Import the LockTimer component

export default {
  title: 'Components/LockTimer', // Storybook category and name
  component: LockTimeout, // The component being showcased
} as Meta;

const Template: Story = (args) => <LockTimeout {...args} />; // Template for stories

// Default state: Displays a list of lock times
export const Default = Template.bind({});
Default.args = {
  availableTimes: ['5 minutes', '10 minutes', '30 minutes', '1 hour'],
};

// Empty state: No lock times available
export const Empty = Template.bind({});
Empty.args = {
  availableTimes: [],
};

// Error state: Error loading times
export const ErrorState = Template.bind({});
ErrorState.args = {
  availableTimes: [],
  error: 'Failed to load available lock times.',
};
