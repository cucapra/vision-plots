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
      "axis": {
        // More side-by-side figure hacking: no title necessary on the
        // right-hand (logarithmic) plot.
        "title": $.category === "quant_log" ? "" : (
          $.norm ? "normalized error" : "error"
        ),
        "format": $.norm ? ".1f" : undefined,
      },
      "scale": $.norm ? {
        "domain": [0.0, $.max],  // Limit to maximum error.
        "clamp": true,
      } : undefined,
    },
    "color": {
      "field": "app", "type": "nominal",
      "sort": "false",

      // A bit of a hack: only show the legend on logarithmic plot (for better
      // pairing with the linear plot).
      "legend": $.category === "quant_lin" ? false : {
        "title": "Application",
      },

      "scale": {
        // Enforce a consistent domain so missing data does not cause
        // misaligned colors.
        "domain": [
          'LeNet3', 'ResNet20', 'ResNet44', 'RCNN', 'OpenFace', 'Farneback',
          'SGBM', 'OpenMVG',
        ],
      },
    },
  },

  "transform": { "filter": [
    // Include only values belonging to the category.
    "!!datum." + $.category,

    // HACK: Remove some selected out-of-range points to avoid drawing a line
    // across the top of the clamped plot.
    $.category === "quant_lin" ?
      // app == ResNet44 || ResNet20 implies quant_lin >= 3
      "((datum.app !== 'ResNet44' && datum.app !== 'ResNet20') || " +
        "datum.quant_lin >= 3)"
    : "true",
  ]},
}
