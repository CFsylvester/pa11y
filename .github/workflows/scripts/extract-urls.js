const fs = require("fs");
const https = require("https");
const { parseStringPromise } = require("xml2js");

// Function to download XML from a given URL
const downloadXML = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => resolve(data));
        res.on("error", reject);
      })
      .on("error", reject);
  });
};

// Function to process URLs from the sitemap
const processURL = (url, basePathSet) => {
  const parts = new URL(url).pathname.split("/").filter((part) => part);
  // If URL has more than one slug, remove the last slug if the base path already exists in the set.
  if (
    parts.length > 1 &&
    basePathSet.has(parts.slice(0, parts.length - 1).join("/"))
  ) {
    parts.pop();
  } else if (parts.length > 1) {
    basePathSet.add(parts.slice(0, parts.length - 1).join("/"));
  }
  return `https://amperity.com/${parts.join("/")}`;
};

// Additional hardcoded URLs to be included when processing the sitemap
const additionalUrls = [];

// Function to update pa11yci.json with URLs from the sitemap
const updatePa11yConfigWithSitemap = async (sitemapUrl) => {
  try {
    const xml = await downloadXML(sitemapUrl);
    const parsedXml = await parseStringPromise(xml);

    const uniqueUrlsSet = new Set();
    const basePathSet = new Set();

    parsedXml.urlset.url.forEach((urlEntry) => {
      const processedUrl = processURL(urlEntry.loc[0], basePathSet);
      uniqueUrlsSet.add(processedUrl);
    });

    // Add the additional URLs to the uniqueUrlsSet
    additionalUrls.forEach((url) => uniqueUrlsSet.add(url));

    // Reading the existing pa11yci.json file
    const pa11yConfig = JSON.parse(fs.readFileSync(".pa11yci.json", "utf8"));
    pa11yConfig.urls = Array.from(uniqueUrlsSet);

    fs.writeFileSync(".pa11yci.json", JSON.stringify(pa11yConfig, null, 2));
    console.log("Updated pa11yci.json with the URLs from the sitemap");
  } catch (error) {
    console.error("Failed to process the sitemap:", error);
    process.exit(1);
  }
};

// Function to update pa11yci.json with hardcoded URLs
const updatePa11yConfigWithHardcoded = () => {
  try {
    const hardcodedUrls = JSON.parse(
      fs.readFileSync("hardcoded-urls.json", "utf8")
    ).urls;

    // Reading the existing pa11yci.json file
    const pa11yConfig = JSON.parse(fs.readFileSync(".pa11yci.json", "utf8"));
    pa11yConfig.urls = hardcodedUrls;

    fs.writeFileSync(".pa11yci.json", JSON.stringify(pa11yConfig, null, 2));
    console.log("Updated pa11yci.json with hardcoded URLs");
  } catch (error) {
    console.error("Failed to process hardcoded URLs:", error);
    process.exit(1);
  }
};

// Main function to determine which URLs to use based on the flag
const main = async () => {
  const args = process.argv.slice(2);
  const useHardcoded = args.includes("--hardcoded-urls");

  if (useHardcoded) {
    updatePa11yConfigWithHardcoded();
  } else {
    const sitemapUrl = process.env.SITEMAP_URL;

    if (!sitemapUrl) {
      console.error("Please provide a sitemap URL via the SITEMAP_URL environment variable.");
      process.exit(1);
    }

    await updatePa11yConfigWithSitemap(sitemapUrl);
  }
};

// Execute the main function
main();
