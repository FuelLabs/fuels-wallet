import { Layout } from "~/systems/Core";

export function Home() {
  return (
    <Layout title="Home">
      <Layout.TopBar />
      <Layout.Content>Helo</Layout.Content>
    </Layout>
  );
}
