from test.base_api_test import BaseApiTest
import pytest


@pytest.mark.sstiet
@pytest.mark.sfpet
class TestShapeData(BaseApiTest):
    def test_shapes(self):
        res = self.app.get("/shapes?dot_name=Africa:Benin&admin_level=1")
        print(res.json)
        # todo: need more info for testing
