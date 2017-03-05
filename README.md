Visualization for the Cameras-for-Vision Project
================================================

This is a set of scripts for visualizing the data from the experiments in the cameras-for-vision project. We use [Vega-Lite](https://vega.github.io/vega-lite/) to draw plots.

To produce plots, first install the dependencies using [npm](https://www.npmjs.com):

    $ npm install -g vega-lite
    $ npm install -g metajson

Then, you can produce a *lot* of SVG files by typing `make`. Or, to get PDF versions, make sure you have [librsvg](https://developer.gnome.org/rsvg/stable/)'s `rsvg-convert` and then run `make pdf`.

There are also two HTML files here that let you view the visualizations interactively. For example, you can hover over bars to get exact numbers.


Hacking
-------

The Vega-Lite source for the plots is in `error.meta.js` and `single.meta.js`. These are both MetaJSON files with a few different parameters that can be used to generate a bunch of similar but slightly different plots. See the Makefile for how to translate these into complete Vega-Lite JSON source programs.
