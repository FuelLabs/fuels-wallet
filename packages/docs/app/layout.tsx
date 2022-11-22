import '../styles/index.css';
import '../styles/docsearch/_variables.css';
import '../styles/docsearch/button.css';
import '../styles/docsearch/modal.css';
import '../styles/docsearch/style.css';
import 'plyr-react/plyr.css';

import { Provider } from '~/components/Provider';
import { StyleProvider } from '~/components/StyleProvider';

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
