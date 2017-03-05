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
        "title": $.norm ? "normalized error" : "error",
        "format": $.norm ? ".1f" : undefined,
      },
      "scale": $.norm ? {
        "domain": [0.0, 4.0],  // More than 4x error not worth showing.
      } : undefined,
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
    $.norm ? "datum.error_norm < 6.0" : "true",
  ]},
}
