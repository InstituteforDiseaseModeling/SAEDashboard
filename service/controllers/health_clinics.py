import json
import os

from flask_restful import Resource
from rse_api.decorators import schema_out, register_resource


@register_resource(['/health_centers'])
class HealthCenters(Resource):
    def get(self):
        """
        Example 1: /health_centers
        return:
            {
                "Senegal": {
                    "Health Center A": {
                        "lat": 14.716677,
                        "long": -17.467686
                    },
                    "Health Center B": {
                        "lat": 15.6142,
                        "long": -16.2287
                    }
                }
            }
        """
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file = os.path.join(current_dir, '..', 'data', 'health_clinics.json')
        with open(file, 'r') as f:
            health_centers = json.load(f)
        return health_centers

