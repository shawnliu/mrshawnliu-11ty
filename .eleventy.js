const sass = require("sass");
const path = require("path");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // ---------------------------------------------------------------------------
  // Passthrough copies
  // ---------------------------------------------------------------------------
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");

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
    templateFormats: ["html", "md", "njk", "scss"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
