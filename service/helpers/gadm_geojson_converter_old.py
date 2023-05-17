import json
import os

# Folder where GADM geojson files are located
# input_folder = "C:/Users/emilycl/Projects/SAE/Shapefile_Pickling/GeoJson_Conversion/gadm_jsons"
input_folder = "./input/"
# Folder where converted geojson files should go
# output_folder = "C:/Users/emilycl/Projects/SAE/Shapefile_Pickling/GeoJson_Conversion/gadm_converted"
output_folder = "./data/shapefiles"

continent = "Africa"

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
        output_filename = f"{country}__l{level+1}__1.json"
        with open(os.path.join(output_folder, output_filename), "w") as outfile:
            json.dump(new_json, outfile)
