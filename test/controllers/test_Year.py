import unittest
from test.base_api_test import BaseApiTest


@unittest.skip("year not in use currently")
class TestYear(BaseApiTest):
    def test_year_benin(self):
        res = self.app.get("/years?dot_name=Africa:Benin:Borgou&channel=unmet_need&subgroup=all")
        print(res.json)
        self.check_year(res.json, "Benin", "Africa:Benin:Borgou", "unmet_need", "all")

    def test_year_senegal(self):
        res = self.app.get("/years?dot_name=Africa:Senegal:Dakar&channel=modern_method&subgroup=all")
        print(res.json)
        self.check_year(res.json, "Senegal", "Africa:Senegal:Dakar", "modern_method", "ALL")

    def check_year(self, actual, dotname_prefix, dotname, channel, subgroup, version=1):
        resultdf = self.get_df_from_files(dotname_prefix, dotname, channel, subgroup, version)
        self.assertEqual(resultdf["year"].max(), actual['years']['end_year'])
        self.assertEqual(resultdf["year"].min(), actual['years']['start_year'])
