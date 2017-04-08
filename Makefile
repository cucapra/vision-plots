.DELETE_ON_ERROR:

PLOTS := error-only error-skip error-special \
	bars_error-only bars_error-skip bars_error-special \
	byapp_error-only byapp_error-skip byapp_error-special \
	error_norm-only error_norm-skip error_norm-special \
	bars_error_norm-only bars_error_norm-skip bars_error_norm-special \
	byapp_error_norm-only byapp_error_norm-skip byapp_error_norm-special \
	sweep-quant_lin sweep-quant_log sweep-quant_cdf \
	LeNet3-only ResNet20-only ResNet44-only Farneback-only SGBM-only \
	OpenMVG-only RCNN-only OpenFace-only \
	LeNet3-skip ResNet20-skip ResNet44-skip Farneback-skip SGBM-skip \
	OpenMVG-skip RCNN-skip OpenFace-skip \
	LeNet3-special ResNet20-special ResNet44-special Farneback-special \
	SGBM-special OpenMVG-special RCNN-special OpenFace-special \
	bars_error-demos_tm bars_error-demos_raw \
	bars_error_norm-demos_tm_all \
	bars_error_norm-demos_tm bars_error_norm-demos_raw

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
error-%.vl.json: error.meta.js
	metajson --category $* < $< > $@

bars_error-%.vl.json: error.meta.js
	metajson --category $* --bars < $< > $@

byapp_error-%.vl.json: error.meta.js
	metajson --category $* --bars --byapp < $< > $@

# Normalized plot variants.
error_norm-%.vl.json: error.meta.js
	metajson --category $* --norm < $< > $@

bars_error_norm-%.vl.json: error.meta.js
	metajson --category $* --norm --bars < $< > $@

byapp_error_norm-%.vl.json: error.meta.js
	metajson --category $* --norm --bars --byapp < $< > $@

# Single-app plots.
%-only.vl.json: single.meta.js
	metajson --category only --app $* < $< > $@

%-skip.vl.json: single.meta.js
	metajson --category skip --app $* < $< > $@

%-special.vl.json: single.meta.js
	metajson --category special --app $* < $< > $@

# Quantization sweeps.
sweep-%.vl.json: sweep.meta.js
	metajson --category $* --norm --max 4.0 < $< > $@

# Resolution sweep.
ressweep.vl.json: ressweep.meta.js
	metajson --category resolution --max 4.0 < $< > $@


# A little bit of Perl hacking to simplify the CSS in the SVGs produced by
# Vega-Lite. rsvg-convert doesn't seem to support the `font` attribute, but it
# does work with a separate `font-family` attribute. We can fix that!
FIX_SVG := ( \
	perl -pe 's/font: bold ([^\s]*) ([^;]*);/font-weight: bold; font-size: \1; font-family: \2;/g' | \
	perl -pe 's/font: ([^\s]*) ([^;]*);/font-size: \1; font-family: \2;/g' \
	)

%.pdf: %.svg
	$(FIX_SVG) < $< | rsvg-convert -f pdf > $@


# Some CSV tables for external plotting.
special.csv: final.csv
	python3 table.py < $^ > $@


# Deployment.

RSYNCARGS := --compress --recursive --checksum --itemize-changes \
	--delete -e ssh --perms --chmod=Du=rwx,Dgo=rx,Fu=rw,Fog=r \
	--exclude .git
DEST := courses:coursewww/capra.cs.cornell.edu/htdocs/public/vision-plots
deploy:
	rsync $(RSYNCARGS) ./ $(DEST)
