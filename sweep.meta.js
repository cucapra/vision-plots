{
  "data": { "url": "final.csv" },
  "mark": "line",
  "encoding": {
    "x": {
      "field": $.category, "type": "quantitative",
      "axis": {"title": "bits"},
    },
    "y": {
      "field": $.norm ? "error_norm" : "error",
      "type": "quantitative",
      "axis": {"title": $.norm ? "normalized error" : "error"},
    },
    "color": {
      "field": "app", "type": "nominal",
      "axis": {"title": "Application"},
    },
  },

  // Include only values belonging to the category.
  "transform": { "filter": "!!datum." + $.category },
}
