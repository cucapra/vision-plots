{
  "data": { "url": "final.csv" },
  "mark": $.bars ? "bar" : "point",
  "encoding": {
    "x": $.bars ? {"field": "app", "type": "nominal", "axis": false}
          : {"field": $.category, "type": "nominal"},
    "y": {"field": $.norm ? "error_norm" : "error", "type": "quantitative"},
    "color": {"field": "app", "type": "nominal"},
    "column": $.bars ? {
      "field": $.category, "type": "nominal",
      "scale": {"padding": 4},
      "axis": {"orient": "bottom"},
    } : undefined,
  },

  "config": $.bars ? {
    "facet": {"cell": {"strokeWidth": 0}}
  } : undefined,

  // Include only values belonging to the category.
  "transform": { "filter": "!!datum." + $.category },
}
