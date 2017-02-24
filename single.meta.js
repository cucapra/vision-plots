{
  "data": { "url": "final.csv" },
  "mark": "bar",
  "encoding": {
    "x": {
      "field": $.category, "type": "nominal",
      "scale": {"bandSize": 10},

      // Label each plot with the app. It is ugly to use the x-axis title for
      // this, but: https://github.com/vega/vega-lite/issues/431
      "title": $.app,
    },
    "y": {
      "field": "error", "type": "quantitative",

      // A hack! We add the vertical axis title only on the left-most plot,
      // which is the LeNet3 app.
      "title": $.app === "LeNet3" ? "error" : "",
    },
    "color": {"field": $.category, "type": "nominal", "legend": false},
  },

  // Include only values belonging to the category and the current app.
  "transform": {
    "filter": "!!datum." + $.category + " && datum.app === '" + $.app + "'",
  },
}
