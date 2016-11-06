final.csv: data/Final_Results.csv flatten.py
	python3 flatten.py $< $@
