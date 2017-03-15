// Domain for benchmark axes.
$.benchmarks =  [
  'LeNet3', 'ResNet20', 'ResNet44', 'RCNN', 'OpenFace', 'Farneback',
  'SGBM', 'OpenMVG',
],

// The main plot.
{
  "height": 150,

  "data": { "url": "final.csv" },
  "mark": $.bars ? "bar" : "point",
  "encoding": {
    "x": $.bars ? {
      "field": $.byapp ? $.category : "app", "type": "nominal",
      "sort": "none",
      "axis": false,
      "scale": {
        "bandSize": 6,

        // Benchmark order.
        "domain": $.byapp ? undefined : $.benchmarks,
      },
    } : {"field": $.byapp ? "app" : $.category, "type": "nominal"},

    "y": {
      "field": $.norm ? "error_norm" : "error",
      "type": "quantitative",
      "axis": {
        "title": $.norm ? "normalized error" : "error",
      },
    },

    "color": {
      "field": $.byapp ? $.category : "app",
      "sort": "none",
      "type": "nominal",
      "legend": {
        "title": $.byapp ? $.category : "Application",
      },
      "scale": {
        // Benchmark order.
        "domain": $.byapp ? undefined : $.benchmarks,
      },
    },

    // In bar plots, lay out the groups of bars.
    "column": $.bars ? {
      "field": $.byapp ? "app" : $.category,
      "type": "nominal",
      "axis": {
        "orient": "bottom",
        "labelMaxLength": $.byapp ? 6 : undefined,
        "title": $.byapp ? undefined : {
          "skip": "skipped stage",
          "only": "included stage",
          "special": "",
          "demos_raw": "demosaicing strategy",
          "demos_tm": "demosaicing strategy",
        }[$.category],
      },
      "sort": "none",

      "scale": {
        "padding": 4,

        // In the "special pipelines" config, fix an order.
        "domain": $.category == "special" ? [
          "orig.", "demos+g.c.", "+denoise", "all off"
        ] : undefined,
      },
    } : undefined,
  },

  // Configure the layout of the bar groups (if we're using bars).
  "config": $.bars ? {
    "facet": {"cell": {"strokeWidth": 0}}
  } : undefined,

  "transform": {
    "filter": [
      // Include only values belonging to the category.
      "!!datum." + $.category,

      // When showing normalized plots, don't show the normalization point.
      // (Only enabled for demosiacing plots for now.)
      ($.category === "demos_raw" || $.category === "demos_tm") ?
        ($.norm ? "datum.name !== 'V0'" : "true")
        : "true",
    ],
  },
}
