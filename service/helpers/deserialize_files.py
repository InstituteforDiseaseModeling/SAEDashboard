import pickle
import os
import geojson

# Directory where .shp.pickle files are located
shapefiles = "/Users/dkong-x/source/SAEDashboard-bmgf/service/data/shapefiles/Africa"

for file in os.listdir(shapefiles):
    if file.endswith('.shp.pickle'):
        filename = os.path.join(shapefiles, file)
        name = file.strip('.shp.pickle')
        geojson_file = os.path.join(shapefiles, name + '.json')
        shp_file = pickle.load(open(str(filename), 'rb'))

        # Write files as readable json files in same directory
        with open(geojson_file, 'w') as f:
            geojson.dump(shp_file, f)