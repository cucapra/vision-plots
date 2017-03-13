{
  "data": { "url": "final.csv" },
  "mark": "line",
  "encoding": {
    "x": {
      "field": $.category, "type": "quantitative",
      "axis": {
        "title": "bits",
        "ticks": 8,  // Bits range: 1--8.
      },
      "sort": "descending",  // High to low.
      "scale": {
        "domain": [1,8],  // Bits range.
      },
    },
    "y": {
      "field": $.norm ? "error_norm" : "error",
      "type": "quantitative",
      "axis": {
        // More side-by-side figure hacking: no title necessary on the
        // right-hand (logarithmic) plot.
        "title": $.category === "quant_log" ? "" : (
          $.norm ? "normalized error" : "error"
        ),
        "format": $.norm ? ".1f" : undefined,
      },
      "scale": $.norm ? {
        "domain": [0.0, $.max],  // Limit to maximum error.
      } : undefined,
    },
    "color": {
      "field": "app", "type": "nominal",

      // A bit of a hack: only show the legend on logarithmic plot (for better
      // pairing with the linear plot).
      "legend": $.category === "quant_lin" ? false : {
        "title": "Application",
      },
    },
  },

  "transform": { "filter": [
    // Include only values belonging to the category.
    "!!datum." + $.category,

    // Keep marks in range (mostly).
    $.norm ? "datum.error_norm < " + $.max : "true",
  ]},
}
