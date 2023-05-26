import fnmatch
import os
import pandas as pd
from service.app import application
from pathlib import Path


class BaseApiTest():
    @classmethod
    def setup_class(self):
        # ensure we are in development mode
        if os.environ.get('FLASK_ENV', '') != 'testing':
            raise ValueError("Ensure development mode is enabled during testing")
        self.app = application.test_client()
        self.datadir = os.environ.get('DATA_DIR', Path(__file__).parent.parent.joinpath("service/data/data"))
        self.shapedir = os.environ.get('SHAPE_DIR', Path(__file__).parent.parent.joinpath("service/data/shapefiles"))
        self.mappedCols = {"year": "year",
                           "pred": "middle",
                           "pred_upper": "upper_bound",
                           "pred_lower": "lower_bound"}
        self.all_countries = [
            'Benin', 'Burkina_Faso', 'Burundi', 'Cameroon', 'Cote_dlvoire',
            'DRC', 'Ghana', 'Guinea', 'Kenya', 'Lesotho', 'Liberia', 'Madagascar',
            'Malawi', 'Namibia', 'Nigeria', 'Rwanda', 'Senegal', 'Tanzania', 'Togo',
            'Zambia', 'Zimbabwe', 'Mali', 'Uganda'
        ]

    def get_df_from_files(self, dotname_prefix, dotname, channel, subgroup, version=1):
        filenamePattern = f"{dotname_prefix}__{channel}__{subgroup}*__{version}.csv"
        f = [file for file in os.listdir(self.datadir) if fnmatch.fnmatch(file, filenamePattern)]
        if len(f) != 1:
            raise Exception(f"ambiguous files found, expected pattern: {filenamePattern}")
        sourcedf = pd.read_csv(os.path.join(self.datadir, f[0]))
        querystring = f"state=='{dotname}'"
        resultdf = sourcedf.query(querystring)[self.mappedCols.keys()]
        resultdf = resultdf.rename(columns=self.mappedCols)
        return resultdf
