{
  "data": { "url": "final.csv" },
  "layers": [
    // Main "bars" layer.
    {
      "mark": "bar",
      "encoding": {
        "x": {
          "field": $.category, "type": "nominal",
          "scale": {"bandSize": 10},

          // Label each plot with the app. It is ugly to use the x-axis title
          // for this, but: https://github.com/vega/vega-lite/issues/431
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

      // Exclude the baseline and full reverse bars: we represent these with
      // lines instead.
      "transform": {
        "filter": "datum.name !== 'V0' && datum.name !== 'V1'",
      },
    },

    // Heavy rule at the baseline.
    {
      "mark": "rule",
      "config": {"mark": {"color": "#000"}},
      "encoding": {
        "y": {"field": "error"},
      },
      "transform": {
        // Filter to include *only* the baseline data ("V0").
        "filter": "datum.name === 'V0'",
      },
    },

    // Dashed rule at the "full reverse" (pseudo-worst-case) line.
    {
      "mark": "rule",
      "config": {"mark": {"strokeDash": [2, 2], "color": "#000"}},
      "encoding": {
        "y": {"field": "error"},
      },
      "transform": {
        // Filter to include only the full-reverse data ("V1").
        "filter": "datum.name === 'V1'",
      },
    },
  ],

  // Include only values belonging to the category and the current app.
  "transform": {
    "filter": "!!datum." + $.category + " && datum.app === '" + $.app + "'",
  },
}
