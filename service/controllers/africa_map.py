from service.helpers.controller_helpers import load_geojson_pickle
from fastapi import APIRouter

router = APIRouter()


@router.get("/africa_map/")
async def get_africa_map():
        """
        Example: /dot_names?dot_name=Africa
        return:
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
        :return: return the pre-generated africa shapes to improve performance
        """
        geojson = load_geojson_pickle("Africa.shp.pickle")
        return geojson
