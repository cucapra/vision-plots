{
  "data": { "url": "final.csv" },
  "mark": "line",
  "encoding": {
    "x": {
      "field": $.category, "type": "ordinal",
      "sort": "none",
    },
    "y": {
      "field": $.norm ? "error_norm" : "error",
      "type": "quantitative",
      "axis": {
        "title": $.norm ? "normalized error" : "error",
        "format": $.norm ? ".1f" : undefined,
      },
      "scale": $.norm ? {
        "domain": [0.0, $.max],  // Limit to maximum error.
      } : {
        "zero": false,
      },
    },
    "color": {
      "field": "app", "type": "nominal",
      "legend": {"title": "Application"},
    },
  },

  "transform": { "filter": [
    // Include only values belonging to the category.
    "!!datum." + $.category,

    // Keep marks in range (mostly).
    $.norm ? "datum.error_norm < " + $.max : "true",

    // Exclude a benchmark with incomplete data (for now?).
    "datum.app !== 'OpenMVG'",
  ]},
}
