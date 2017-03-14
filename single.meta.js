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
          "sort": "false",

          // Label each plot with the app. It is ugly to use the x-axis title
          // for this, but: https://github.com/vega/vega-lite/issues/431
          "title": $.app,

          "scale": {
            "bandSize": 10,

            // In the skip/only plots, use "pipeline order" for the stages.
            "domain": ($.category === "skip" || $.category === "only") ? [
              "denoise", "demosaic", "transform", "gamut map", "gamma comp."
            ] : undefined,
          },
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
            // Format as floating-point numbers.
            "format": "f",

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
          "sort": "none",
        },
        "y": { "field": "error" },
        "color": { "value": '#c33' },
        "text": { "field": "mark" },
      },
      "config": {
        "mark": {
          "fontSize": 25,
          "dx": 1,
        },
      },

      // Only include the non-baselines.
      "transform": {
        "filter": [
          "datum.name !== 'V0' && datum.name !== 'V1'",
        ],
      },
    },
  ],

  "transform": {
    // Include only values belonging to the category and the current app.
    "filter": "!!datum." + $.category + " && datum.app === '" + $.app + "'",
  },
}
