from test.base_api_test import BaseApiTest
from pathlib import Path
import pickle
import json
import pytest


@pytest.mark.api
class TestDotName(BaseApiTest):
    def get_region_ids(self):
        """
        Format of targeted API query is:
            "GET /timeseries?dot_name=Africa:Mali:Ségou&channel=modern_method&subgroup=15-24_urban HTTP/1.1"
        The goal of making a param file is to configure a matrix of possible values that can go into this GET
        request. Then, the tests comprehensively loop through all queries to make sure they return something
        """
        self.current_dir = Path.cwd()
        self.data_dir = (self.current_dir.parents[0] / "service" / "data" / "shapefiles").resolve()

        objects = []
        with (open((self.data_dir / "Africa.shp.pickle").resolve(), "rb")) as openfile:
            while True:
                try:
                    objects.append(pickle.load(openfile))
                except EOFError:
                    break

        with open("Africa.json", "w") as outfile:
            json.dump(objects[0], outfile)

        self.id_list = []
        for place_dict in objects[0]['Africa']['features']:
            dot_name_list = place_dict['id'].split(":")
            if dot_name_list[1] in self.all_countries:
                dot_name = ":".join(dot_name_list[:-1])
                self.id_list.append(dot_name)

    def shape_regions_timeseries_test(self, channel, subgroup, countries=None):
        """
        Checks that a /timeseries call to specific region yields expected result
        Args:

        """
        if countries is not None:
            self.all_countries = countries
        self.get_region_ids()
        checked_regions = set()
        for dot_name in self.id_list:
            if dot_name not in checked_regions:
                checked_regions.add(dot_name)
                print(f"Testing: {dot_name}")
                res = self.app.get(f"/timeseries?dot_name={dot_name}&channel={channel}&subgroup={subgroup}")
                assert len(res.json) > 0, f"API call to {dot_name} yields empty response"

    def dotname_test(self, countries=None):
        """
        Checks that regions match expected format
        """
        if countries is not None:
            self.all_countries = countries
        for country in self.all_countries:
            res = self.app.get(f"/dot_names?dot_name=Africa:{country}")
            assert len(res.json) > 0

    def map_test(self, channel, subgroup, countries=None):
        """
        Checks that /map call yields expected json
        """
        if countries is not None:
            self.all_countries = countries
        self.get_region_ids()
        for dot_name in self.id_list:
            res = self.app.get(f"/map?dot_name={dot_name}&channel={channel}&subgroup={subgroup}&year=2020&data=data&admin_level=2")
            assert len(res.json) > 0, f"Empty call to API for subgroup {subgroup} year 2020 admin level 2"
            assert 'value' in res.json[0]
            assert 0 <= res.json[0]['value'] <= 1

    def indicators_test(self, countries=None):
        """
        Checks that /indicators call yields indicators that match expected format
        """
        if countries is not None:
            self.all_countries = countries
        self.get_region_ids()
        for dot_name in self.id_list:
            res = self.app.get(f"/indicators?dot_name={dot_name}")
            indicators = res.json['indicators']
            for item in indicators:
                assert "_" not in item['text']
                assert item['text'].istitle()

    def dotname_continent_test(self):
        """
        Checks that /dot_names call with continent yields expected json
        """
        res = self.app.get("/dot_names?dot_name=Africa")
        result = [str(i['id']).split(":")[0] for i in res.json['dot_names']]
        assert result.count('Africa') == len(result), res.json

    def dotname_country_test(self, country=None):
        """
        Checks that /dot_names call with each country yields expected json
        """
        res = self.app.get(f"/dot_names?dot_name=Africa:{country}")
        result = [str(i['id']).split(":")[1] for i in res.json['dot_names']]
        assert result.count(country) == len(result), res.json

    def dotname_admin2_test(self, region_dotname):
        """
        Checks that /dot_names call with each region yields expected json
        """
        res = self.app.get(f"/dot_names?dot_name=Africa:{region_dotname}")
        result = [str(i['id']).split(":")[2] for i in res.json['dot_names']]
        assert result.count(region_dotname.split(":")[1]) == len(result), res.json

    def dotname_no_sublevel_test(self, sub_dotname):
        """
        Checks that /dot_names call with region sublevel does not show unexpected sublevels
        """
        res = self.app.get(f"/dot_names?dot_name=Africa:{sub_dotname}")
        assert res.json['dot_names'] == [], "if no sublevel, empty list should be returned."


@pytest.mark.sfpet
class TestDotNameSFPET(TestDotName):
    @pytest.mark.parametrize("channel, subgroup, countries", [("modern_method", "15-24_urban", None)])
    def test_shape_regions_timeseries(self, channel, subgroup, countries):
        super().shape_regions_timeseries_test(countries, channel, subgroup)

    def test_dotname(self):
        super().dotname_test()

    @pytest.mark.parametrize("channel, subgroup, countries", [("modern_method", "15-24_urban", None)])
    def test_map(self, channel, subgroup, countries):
        super().map_test(channel, subgroup, countries)

    @pytest.mark.parametrize("countries", [(None)])
    def test_indicators(self, countries):
        super().indicators_test(countries)

    def test_dotname_continent(self):
        super().dotname_continent_test()

    @pytest.mark.parametrize("country", [("Benin")])
    def test_dotname_country(self, country):
        super().dotname_country_test(country)

    @pytest.mark.parametrize("region_dotname", [("Benin:Borgou")])
    def test_dotname_admin2(self, region_dotname):
        super().dotname_admin2_test(region_dotname)

    @pytest.mark.parametrize("sub_dotname", [("Benin:Borgou:Nikki")])
    def test_dotname_no_sublevel(self, sub_dotname):
        super().dotname_no_sublevel_test(sub_dotname)


