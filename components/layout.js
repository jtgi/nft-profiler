import { ThemeProvider, Container, Typography } from "@mui/material";
import Link from "next/link";
import Head from "next/head";
import theme from "../config/theme";

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Container>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: 800,
            a: {
              textDecoration: "none",
              color: "black",
            },
          }}
          variant="h5"
        >
          <Link href="/">NFT PROFILER</Link>
        </Typography>
        <main>{children}</main>
      </Container>
    </ThemeProvider>
  );
}
