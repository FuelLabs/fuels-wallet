import { fireEvent, render, screen, testA11y } from '@fuel-ui/test-utils';
import { useState } from 'react';

import { SearchInput } from './SearchInput';

function Content() {
  const [value, setValue] = useState('');
  return (
    <SearchInput value={value} onChange={setValue} placeholder="Search..." />
  );
}

describe('SearchInput', () => {
  it('a11y', async () => {
    await testA11y(<Content />);
  });

  it('should render a input', async () => {
    render(<Content />);
    let input = screen.getByLabelText('Search');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'test' } });
    input = screen.getByLabelText('Search');
    expect(input).toHaveValue('test');
  });

  it('should be focus by default', async () => {
    render(<SearchInput value="test" autoFocus />);
    const input = screen.getByLabelText('Search');
    expect(input).toHaveFocus();
  });
});
