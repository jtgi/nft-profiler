const cheerio = require("cheerio");
const axios = require("axios");

async function fetch() {
  try {
    const rsp = await axios.get(
      "https://opensea.io/rankings?sortBy=total_volume&category=collectibles"
    );
    const $ = cheerio.load(rsp.data);
    const data = $('div[role="listitem"] > a').map((i, link) => ({
      slug: link.attribs.href,
      name: link.textContent,
    }));

    console.log(data);
  } catch (e) {
    console.error(e);
  }
}

fetch();
