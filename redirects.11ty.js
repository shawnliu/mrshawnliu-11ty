// Old Jekyll URLs ended in .html (/about.html, /zoomzoom/2024/09/05/club-14.html).
// For every page at /x/, write a tiny page at /x.html that forwards to /x/.
// New postcard detail pages never had .html URLs, so they're skipped.
module.exports = class {
  data() { return {
  pagination: {
    data: "collections.all",
    size: 1,
    alias: "target",
    before: (items) =>
      items.filter(
        (p) =>
          p.url &&
          p.url !== "/" &&
          p.url.endsWith("/") &&
          !/^\/100-postcard-paintings\/./.test(p.url)
      ),
  },
  permalink: (data) => data.target.url.replace(/\/$/, "") + ".html",
  eleventyExcludeFromCollections: true,
  }; }

  render({ target }) {
  return `<!doctype html>
<meta charset="utf-8">
<title>Moved</title>
<link rel="canonical" href="${target.url}">
<meta http-equiv="refresh" content="0; url=${target.url}">
<p><a href="${target.url}">This page moved here.</a></p>
`;
  }
};
