import { Layout } from "~/systems/Core";

export function HomePage() {
  return (
    <Layout title="Home">
      <Layout.TopNav />
      <Layout.Content>Helo</Layout.Content>
    </Layout>
  );
}
