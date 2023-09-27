# import os
# import pandas as pd
# from flask_restful import Resource
# from rse_api.decorators import register_resource
# from service.helpers.controller_helpers import DataFileKeys, ControllerException


# @register_resource(['/events'])
# class HealthCenters(Resource):
#     def get(self):
#         """
#         Example 1: /events
#         return:
#             [
#                 {
#                     "event": "Grand Magal de Touba 2020",
#                     "start_date": "2020-10-05",
#                     "end_date": "2020-10-06"
#                 },
#                 {
#                     "event": "Grand Magal de Touba 2021",
#                     "start_date": "2021-09-25",
#                     "end_date": "2021-09-26"
#                 },
#                 {
#                     "event": "Grand Magal de Touba 2022",
#                     "start_date": "2022-09-14",
#                     "end_date": "2022-09-15"
#                 }
#             ]
#         """
#         try:
#             current_dir = os.path.dirname(os.path.abspath(__file__))
#             file = os.path.join(current_dir, '..', 'data', 'events.csv')
#             df = pd.read_csv(file)

#             data = {}
#             for index, row in df.iterrows():
#                 data[row['event']] = {
#                     'event': row['event'],
#                     'start_date': row['start_date'],
#                     'end_date': row['end_date'],
#                 }

#             return list(data.values())

#         except ControllerException as e:
#             return str(e), 400