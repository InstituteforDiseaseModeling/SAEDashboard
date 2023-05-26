from test.base_api_test import BaseApiTest
import pytest

sfpet_indicators = [{"id": "modern_method", "text": "Modern Method"},
                    {"id": "traditional_method", "text": "Traditional Method"},
                    {"id": "unmet_need", "text": "Unmet Need"}]

sstiet_indicators = [{"id": 'ALL_STD', "text": 'All STD'},
                     {"id": 'Discharge', "text": 'Discharge'},
                     {"id": 'Sore_Ulcer', "text": 'Sore Ulcer'}]

kenya_indicators = [{'id': 'RFK4', 'text': 'Rfk4'}]

serii_indicators = [{'id': 'dpt1', 'text': 'Dpt1'},
                    {'id': 'dpt2', 'text': 'Dpt2'},
                    {'id': 'dpt3', 'text': 'Dpt3'},
                    {'id': 'mcv1', 'text': 'Mcv1'}]

seunri_indicators = [{"id": 'NoU5', "text": 'No children under 5 (NoU5)'},
                     {"id": 'Parity0', "text": 'No children (Parity0)'},
                     {"id": 'UnVx', "text": 'Majority of children under 5 unvaccinated (UnVx)'},
                     {"id": 'Vx', "text": 'Majority of children vaccinated (Vx)'},
                     {"id": 'unmet_need_limit', "text": 'Unmet need for limiting'},
                     {"id": 'unmet_need_space', "text": 'Unmet need for spacing'}]


@pytest.mark.api
class TestIndicators(BaseApiTest):
    def indicators_nodata_test(self):
        res = self.app.get("/indicators?dot_name=Africa:Fake")
        assert res.json['indicators'] == []

    def indicators_test(self, indicators, state_dotname):
        res = self.app.get(f"/indicators?dot_name=Africa:{state_dotname}")
        for indicator in indicators:
            assert indicator in res.json['indicators']


@pytest.mark.sfpet
class TestIndicatorsSFPET(TestIndicators):

    def test_indicators_nodata(self):
        super().indicators_nodata_test()

    @pytest.mark.parametrize("indicators,state_dotname", [(sfpet_indicators, "Benin:Borgou")])
    def test_indicators(self, indicators, state_dotname):
        super().indicators_test(indicators, state_dotname)


@pytest.mark.sstiet
class TestIndicatorsSSTIET(TestIndicators):

    def test_indicators_nodata(self):
        super().indicators_nodata_test()

    @pytest.mark.parametrize("indicators,state_dotname", [(sstiet_indicators, "Benin:Borgou")])
    def test_indicators(self, indicators, state_dotname):
        super().indicators_test(indicators, state_dotname)


@pytest.mark.kenya
class TestIndicatorsKenya(TestIndicators):
    def test_indicators_nodata(self):
        super().indicators_nodata_test()

    @pytest.mark.parametrize("indicators, state_dotname", [(kenya_indicators, "Kenya:Wajir")])
    def test_indicators(self, indicators, state_dotname):
        super().indicators_test(indicators, state_dotname)


@pytest.mark.serii
class TestIndicatorsSERII(TestIndicators):
    def test_indicators_nodata(self):
        super().indicators_nodata_test()

    @pytest.mark.parametrize("indicators, state_dotname", [(serii_indicators, "Benin:Borgou")])
    def test_indicators(self, indicators, state_dotname):
        super().indicators_test(indicators, state_dotname)


@pytest.mark.seunri
class TestIndicatorsSEUNRI(TestIndicators):
    def test_indicators_nodata(self):
        super().indicators_nodata_test()

    @pytest.mark.parametrize("indicators, state_dotname", [(seunri_indicators, "Benin:Borgou")])
    def test_indicators(self, indicators, state_dotname):
        super().indicators_test(indicators, state_dotname)
