import csv
import sys


APPS = [
    "CIFAR-10, 3 Deep LeNet",
    "CIFAR-10, 20 Deep Resnet",
    "CIFAR-10, 44 Deep Resnet",
    "CIFAR-100, 20 Deep Resnet",
    "Middlebury, Farneback optical flow",
    "Middlebury, Stereo SGBM",
    "Strecha MVS, OpenMVG",
    "VOC-2007, Faster RCNN",
    "COCO, DeepMask",
    "LFW & CASIA, OpenFace",
]


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


def flatten(infn, outfn):
    """Given a compact CSV, write a new CSV with one result per line.
    """
    with open(outfn, 'w') as f:
        writer = csv.writer(f)
        writer.writerow(('name', 'stages', 'interp', 'app', 'score'))
        for name, stages, interp, app, score in all_runs(infn):
            writer.writerow((name, stages, interp, app, score))


if __name__ == '__main__':
    flatten(sys.argv[1], sys.argv[2])
