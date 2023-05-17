from test.base_api_test import BaseApiTest
import pytest


@pytest.mark.sstiet
@pytest.mark.sfpet
@pytest.mark.kenya
@pytest.mark.serii
@pytest.mark.seunri
class TestAfricaMap(BaseApiTest):
    """
    Tests the /africa_map API call
    """
    def test_africa_map(self):
        """
        Checks for features given an /africa_map call
        """
        res = self.app.get("/africa_map")
        assert len(res.json['Africa']['features']) > 1, "no features found for /africa_map"
