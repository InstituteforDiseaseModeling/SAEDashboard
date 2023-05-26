import pickle
import json
import os

# Folder where json files are located
folder = "/Users/dkong-x/source/SAEDashboard-bmgf/service/data/shapefiles/Africa"

for file in os.listdir(folder):
    if file.endswith('.json'):
        name = file.strip(".json")
        pickled_file = os.path.join(folder, name + ".shp.pickle")

        with open(os.path.join(folder, file)) as json_file:
            data = json.load(json_file)

        # Write json data to .shp.pickle files
        with open(pickled_file, 'wb') as f:
            pickle.dump(data, file=f)

