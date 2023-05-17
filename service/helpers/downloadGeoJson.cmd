mkdir .\data\shapefiles

REM download shape files from GADM.org
curl -o .\sen_geoJson1.zip https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_SEN_1.json.zip
curl -o .\sen_geoJson2.zip https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_SEN_2.json.zip
mkdir out1
mkdir out2
tar -xf sen_geoJson1.zip -C out1
tar -xf sen_geoJson2.zip -C out2
mkdir input
move out1\* input || rmdir /s /q out1
move out2\* input || rmdir /s /q out2

REM convert geoJSON to format usable by SAEDashboard
mkdir ..\data\shapefiles
python gadm_geojson_converter.py -i ./input -o ..\data\shapefiles