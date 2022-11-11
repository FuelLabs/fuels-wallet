export type DocType = {
  title: string;
  slug: string;
};

export type SidebarLinkItem = {
  slug?: string;
  submenu?: SidebarLinkItem[];
  subpath?: string;
  label: string;
};

export type NodeHeading = {
  title: string;
  id: string;
  children?: NodeHeading[];
};
