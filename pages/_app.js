import Layout from "../components/layout";
import "./global.css";

function NftProfiler({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  );
}

export default NftProfiler;
