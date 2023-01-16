import { setGlobalConfig } from '@storybook/testing-react';

// Storybook's preview file location
import * as globalStorybookConfig from './preview';

// Replace with setProjectAnnotations if you are using the new pre-release version the addon
setGlobalConfig(globalStorybookConfig);
