import argparse
import json
import os
import pickle
from pathlib import Path

def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument('-i', '--data-input', dest='input_folder', type=str, required=True,
                        help='Source directory containing data files. Expects a directory containing geojson files ('
                             'Required)')
    parser.add_argument('-o', '--data-output', dest='output_folder', type=str, required=True,
                        help='Directory to which converted .shp.pickle files are written (Required)')
    parser.add_argument('-c', '--continent', dest='continent', type=str,
                        default="Africa", help='Name of the continent in which the relevant country is located ('
                                               'Default: "Africa")')

    args = parser.parse_args()
    args.input_folder = Path(args.input_folder).absolute()
    args.output_folder = Path(args.output_folder).absolute()
    return args


def main(args):
    if not args.input_folder.exists():
        raise FileNotFoundError(f"Specified input folder: {args.input_folder} does not exist.")
    if not args.output_folder.exists():
        raise FileNotFoundError(f"Specified output folder: {args.output_folder} does not exist.")

    input_folder = args.input_folder
    output_folder = args.output_folder
    continent = args.continent

    for file in os.listdir(input_folder):
        new_json = {}
        level = int(file.split('_')[2].split('.')[0])
        with open(os.path.join(input_folder, file)) as json_file:
            data = json.load(json_file)
            for feature in data["features"]:
                country = feature["properties"]["COUNTRY"]
                feature_id = f"{continent}:{country}"
                if level == 1:
                    admin1 = feature["properties"]["NAME_1"]
                    feature_id = f"{continent}:{country}:{admin1}"
                if level == 2:
                    admin1 = feature["properties"]["NAME_1"]
                    admin2 = feature["properties"]["NAME_2"]
                    feature_id = f"{continent}:{country}:{admin1}:{admin2}"
                new_json[feature_id] = {
                    "type": feature["type"],
                    "id": feature_id,
                    "properties": {
                        "country": country,
                        "TYPE": level,
                        "id": feature_id,
                        "name": feature_id.split(":")[-1]
                    },
                    "geometry": feature["geometry"]
                }
            output_filename = f"{country}__l{level+1}__1.shp.pickle"
            with open(os.path.join(output_folder, output_filename), "wb") as outfile:
                pickle.dump(new_json, outfile)

if __name__ == '__main__':
    args = parse_args()
    main(args=args)
