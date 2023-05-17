from collections import defaultdict

from flask import request
from flask_restful import Resource

from rse_api.decorators import register_resource
from service.helpers.controller_helpers import read_dot_names, ControllerException, DotName, \
    read_admin_level, read_version, read_upfill, get_all_countries_for_shapes, get_shapes


@register_resource(['/shapes'])
class ShapeData(Resource):
    # @schema_out(MapOutSchema())
    def get(self):
        """
        Example: /shapes?dot_name=Africa:Benin&admin_level=2
        :return: Returns GeoJSON shape objects at the specified admin_level under the provided dot_name
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
        """
        try:
            # handle get arguments
            dot_names = read_dot_names(request=request)
            requested_admin_level = read_admin_level(request=request)
            upfill = read_upfill(request=request)
            # TODO: add version input as an option and use it below

            shapes_by_dot_name = defaultdict(lambda: {"type": "FeatureCollection", "features": []})

            for dot_name in dot_names:
                dot_name = DotName(dot_name_str=dot_name)
                if requested_admin_level < dot_name.admin_level:
                    raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')
                countries = [dot_name.country] if dot_name.country else get_all_countries_for_shapes()

                for country in countries:
                    admin_level = requested_admin_level
                    # TODO: shapefile version may differ from data
                    version = read_version(country=country, channel=None, subgroup=None, request=request)

                    dn = dot_name if dot_name.country else DotName.from_parts([dot_name.continent, country])
                    shapes = get_shapes(dot_name=dn, admin_level=admin_level, version=version)
                    while upfill and len(shapes['features']) == 0 and admin_level > dot_name.admin_level:
                        admin_level -= 1
                        shapes = get_shapes(dot_name=dn, admin_level=admin_level, version=version)

                    # Extend the features with whats coming from the shapes
                    shapes_by_dot_name[str(dot_name)]["features"].extend(shapes["features"])

            return shapes_by_dot_name
        except ControllerException as e:
            return str(e), 400
