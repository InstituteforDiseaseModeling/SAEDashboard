from test.base_api_test import BaseApiTest
import pytest


class TestMapData(BaseApiTest):
    @pytest.mark.sstiet
    @pytest.mark.sfpet
    def test_map(self):
        res = self.app.get("/map?dot_name=Africa:Benin&channel=unmet_need&subgroup=15-24_urban")
        print(res.json)
        # todo: need more info for testing
