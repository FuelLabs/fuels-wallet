import { Layout } from "~/systems/Core";

export function HomePage() {
  return (
    <Layout title="Home">
      <Layout.TopBar />
      <Layout.Content>Helo</Layout.Content>
    </Layout>
  );
}
