Visualization for the Cameras-for-Vision Project
================================================

This is a set of scripts for visualizing the data from the experiments in the cameras-for-vision project. We use [Vega-Lite](https://vega.github.io/vega-lite/) to draw plots.

To produce plots, first install the dependencies using [Yarn](https://yarnpkg.com/en/). Just type:

    $ yarn

Then, you can produce a *lot* of SVG files by typing `make`. Or, to get PDF versions, make sure you have [librsvg](https://developer.gnome.org/rsvg/stable/)'s `rsvg-convert` and then run `make pdf`. You can try using `-j9` or something to parallelize the plot generation.

There are also two HTML files here that let you view the visualizations interactively. For example, you can hover over bars to get exact numbers.


Hacking
-------

The Vega-Lite source for the plots is in the files `*.meta.js`. These are [MetaJSON](https://github.com/sampsyo/metajson) files with a few different parameters that can be used to generate a bunch of similar but slightly different plots. See the Makefile for how to translate these into complete Vega-Lite JSON source programs.
