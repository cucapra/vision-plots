{
  "data": { "url": "final.csv" },
  "mark": "point",
  "encoding": {
    "x": {"field": $.category, "type": "nominal"},
    "y": {"field": $.norm ? "error_norm" : "error", "type": "quantitative"},
    "color": {"field": "app", "type": "nominal"}
  },

  // Include only values belonging to the category.
  "transform": { "filter": "!!datum." + $.category },
}
