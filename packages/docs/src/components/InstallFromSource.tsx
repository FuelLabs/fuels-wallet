import { Code } from '~/src/components/Code';
import { Heading } from '~/src/components/Heading';
import { Link } from '~/src/components/Link';
import { Paragraph } from '~/src/components/Paragraph';
import { WALLET_LINK_NEXT, WALLET_LINK_STAGING } from '~/src/constants';
import { useIsPreviewEnv } from '../hooks/useIsPreviewEnv';
import { DownloadWalletZip } from './DownloadWalletZip';
import { UL } from './List';

export function InstallFromSource() {
  const isPreview = useIsPreviewEnv();

  return (
    <section>
      <Heading data-rank="h2">Install from source code</Heading>
      {isPreview ? (
        <Paragraph>
          You can also install the development version of Fuel Wallet, built
          directly from our source code, which is the same version as above. To
          do this:
        </Paragraph>
      ) : (
        <>
          <Paragraph>
            You can also install the development version of Fuel Wallet, built
            directly from our source code.
          </Paragraph>
          <Paragraph>
            In order to do that please check our instructions on how to install
            the extension from source code, please visit our docs over{' '}
            <Link href={WALLET_LINK_STAGING}>Staging</Link> or{' '}
            <Link href={WALLET_LINK_NEXT}>Next</Link>.
          </Paragraph>
        </>
      )}
      {!!isPreview && (
        <>
          <UL>
            <li>
              Download <DownloadWalletZip />;
            </li>
            <li>Inside Chrome or Brave;</li>
            <li>
              Open the extensions page; it can be done by:
              <UL>
                <li>{'Clicking on settings -> extensions or;'}</li>
                <li>
                  Accessing <Code>brave://extensions/</Code> or{' '}
                  <Code>chrome://extensions/</Code>.
                </li>
              </UL>
            </li>
            <li>Enable the "Developer mode" switch on the top right</li>
            <li>
              Load <Code>fuel-wallet.zip`</Code> by:
              <UL>
                <li>
                  Dragging your downloaded Fuel wallet file and dropping it in
                  the extensions page or;
                </li>
                <li>
                  Clicking on <Code>Load unpacked</Code> and selecting the file.
                </li>
              </UL>
            </li>
            <li>If all goes right, an onboarding page will instantly open.</li>
          </UL>
          <Paragraph>The Fuel Wallet extension is now ready to use.</Paragraph>
        </>
      )}
    </section>
  );
}
