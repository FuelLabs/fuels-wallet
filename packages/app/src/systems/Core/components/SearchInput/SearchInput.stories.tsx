import { useState } from 'react';

import type { SearchInputProps } from './SearchInput';
import { SearchInput } from './SearchInput';

export default {
  component: SearchInput,
  title: 'Core/Components/SearchInput',
};

export const Usage = (args: SearchInputProps) => {
  const [value, setValue] = useState('');
  return <SearchInput {...args} value={value} onChange={setValue} autoFocus />;
};
