import csv
import sys
from collections import OrderedDict


# The names of all the applications (which must match CSV headers) mapped to
# *short* names for the apps to use in the plots.
APPS = OrderedDict([
    ["CIFAR-10, 3 Deep LeNet", "LeNet3"],
    ["CIFAR-10, 20 Deep Resnet", "ResNet20"],
    ["CIFAR-10, 44 Deep Resnet", "ResNet44"],
    ["Middlebury, Farneback optical flow", "Farneback"],
    ["Middlebury, Stereo SGBM", "SGBM"],
    ["Strecha MVS, OpenMVG", "OpenMVG"],
    ["VOC-2007, Faster RCNN", "RCNN"],
    ["LFW & CASIA, OpenFace", "OpenFace"],
])

# Names for describing each of the configurations. For each
# configuration id "Vx", there is a mapping from *plot kind* to the
# *name* for the configuration in that plot kind. Missing keys indicate
# that the configuration should not be included in a given plot kind.
# For example, V5 only enables the denoise component, so it is labeled
# "denoise" in the "only" plot. It is not included in the "skip" plot.
CONFIG_INFO = {
    "V0": {
        "only": "(original)",
        "skip": "(original)",
        "special": "(original)",
    },
    "V1": {
        "only": "(full reverse)",
        "skip": "(full reverse)",
        "special": "(full reverse)",
    },
    "V2": {
        "only": "tone map",
    },
    "V3": {
        "only": "gamut map",
    },
    "V4": {
        "only": "transform",
    },
    "V5": {
        "only": "denoise",
    },
    "V6": {
        "only": "demosaic",
        "quant_lin": "8",
    },
    "V7": {
        "skip": "tone map",
    },
    "V8": {
        "skip": "gamut map",
    },
    "V9": {
        "skip": "transform",
    },
    "V10": {
        "skip": "denoise",
    },
    "V11": {
        "skip": "demosaic",
    },
    "V12": {
        "special": "demosaic + denoise + tone map",
    },
    "V13": {
        "special": "demosaic + tone map",
        "quant_log": "8",
    },
    "V58": {
        "quant_lin": "7",
    },
    "V59": {
        "quant_lin": "6",
    },
    "V60": {
        "quant_lin": "5",
    },
    "V61": {
        "quant_lin": "4",
    },
    "V62": {
        "quant_lin": "3",
    },
    "V63": {
        "quant_lin": "2",
    },
    "V64": {
        "quant_lin": "1",
    },
    "V65": {
        "quant_log": "7",
    },
    "V66": {
        "quant_log": "6",
    },
    "V67": {
        "quant_log": "5",
    },
    "V68": {
        "quant_log": "4",
    },
    "V69": {
        "quant_log": "3",
    },
    "V70": {
        "quant_log": "2",
    },
    "V71": {
        "quant_log": "1",
    },
}

# Name of the configuration representing the normalization base.
NORM_BASE = "V0"


def all_runs(infn):
    """Given an input CSV in Mark's format, generate data tuples for
    every application in every configuration.
    """
    with open(infn) as f:
        # Check whether the CSV has a pre-header row. If it does, skip it.
        reader = csv.reader(f)
        first_row = next(reader)
        if sum(bool(s) for s in first_row) > 1:
            # No pre-header row. Begin at the top of the file. (Otherwise,
            # we've now correctly skipped the first row.)
            f.seek(0)

        # Use the new top row as keys for the rows' values.
        reader = csv.DictReader(f)

        for row in reader:
            name, stages, interp = row['Name'], row['Stages Used'], \
                row['Interpretation']
            if not stages:
                # Skip informational/header rows.
                continue
            for app in APPS:
                try:
                    score = float(row[app])
                except ValueError:
                    score = None
                yield name, stages, interp, APPS[app], score


def _union_all(iterables):
    """Return a set representing the union of all the contents of an
    iterable of iterables.
    """
    out = set()
    for iterable in iterables:
        out.update(iterable)
    return out


def flatten(infn, outfn):
    """Given a compact CSV, write a new CSV with one result per line.
    """
    # Find all the new keys from CONFIG_INFO.
    config_keys = list(_union_all(CONFIG_INFO.values()))

    # Load the data from the CSV file.
    run_data = list(all_runs(infn))

    # Get normalization baselines.
    norm_bases = {}
    for name, _, _, app, score in run_data:
        if name == NORM_BASE and score is not None:
            norm_bases[app] = score

    # Translate the data.
    with open(outfn, 'w') as f:
        # Get the set of keys for the columns.
        header = ['name', 'stages', 'interp', 'app', 'error', 'error_norm']
        header += config_keys

        # Write the header row.
        writer = csv.DictWriter(f, header)
        writer.writeheader()

        # Write each data row.
        for name, stages, interp, app, score in run_data:
            score_norm = score / norm_bases[app] if score else None
            row = {
                'name': name,
                'stages': stages,
                'interp': interp,
                'app': app,
                'error': score,
                'error_norm': score_norm,
            }
            if name in CONFIG_INFO:
                row.update(CONFIG_INFO[name])
            writer.writerow(row)


if __name__ == '__main__':
    flatten(sys.argv[1], sys.argv[2])
