{
  "data": { "url": "final.csv" },
  "mark": $.bars ? "bar" : "point",
  "encoding": {
    "x": $.bars ? {
      "field": $.byapp ? $.category : "app", "type": "nominal",
      "axis": false,
      "scale": {"bandSize": 6},
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
      "type": "nominal",
      "legend": {
        "title": $.byapp ? $.category : "Application",
      },
    },

    // In bar plots, lay out the groups of bars.
    "column": $.bars ? {
      "field": $.byapp ? "app" : $.category,
      "type": "nominal",
      "scale": {"padding": 4},
      "axis": {
        "orient": "bottom",
        "labelMaxLength": $.byapp ? 6 : undefined,
        "title": $.byapp ? undefined : {
          "skip": "skipped stage",
          "only": "included stage",
          "special": "",
        }[$.category],
      },
    } : undefined,
  },

  // Configure the layout of the bar groups (if we're using bars).
  "config": $.bars ? {
    "facet": {"cell": {"strokeWidth": 0}}
  } : undefined,

  // Include only values belonging to the category.
  "transform": { "filter": "!!datum." + $.category },
}
