{
  "data": { "url": "final.csv" },
  "mark": "bar",
  "encoding": {
    "x": {
      "field": $.category, "type": "nominal",
    },
    "y": {"field": "error", "type": "quantitative"},
    "color": {"field": $.category, "type": "nominal", "legend": false},
  },

  // Include only values belonging to the category and the current app.
  "transform": {
    "filter": "!!datum." + $.category + " && datum.app === '" + $.app + "'",
  },
}
