.DELETE_ON_ERROR:

PLOTS := error-only error-skip error-special

.PHONY: svg pdf
svg: $(PLOTS:%=%.svg)
pdf: $(PLOTS:%=%.pdf)
vl: $(PLOTS:%=%.vl.json)

final.csv: data/Final_Results.csv flatten.py
	python3 flatten.py $< $@

early.csv: data/Final_Results.csv flatten.py
	python3 flatten.py $< $@

%.svg: %.vl.json final.csv
	vl2svg < $< > $@

# Plot variants.
error-%.vl.json: error.vl.json
	json -e 'this.encoding.x.field = "$*"' \
		-e 'this.transform = {"filter": "!!datum.$*"}' \
		< $< > $@

# A little bit of Perl hacking to simplify the CSS in the SVGs produced by
# Vega-Lite. rsvg-convert doesn't seem to support the `font` attribute, but it
# does work with a separate `font-family` attribute. We can fix that!
FIX_SVG := ( \
	perl -pe 's/font: bold ([^\s]*) ([^;]*);/font-weight: bold; font-size: \1; font-family: \2;/g' | \
	perl -pe 's/font: ([^\s]*) ([^;]*);/font-size: \1; font-family: \2;/g' \
	)

%.pdf: %.svg
	$(FIX_SVG) < $< | rsvg-convert -f pdf > $@
