.DELETE_ON_ERROR:

.PHONY: svg pdf
svg: error.svg
pdf: error.pdf

final.csv: data/Final_Results.csv flatten.py
	python3 flatten.py $< $@

early.csv: data/Final_Results.csv flatten.py
	python3 flatten.py $< $@

error.svg: error.vl.json final.csv
	vl2svg < $< > $@

# A little bit of Perl hacking to simplify the CSS in the SVGs produced by
# Vega-Lite. rsvg-convert doesn't seem to support the `font` attribute, but it
# does work with a separate `font-family` attribute. We can fix that!
FIX_SVG := ( \
	perl -pe 's/font: bold ([^\s]*) ([^;]*);/font-weight: bold; font-size: \1; font-family: \2;/g' | \
	perl -pe 's/font: ([^\s]*) ([^;]*);/font-size: \1; font-family: \2;/g' \
	)

%.pdf: %.svg
	$(FIX_SVG) < $< | rsvg-convert -f pdf > $@
