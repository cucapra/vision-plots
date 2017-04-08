#!/usr/bin/env python3

import sys
import csv
from collections import OrderedDict

CONFIGS = {
    'special': ['orig.', 'demos+g.c.', '+denoise', 'all off'],
    'quant_lin': ['8', '7', '6', '5', '4', '3', '2', '1'],
    'quant_log': ['8', '7', '6', '5', '4', '3', '2', '1'],
}


def make_table(instream, outstream, mode):
    reader = csv.DictReader(instream)
    table = OrderedDict()
    for row in reader:
        index = row[mode]
        if index:
            app = row['app']
            error = row['error_norm']
            if app in table:
                table_row = table[app]
            else:
                table_row = table[app] = OrderedDict()
            if error or index not in table_row:
                table_row[index] = error
            print(app, index, error)

    writer = csv.DictWriter(outstream, ['app'] + CONFIGS[mode])
    writer.writeheader()
    for app, errors in table.items():
        row = dict(errors)
        row['app'] = app
        writer.writerow(row)


if __name__ == '__main__':
    make_table(sys.stdin, sys.stdout, sys.argv[1])
