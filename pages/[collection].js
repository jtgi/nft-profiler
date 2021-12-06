import axios from "axios";
import Error from "next/error";
import { useMemo } from "react";
import { Container, Box, Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Chart } from "react-charts";
import collections from "../config/collections.json";

export async function getStaticProps(context) {
  const collection = context.params.collection;
  console.log("fetching", collection);

  const meta = await getMeta(collection);
  const samples = await getSamples(collection);
  return {
    props: {
      meta,
      samples,
      collection: collection,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: collections.map((c) => ({
      params: {
        collection: c.slug,
      },
    })),
    fallback: true,
  };
}

async function getMeta(collection) {
  const { data } = await axios.get(
    `https://api.opensea.io/collection/${collection}`
  );

  return data.collection;
}
async function getSamples(collection) {
  const { data } = await axios.get(
    `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20&collection=${collection}`
  );

  return data.assets;
}

export function Graph({ trait, variants }) {
  const traitFreq = {
    label: trait,
    data: variants.map(([name, count]) => ({
      name,
      count,
    })),
  };

  const primaryAxis = useMemo(
    () => ({
      label: "",
      getValue: (datum) => datum.name,
    }),
    []
  );

  const secondaryAxes = useMemo(
    () => [
      {
        label: "",
        getValue: (datum) => datum.count,
      },
    ],
    []
  );

  return (
    <Chart
      options={{
        data: [traitFreq],
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
}

export default function Collection({ meta, samples, collection }) {
  if (!meta || !samples || !collection) {
    return <Error statusCode={500} />;
  }

  return (
    <>
      <Box sx={{ padding: "2rem 0rem" }}>
        <Typography variant="h2" fontWeight={800}>
          {meta.name}
        </Typography>
      </Box>
      <Grid container spacing={2} alignItems="start">
        <Grid item xs={4} className="meta">
          <Typography variant="h4">
            Traits ({Object.entries(meta.traits).length})
          </Typography>

          {Object.entries(meta.traits).map(([trait, variants]) => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${trait}-content`}
                id={`${trait}-header`}
              >
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  fontWeight={800}
                >
                  {trait}
                </Typography>
                &nbsp;
                <Typography>({Object.entries(variants).length})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {(() => {
                  const sorted = Object.entries(variants).sort(
                    (a, b) => b[1] - a[1]
                  );

                  return (
                    <>
                      <Box sx={{ height: 200 }}>
                        <Graph trait={trait} variants={sorted} />
                      </Box>
                      {sorted.map(([variant, count]) => (
                        <Grid container key={variant}>
                          <Grid item xs>
                            <Typography
                              sx={{
                                textTransform: "capitalize",
                              }}
                            >
                              {variant}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography>
                              {count}{" "}
                              <span style={{ opacity: 0.5 }}>
                                ({((count / meta.stats.count) * 100).toFixed(2)}
                                %)
                              </span>
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </>
                  );
                })()}
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
        <Grid container item xs={8} spacing={2}>
          {samples.map((sample) => (
            <Grid item key={sample.id}>
              <a href={sample.permalink}>
                <img width="200" src={sample.image_preview_url} />
              </a>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
