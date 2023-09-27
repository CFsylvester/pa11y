const fs = require("fs")
const https = require("https")
const { parseStringPromise } = require("xml2js")

const downloadXML = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ""
      res.on("data", (chunk) => {
        data += chunk
      })
      res.on("end", () => resolve(data))
      res.on("error", reject)
    })
  })
}

const processURL = (url, basePathSet) => {
  const parts = new URL(url).pathname.split("/").filter((part) => part)
  // If URL has more than one slug, remove the last slug if the base path already exists in the set.
  if (parts.length > 1 && basePathSet.has(parts.slice(0, parts.length - 1).join("/"))) {
    parts.pop()
  } else if (parts.length > 1) {
    basePathSet.add(parts.slice(0, parts.length - 1).join("/"))
  }
  return `https://amperity.com/${parts.join("/")}`
}

const additionalUrls = [
  "https://amperity.com/resources/webinars/the-economics-of-your-messy-data",
  "https://amperity.com/resources/amplify-summit-2023-keynote",
  "https://amperity.com/resources/thriving-in-the-new-ad-ecosystem"
]

const updatePa11yConfigWithUrls = async (sitemapUrl) => {
  try {
    const xml = await downloadXML(sitemapUrl)
    const parsedXml = await parseStringPromise(xml)

    const uniqueUrlsSet = new Set()
    const basePathSet = new Set()

    parsedXml.urlset.url.forEach((urlEntry) => {
      const processedUrl = processURL(urlEntry.loc[0], basePathSet)
      uniqueUrlsSet.add(processedUrl)
    })

    // Add the additional URLs to the uniqueUrlsSet
    additionalUrls.forEach((url) => uniqueUrlsSet.add(url))

    // Reading the existing pa11yci.json file
    const pa11yConfig = JSON.parse(fs.readFileSync(".pa11yci.json", "utf8"))
    pa11yConfig.urls = Array.from(uniqueUrlsSet)

    fs.writeFileSync(".pa11yci.json", JSON.stringify(pa11yConfig, null, 2))
    console.log("Updated pa11yci.json with the URLs from the sitemap")
  } catch (error) {
    console.error("Failed to process the sitemap:", error)
  }
}

// Get sitemap URL from command-line argument.
const sitemapUrl = process.env.SITEMAP_URL

if (!sitemapUrl) {
  console.error("Please provide a sitemap URL.")
  process.exit(1)
}
updatePa11yConfigWithUrls(sitemapUrl)