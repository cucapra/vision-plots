#!/usr/bin/env python3

import sys
import csv
from collections import OrderedDict

SPECIAL_CONFIGS = ['orig.', 'demos+g.c.', '+denoise', 'all off']


def make_table(instream, outstream):
    reader = csv.DictReader(instream)
    table = OrderedDict()
    for row in reader:
        index = row['special']
        if index:
            app = row['app']
            error = row['error_norm']
            if app in table:
                table_row = table[app]
            else:
                table_row = table[app] = OrderedDict()
            table_row[index] = error

    writer = csv.DictWriter(outstream, ['app'] + SPECIAL_CONFIGS)
    writer.writeheader()
    for app, errors in table.items():
        row = dict(errors)
        row['app'] = app
        writer.writerow(row)


if __name__ == '__main__':
    make_table(sys.stdin, sys.stdout)
