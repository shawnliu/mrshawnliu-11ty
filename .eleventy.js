const sass = require("sass");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // ---------------------------------------------------------------------------
  // Passthrough copies
  // ---------------------------------------------------------------------------
  // The postcard inbox holds raw scans; keep it off the site.
  eleventyConfig.addPassthroughCopy("assets", {
    filter: (p) => !/(^|\/)_?inbox(\/|$)/i.test(p) && !p.endsWith(".DS_Store"),
  });
  eleventyConfig.addPassthroughCopy("CNAME");
  // Old Jekyll pages kept as-is so their URLs keep working (see docs/deploy.md)
  eleventyConfig.addPassthroughCopy({ legacy: "/" });

  // ---------------------------------------------------------------------------
  // Ignore Jekyll artefacts that live in the repo root
  // ---------------------------------------------------------------------------
  eleventyConfig.ignores.add("_site");
  eleventyConfig.ignores.add("vendor");
  eleventyConfig.ignores.add("node_modules");

  // ---------------------------------------------------------------------------
  // Filters
  // ---------------------------------------------------------------------------

  // postDate — replaces Jekyll's  {{ page.date | date: "%B %-d, %Y" }}
  eleventyConfig.addFilter("postDate", function (date) {
    if (!date) return "";
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("MMMM d, yyyy");
  });

  // limit — replaces Jekyll's  | limit:N  Liquid filter
  eleventyConfig.addFilter("limit", function (arr, n) {
    return Array.isArray(arr) ? arr.slice(0, n) : arr;
  });

  // Postcard IDs stay three digits everywhere: #001–#100.
  eleventyConfig.addFilter("postcardId", function (id) {
    return String(id).padStart(3, "0");
  });

  // ISO dates are calendar dates, so parse them without timezone conversion.
  eleventyConfig.addFilter("postcardDate", function (date) {
    if (!date) return "";
    return DateTime.fromISO(date).toFormat("MMMM d, yyyy");
  });

  eleventyConfig.addFilter("postcardStatus", function (status) {
    const labels = {
      painted: "Painted",
      in_transit: "In transit",
      received: "Received",
      missing: "Missing",
      held: "Held",
    };
    return labels[status] || status;
  });

  eleventyConfig.addFilter("postcardById", function (postcards, id) {
    if (!Array.isArray(postcards)) return null;
    return postcards.find((postcard) => postcard.id === Number(id)) || null;
  });

  eleventyConfig.addFilter("numberRange", function (start, end) {
    const length = Number(end) - Number(start) + 1;
    return Array.from({ length }, (_, index) => Number(start) + index);
  });

  eleventyConfig.addFilter("postcardArchiveUrl", function (id) {
    return "/100-postcard-paintings/#" + String(Number(id)).padStart(3, "0");
  });

  // During image preparation, omit broken image elements but keep records usable.
  eleventyConfig.addFilter("assetExists", function (assetPath) {
    if (!assetPath || typeof assetPath !== "string") return false;
    const relativePath = assetPath.replace(/^\//, "");
    return fs.existsSync(path.join(__dirname, relativePath));
  });

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------
  eleventyConfig.addCollection("zoomzoom", function (collectionApi) {
    return collectionApi.getFilteredByTag("zoomzoom").reverse();
  });

  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi.getFilteredByTag("blog").reverse();
  });

  // ---------------------------------------------------------------------------
  // SCSS compilation via the `sass` npm package
  // ---------------------------------------------------------------------------
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      // Skip Sass partials (files whose name starts with _)
      const parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }

      return async () => {
        const result = sass.compileString(inputContent, {
          loadPaths: [
            parsed.dir,
          ],
        });
        return result.css;
      };
    },
  });

  // ---------------------------------------------------------------------------
  // Eleventy config
  // ---------------------------------------------------------------------------
  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      output: "_eleventy-output",
    },
    templateFormats: ["html", "md", "njk", "scss", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
