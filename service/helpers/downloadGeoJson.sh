#! /bin/bash
mkdir -p ./data/shapefiles

# download shape files from GADM.org
curl https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_SEN_1.json.zip -o ./sen_geoJson1.zip
curl https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_SEN_2.json.zip -o ./sen_geoJson2.zip
unzip sen_geoJson1.zip -d out1
unzip sen_geoJson2.zip -d out2
rm -rf input
mkdir input
mv -f out1/* input || rm out1
mv -f out2/* input || rm out2

# convert geoJSON to format usable by SAEDashboard
python helpers/gadm_geojson_converter.py -i ./input/ -o ./data/shapefiles


