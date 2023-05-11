import { cssObj } from '@fuel-ui/css';
import { Link } from '@fuel-ui/react';

import { Pre } from './Pre';

import { REPO_LINK } from '~/src/constants';

export type CodeImportProps = {
  file: string;
  lines?: number[];
  testCase?: string;
  title?: string;
  __content: string;
  __filepath: string;
  __filename: string;
  __language: string;
  __lineStart: number;
  __lineEnd?: number;
};

export function CodeImport({
  __content: content,
  __filepath: filePath,
  __filename: filename,
  __language: language,
  __lineStart: lineStart,
  __lineEnd: lineEnd,
}: CodeImportProps) {
  const lines = `L${lineStart}${lineEnd ? `-L${lineEnd}` : ''}`;
  const link = `${REPO_LINK}/${filePath}#${lines}`;
  const title = (
    <>
      <Link css={styles.filename} isExternal href={link}>
        {filename}
      </Link>
    </>
  );
  return (
    <Pre title={title}>
      <code className={`language-${language}`}>{content}</code>
    </Pre>
  );
}

const styles = {
  filename: cssObj({
    '&, &:visited': {
      fontSize: '$sm',
      color: '$intentsBase9',
    },
    '&:hover': {
      color: '$intentsBase11',
      textDecoration: 'none',
    },
  }),
};
