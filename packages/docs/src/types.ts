import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type DocType = {
  title: string;
  slug: string;
  category?: string;
  pageLink: string;
  headings: NodeHeading[];
  source: MDXRemoteSerializeResult;
};

export type SidebarLinkItem = {
  slug?: string;
  submenu?: SidebarLinkItem[];
  subpath?: string;
  label: string;
  prev?: SidebarLinkItem;
  next?: SidebarLinkItem;
};

export type NodeHeading = {
  title: string;
  id: string;
  children?: NodeHeading[];
};
