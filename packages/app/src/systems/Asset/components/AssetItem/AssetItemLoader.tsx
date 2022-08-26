import { darkColors } from "@fuel-ui/css";
import { CardList } from "@fuel-ui/react";
import type { IContentLoaderProps } from "react-content-loader";
import ContentLoader from "react-content-loader";

export const AssetItemLoader = (props: IContentLoaderProps) => (
  <CardList.Item css={{ padding: 0 }}>
    <ContentLoader
      speed={2}
      width={320}
      height={70}
      viewBox="0 0 320 70"
      backgroundColor={darkColors.gray2}
      foregroundColor={darkColors.gray3}
      {...props}
    >
      <path d="M 62 35 c 0 12.703 -10.297 23 -23 23 S 16 47.703 16 35 s 10.297 -23 23 -23 s 23 10.297 23 23" />
      <path d="M 62 35 c 0 12.703 -10.297 23 -23 23 S 16 47.703 16 35 s 10.297 -23 23 -23 s 23 10.297 23 23" />
      <rect x="82" y="19" rx="4" ry="4" width="92" height="14" />
      <rect x="82" y="38" rx="4" ry="4" width="62" height="14" />
      <rect x="82" y="38" rx="4" ry="4" width="62" height="14" />
    </ContentLoader>
  </CardList.Item>
);
