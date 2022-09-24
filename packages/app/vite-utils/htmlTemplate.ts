import htmlTemplatePlugin from 'vite-plugin-html-template';

export const htmlTemplate = (config: {
  pagesDir: string;
  indexPage: string;
  pages?: { [key: string]: { template: string } };
}) => {
  const plugin = htmlTemplatePlugin({
    pagesDir: config.pagesDir,
    entry: config.indexPage,
    pages: {
      ...config.pages,
      src: {
        template: config.indexPage,
      },
      index: {
        template: config.indexPage,
      },
    },
  });
  return plugin;
};
