{
  "height": 150,

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

          // It would be nicer to derive this from the data. Hard-coded for
          // now.
          "title": {
            'LeNet3': 'top 1 error',
            'ResNet20': 'top 1 error',
            'ResNet44': 'top 1 error',
            'Farneback': 'mean error',
            'SGBM': 'mean error',
            'OpenMVG': 'average RMSE',
            'OpenFace': 'mean error',
            'RCNN': '1 - mAP',
          }[$.app],

          "axis": {
            // All our error metrics are proportions, so we format them as
            // percentages.
            "format": "%",

            // Looser spacing of y-axis numbers.
            "ticks": 8,
          }
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
      "config": {"mark": {"strokeDash": [5, 4], "color": "#000"}},
      "encoding": {
        "y": {"field": "error"},
      },
      "transform": {
        // Filter to include only the full-reverse data ("V1").
        "filter": "datum.name === 'V1'",
      },
    },

    // Text to label "crashed" runs.
    {
      "mark": "text",
      "encoding": {
        "x": {
          "field": $.category, "type": "nominal",
        },
        "y": { "value": 0.5 },
        "color": { "value": '#c33' },
        "text": {"value": "*"},
      },

      // Only show the crashed runs (and only for the non-baselines).
      "transform": {
        "filter": [
          "datum.name !== 'V0' && datum.name !== 'V1'",
          "!datum.error",  // No error value: crashed.
        ],
      },
    },
  ],

  // Include only values belonging to the category and the current app.
  "transform": {
    "filter": "!!datum." + $.category + " && datum.app === '" + $.app + "'",
  },
}
