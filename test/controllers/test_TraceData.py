from test.base_api_test import BaseApiTest
import pytest


class TestTraceData(BaseApiTest):
    @pytest.mark.sfpet
    def test_timeseries(self):
        res = self.app.get("/timeseries?dot_name=Africa:Benin:Donga&channel=modern_method&subgroup=15-24_rural")
        print(res.json)
        self.check_timeseries(res.json, "Benin", "Africa:Benin:Donga", "modern_method", "15-24_rural")

    def check_timeseries(self, actual, dotname_prefix, dotname, channel, subgroup, version=1):
        resultdf = self.get_df_from_files(dotname_prefix, dotname, channel, subgroup, version)
        for i in actual:
            for col in self.mappedCols.values():
                if col != "year":
                    value = resultdf[resultdf.year == i["year"]][col].values[0]
                    assert abs(value - i[col]) < 5, f"expected: {value} actual:{i[col]}"
