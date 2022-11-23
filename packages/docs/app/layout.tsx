import '../src/styles/index.css';
import '../src/styles/docsearch/_variables.css';
import '../src/styles/docsearch/button.css';
import '../src/styles/docsearch/modal.css';
import '../src/styles/docsearch/style.css';
import 'plyr-react/plyr.css';

import { Provider } from '~/src/components/Provider';
import { StyleProvider } from '~/src/components/StyleProvider';

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <StyleProvider />
      </head>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
