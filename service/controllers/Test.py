from flask_restful import Resource
from rse_api.decorators import register_resource


@register_resource(['/'])
class MapGeoData(Resource):
    def get(self):
        return "Hello World!"
