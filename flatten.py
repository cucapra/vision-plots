import csv
import sys


APPS = [
    "CIFAR-10, 3 Deep LeNet",
    "CIFAR-10, 20 Deep Resnet",
    "CIFAR-10, 44 Deep Resnet",
    "Middlebury, Farneback optical flow",
    "Middlebury, Stereo SGBM",
    "Strecha MVS, OpenMVG",
    "VOC-2007, Faster RCNN",
    "LFW & CASIA, OpenFace",
]

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
    },
}


def all_runs(infn):
    """Given an input CSV in Mark's format, generate data tuples for
    every application in every configuration.
    """
    with open(infn) as f:
        reader = csv.DictReader(f)

        for row in reader:
            name, stages, interp = row['Name'], row['Stages Used'], \
                row['Interpretation']
            if not stages:
                # Skip informational/header rows.
                continue
            for app in APPS:
                yield name, stages, interp, app, row[app]


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

    # Translate the data.
    with open(outfn, 'w') as f:
        # Get the set of keys for the columns.
        header = ['name', 'stages', 'interp', 'app', 'error']
        header += config_keys

        # Write the header row.
        writer = csv.DictWriter(f, header)
        writer.writeheader()

        # Write each data row.
        for name, stages, interp, app, score in all_runs(infn):
            row = {
                'name': name,
                'stages': stages,
                'interp': interp,
                'app': app,
                'error': score,
            }
            if name in CONFIG_INFO:
                row.update(CONFIG_INFO[name])
            writer.writerow(row)


if __name__ == '__main__':
    flatten(sys.argv[1], sys.argv[2])
