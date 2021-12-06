import { useState } from "react";
import { Grid, Box, Typography, Button, TextField } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import collections from "../config/collections.json";
import { useRouter } from "next/router";

function EnterLink() {
  const [link, setLink] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onClick = (e) => {
    const parts = link.split("/");
    setLoading(true);
    router.push("/" + parts[parts.length - 1]);
  };

  return (
    <Grid container>
      <Grid item xs>
        <TextField
          name="url"
          disabled={loading}
          fullWidth
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://opensea.io/collection/cryptopunks"
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          onClick={onClick}
          sx={{ height: "100%", minWidth: 150, marginLeft: "0.5rem" }}
        >
          Go
        </Button>
      </Grid>
    </Grid>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>NFT Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ marginTop: "15rem", marginBottom: "2rem" }}>
        <Typography variant="h6">Paste an Opensea Collection URL</Typography>
        <EnterLink />
      </Box>
      <Typography variant="h6">Quick Reference</Typography>
      <ul style={{ columns: 3, margin: 0, padding: 0 }}>
        {collections.map((c) => (
          <li
            key={c.slug}
            style={{ listStyleType: "none", margin: 0, padding: 0 }}
          >
            <Typography>
              <Link href={`/${c.slug}`}>{c.name}</Link>
            </Typography>
          </li>
        ))}
      </ul>
    </>
  );
}
