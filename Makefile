.DELETE_ON_ERROR:

.PHONY: svg
svg: bars.svg

final.csv: data/Final_Results.csv flatten.py
	python3 flatten.py $< $@

early.csv: data/Final_Results.csv flatten.py
	python3 flatten.py $< $@

bars.svg: bars.vl.json final.csv
	vl2svg < $^ > $@
