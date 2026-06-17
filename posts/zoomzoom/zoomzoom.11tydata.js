// Directory data for Zoom Zoom Drawing Club posts
// Overrides the parent _posts/_posts.11tydata.js for this subdirectory.
// Permalink matches Jekyll's default: /zoomzoom/YYYY/MM/DD/slug/
module.exports = {
  tags: ["zoomzoom"],
  layout: "zoomzoom",
  permalink: function (data) {
    const d = data.page.date;
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `/zoomzoom/${year}/${month}/${day}/${data.page.fileSlug}/`;
  },
};
