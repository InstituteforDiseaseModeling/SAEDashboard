### API
***********************
#### /africa_map
```
/africa_map
Example return:
{
    "Africa": {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": "Africa:Angola:Bié",
                "properties": {
                    "country": "angola",
                    "TYPE": 2,
                    "id": "Africa:Angola:Bié",
                    "name": "Bié"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                17.80353546,
                                -13.74234009
                            ],
                            ...
                        ]
                    ]
                }
            },
            ...
        ]
    }
}
```
**GET** API return Africa geojson data. Check /service/controller/AfricaMap.py for more details

#### /dot_names
```
/dot_names?dot_name=Africa
Example return:
{
    "dot_names": [
        { "id": "Africa:Benin", "text": "Benin" },
        { "id": "Africa:Burkina_Faso", "text": "Burkina_faso" },
    ...
}

/dot_names?dot_name=Africa:Benin
Example return:
{
    "dot_names": [
        { "id": "Africa:Benin:Alibori", "text": "Alibori" },
        { "id": "Africa:Benin:Atakora", "text": "Atakora" },
        ...
    ]
}
```

#### /indicators
```
/indicators?dot_name=Africa:Benin:Borgou
Example return:
{
    'indicators': [
         {"id": 'traditional_method', "text":"Traditional Method"},
         {"id": 'unmet_need', "text":"Unmet Need"},
         ...
     ]
}

/indicators?dot_name=Africa:Benin
Example return:
{
    "indicators": [
        { "id": "modern_method", "text": "Modern Method" },
        ...
    ]
}
```

#### /subgroups
```
/subgroups?dot_name=Africa:Benin:Borgou
Example return:
{
    'subgroups': [
      {"id":'15-24_urban', "text":"Women 15-24, Urban"},
      {"id":'25plus_urban', "text":"Women 25+, Urban"},
      ...
    ]
}
```

#### /shapes
```
/shapes?dot_name=Africa:Benin&admin_level=2
Example return:
{
    "Africa:Benin": {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": "Africa:Benin:Borgou",
                "properties": {
                    "country": "benin",
                    "TYPE": 2,
                    "id": "Africa:Benin:Borgou",
                    "name": "Borgou"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                2.1917491,
                                8.77678871
                            ],
                            ...
                        ]
                    ]
                }
            },
            ...
        ]
    }
}
```
**GET** API return geojson data by dot_name and admin level. Check /service/controller/ShapeData.py for more details

#### /timeseries
```
/timeseries?dot_name=Africa:Benin:Borgou&channel=traditional_method&subgroup=15-24_urban
Example return:
[
    {
        "year": 1990,
        "lower_bound": 0.018048064947315333,
        "middle": 0.08826664048800155,
        "upper_bound": 0.3399731764366215
    },
    ...
    {
        "year": 1996,
        "lower_bound": 0.047224601516542286,
        "middle": 0.08319512093600809,
        "upper_bound": 0.1394244789816742,
        "reference_lower_bound": 0.04796807558877803,
        "reference_middle": 0.07291666666666667,
        "reference_upper_bound": 0.09786525774455532
    },
    ...
]

```
**GET** API to return folder name in Data folder. Check /service/controller/data_sources.py for more details

#### /data_sources
```json
[
    "Age",
    "Original",
    "Parity",
    "Test"
]
```
**GET** API return time series related data, required dot_name, channel, and subgroup. Check /service/controller/TraceData.py for more details

#### /map
```
/map?dot_name=Africa:Benin&channel=unmet_need&subgroup=15-24_urban&year=2007&data=data
Example return:
{
    'Africa:Benin:Borgou': 0.1,
    'Africa:Benin:Collines': 0.2,
    ...
 }

/map?dot_name=Africa&channel=unmet_need&subgroup=15-24_urban&year=2007&data=data
Example return:
[
    {
        "id": "Africa:Ghana:Ashanti",
        "value": 0.13814665045808905
    },
    {
        "id": "Africa:Ghana:Brong Ahafo",
        "value": 0.1714535315401326
    },
    ...
]
```
**GET** API return map related data. Check /service/controller/MapData.py for more details