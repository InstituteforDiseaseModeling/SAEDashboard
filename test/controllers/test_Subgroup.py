from test.base_api_test import BaseApiTest
import pytest

sfpet_subgroups = [{'id': '15-24', 'text': 'Women 15-24'},
                   {'id': '25plus', 'text': 'Women 25+'},
                   {'id': '15-24_rural', 'text': 'Women 15-24, Rural'},
                   {'id': '15-24_urban', 'text': 'Women 15-24, Urban'},
                   {'id': '25plus_rural', 'text': 'Women 25+, Rural'},
                   {'id': '25plus_urban', 'text': 'Women 25+, Urban'},
                   {'id': 'all', 'text': 'All Women'}]

sstiet_subgroups = [{"id": '15-24_rural', "text": 'Women 15-24, Rural'},
                    {"id": '15-24_urban', "text": 'Women 15-24, Urban'},
                    {"id": '25plus_rural', "text": 'Women 25+, Rural'},
                    {"id": '25plus_urban', "text": 'Women 25+, Urban'},
                    {"id": 'all', "text": 'All Women'}]

kenya_subgroups = [{"id": "all", "text": "All Women"}]

serii_subgroups = [{"id": "children", "text": "Children"}]

seunri_subgroups = [{"id": 'all', "text": 'All Women'},
                    {"id": 'rural', "text": 'Rural'},
                    {"id": 'urban', "text": 'Urban'}]


@pytest.mark.api
class TestSubgroup(BaseApiTest):
    """
    Test suite for the /subgroups API call
    """
    def subgroups_nodata_test(self):
        """
        Checks that an incorrect country name will not yield subgroups
        """
        res = self.app.get("/subgroups?dot_name=Africa:Fake")
        assert res.json['subgroups'] == []

    def subgroups_test(self, subgroups, state_dotname):
        """
        Checks that a call to /subgroups yields correct subgroups
        """
        res = self.app.get(f"/subgroups?dot_name=Africa:{state_dotname}")
        for test_group in subgroups:
            assert test_group in res.json['subgroups']


@pytest.mark.sfpet
class TestSubgroupSFPET(TestSubgroup):
    """
    Subgroups test suite for the SFPET dashboard
    """

    def test_subgroups_nodata(self):
        super().subgroups_nodata_test()

    @pytest.mark.parametrize("subgroups,state_dotname", [(sfpet_subgroups, "Benin:Borgou")])
    def test_subgroups(self, subgroups, state_dotname):
        self.subgroups_test(subgroups, state_dotname)


@pytest.mark.sstiet
class TestSubgroupSSTIET(TestSubgroup):
    """
    Subgroups test suite for the SSTIET dashboard
    """

    def test_subgroups_nodata(self):
        super().subgroups_nodata_test()

    @pytest.mark.parametrize("subgroups,state_dotname", [(sstiet_subgroups, "Benin:Borgou")])
    def test_subgroups(self, subgroups, state_dotname):
        self.subgroups_test(subgroups, state_dotname)


@pytest.mark.kenya
class TestSubgroupKenya(TestSubgroup):
    """
    Subgroups test suite for the SVEP Kenya dashboard
    """

    def test_subgroups_nodata(self):
        super().subgroups_nodata_test()

    @pytest.mark.parametrize("subgroups,state_dotname", [(kenya_subgroups, "Kenya:Wajir")])
    def test_subgroups(self, subgroups, state_dotname):
        self.subgroups_test(subgroups, state_dotname)


@pytest.mark.serii
class TestSubgroupSERII(TestSubgroup):
    """
    Subgroups test suite for the SERII dashboard
    """
    def test_subgroups_nodata(self):
        super().subgroups_nodata_test()

    @pytest.mark.parametrize("subgroups,state_dotname", [(serii_subgroups, "Benin:Borgou")])
    def test_subgroups(self, subgroups, state_dotname):
        self.subgroups_test(subgroups, state_dotname)


@pytest.mark.seunri
class TestSubgroupSEUNRI(TestSubgroup):
    """
    Subgroups test suite for the SEUNRI dashboard
    """
    def test_subgroups_nodata(self):
        super().subgroups_nodata_test()

    @pytest.mark.parametrize("subgroups,state_dotname", [(seunri_subgroups, "Benin:Borgou")])
    def test_subgroups(self, subgroups, state_dotname):
        self.subgroups_test(subgroups, state_dotname)