@pytest.mark.sstiet
class TestDotNameSSTIET(TestDotName):
    @pytest.mark.parametrize("channel, subgroup, countries", [("modern_method", "15-24_urban", None)])
    def test_shape_regions_timeseries(self, channel, subgroup, countries):
        super().shape_regions_timeseries_test(channel, subgroup, countries)

    @pytest.mark.skip("Needs to be tested")
    def test_map(self):
        pass

    @pytest.mark.skip("Assumptions of test don't apply to this dashboard")
    def test_indicators(self):
        pass

    def test_dotname(self):
        super().dotname_test()

    def test_dotname_continent(self):
        super().dotname_continent_test()

    @pytest.mark.parametrize("country", [("Benin")])
    def test_dotname_country(self, country):
        super().dotname_country_test(country)

    @pytest.mark.parametrize("region_dotname", [("Benin:Borgou")])
    def test_dotname_admin2(self, region_dotname):
        super().dotname_admin2_test(region_dotname)

    @pytest.mark.parametrize("sub_dotname", [("Benin:Borgou:Nikki")])
    def test_dotname_no_sublevel(self, sub_dotname):
        super().dotname_no_sublevel_test(sub_dotname)


@pytest.mark.serii
class TestDotNameSERII(TestDotName):
    @pytest.mark.parametrize("channel, subgroup, countries", [("DPT1", "children", None)])
    def test_shape_regions_timeseries(self, channel, subgroup, countries):
        super().shape_regions_timeseries_test(channel, subgroup, countries)

    @pytest.mark.skip("Needs to be tested")
    def test_map(self):
        pass

    def test_dotname(self):
        super().dotname_test()

    @pytest.mark.parametrize("countries", [(None)])
    def test_indicators(self, countries):
        super().indicators_test(countries)

    def test_dotname_continent(self):
        super().dotname_continent_test()

    @pytest.mark.parametrize("country", [("Benin")])
    def test_dotname_country(self, country):
        super().dotname_country_test(country)

    @pytest.mark.parametrize("region_dotname", [("Benin:Borgou")])
    def test_dotname_admin2(self, region_dotname):
        super().dotname_admin2_test(region_dotname)

    @pytest.mark.parametrize("sub_dotname", [("Benin:Borgou:Nikki")])
    def test_dotname_no_sublevel(self, sub_dotname):
        super().dotname_no_sublevel_test(sub_dotname)


@pytest.mark.seunri
class TestDotNameSEUNRI(TestDotName):
    @pytest.mark.parametrize("channel, subgroup, countries", [("NoU5", "rural", None)])
    def test_shape_regions_timeseries(self, channel, subgroup, countries):
        super().shape_regions_timeseries_test(countries, channel, subgroup)

    def test_dotname(self):
        super().dotname_test()

    @pytest.mark.parametrize("channel, subgroup, countries", [("NoU5", "rural", None)])
    def test_map(self, channel, subgroup, countries):
        super().map_test(channel, subgroup, countries)

    @pytest.mark.parametrize("countries", [(None)])
    @pytest.mark.skip("Doesn't have indicators that are titled")
    def test_indicators(self, countries):
        super().indicators_test(countries)

    def test_dotname_continent(self):
        super().dotname_continent_test()

    @pytest.mark.parametrize("country", [("Benin")])
    def test_dotname_country(self, country):
        super().dotname_country_test(country)

    @pytest.mark.parametrize("region_dotname", [("Benin:Borgou")])
    def test_dotname_admin2(self, region_dotname):
        super().dotname_admin2_test(region_dotname)

    @pytest.mark.parametrize("sub_dotname", [("Benin:Borgou:Nikki")])
    def test_dotname_no_sublevel(self, sub_dotname):
        super().dotname_no_sublevel_test(sub_dotname)


@pytest.mark.kenya
class TestDotNameKenya(TestDotName):
    @pytest.mark.parametrize("channel, subgroup, countries", [("RFK4", "all", ["Kenya"])])
    def test_shape_regions_timeseries(self, countries, channel, subgroup):
        super().shape_regions_timeseries_test(countries, channel, subgroup)

    @pytest.mark.parametrize("countries", [(["Kenya"])])
    def test_dotname(self, countries):
        super().dotname_test(countries)

    @pytest.mark.parametrize("countries, channel, subgroup", [("RFK4", "all", ["Kenya"])])
    def test_map(self, countries, channel, subgroup):
        super().map_test(channel, subgroup, countries)

    @pytest.mark.parametrize("countries", [(["Kenya"])])
    def test_indicators(self, countries):
        super().indicators_test(countries)

    def test_dotname_continent(self):
        super().dotname_continent_test()

    @pytest.mark.parametrize("country", [("Kenya")])
    def test_dotname_country(self, country):
        super().dotname_country_test(country)

    @pytest.mark.parametrize("region_dotname", [("Kenya:Wajir")])
    def test_dotname_admin2(self, region_dotname):
        super().dotname_admin2_test(region_dotname)

    @pytest.mark.parametrize("sub_dotname", [("Kenya:Wajir:Tarbaj")])
    def test_dotname_no_sublevel(self, sub_dotname):
        super().dotname_no_sublevel_test(sub_dotname)
