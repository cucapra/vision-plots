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
      "axis": {"title": $.norm ? "normalized error" : "error"},
    },
    "color": {
      "field": "app", "type": "nominal",
      "legend": {"title": "Application"},
    },
  },

  // Include only values belonging to the category.
  "transform": { "filter": "!!datum." + $.category },
}
