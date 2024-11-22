import json
import os
from service.helpers.controller_helpers import ControllerException
from fastapi import APIRouter

router = APIRouter()


@router.get("/health_clinics/")
async def get_health_clinics():
    """
     Example 1: /health_clinics
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

    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file = os.path.join(current_dir, '..', 'data', 'health_clinics.json')
        with open(file, 'r') as f:
            health_clinics = json.load(f)
        return health_clinics
    except ControllerException as e:
        return str(e), 400
