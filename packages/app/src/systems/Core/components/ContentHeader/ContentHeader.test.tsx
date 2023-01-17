import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { ContentHeader } from './ContentHeader';

const title = 'Awesome title';

describe('ContentHeader', () => {
  it('a11y', async () => {
    await testA11y(<ContentHeader title={title} />);
  });

  it('should render title and a body', async () => {
    render(<ContentHeader title={title}>This is body</ContentHeader>);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText('This is body')).toBeInTheDocument();
  });

  it('should not render body', async () => {
    render(<ContentHeader title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(() => screen.getByText('This is body')).toThrow();
  });
});
