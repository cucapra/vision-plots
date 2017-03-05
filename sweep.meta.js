{
  "data": { "url": "final.csv" },
  "mark": "line",
  "encoding": {
    "x": {"field": $.category, "type": "quantitative"},
    "y": {"field": $.norm ? "error_norm" : "error", "type": "quantitative"},
  },

  // Include only values belonging to the category.
  "transform": { "filter": "!!datum." + $.category },
}
