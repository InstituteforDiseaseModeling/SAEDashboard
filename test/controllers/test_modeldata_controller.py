import json
import os

from service.helpers.dot_name import DotName
from test.base_api_test import BaseApiTest
import pytest


def sorting_lambda(item):
    return item['id']


@pytest.mark.api
class TestModelData(BaseApiTest):
    @staticmethod
    def create_args_string(args):
        sub_strings = []
        for key, values in args.items():
            value_string = ','.join(values) if isinstance(values, list) else values
            sub_strings.append('%s=%s' % (key, value_string))
        return '&'.join(sub_strings)

    @staticmethod
    def create_request(route, args):
        return '%s?%s' % (route, TestModelData.create_args_string(args))

    def years_test(self):
        """
        Checks the range of years in the timeseries plot
        """
        expected = {'years': {'id': 'Africa:Benin:Borgou', 'start_year': 1990, 'end_year': 2020}}

        route = 'years'
        args = {
            'dot_name': 'Africa:Benin:Borgou',
            'channel': 'unmet_need',
            'subgroup': 'all'
        }
        result = self.app.get(self.create_request(route, args), content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        assert abs(expected - data) < 0.01

    def timeseries_test(self):
        """
        Checks the model values in the timeseries plot
        """
        def year_sorting_lambda(x):
            return x['year']
        years = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
        lower_bound = [0.18560260070927054, 0.19002711737937455, 0.19480895856057054, 0.20016791095218914, 0.20621160484857665, 0.2132988213093524, 0.22240460950000332, 0.21630024788307747, 0.2128546321497053, 0.2114287874180038, 0.21214481542663627, 0.2155082136970269, 0.2083083412369796, 0.20344762004669856, 0.2001217490175839, 0.1980147881806244, 0.19692962255498567, 0.19682394078820856, 0.1977154467479017, 0.19972541584667286, 0.2030820016477085, 0.20837509546266256, 0.2178788940956507, 0.21083193983590176, 0.2084306978081751, 0.208613613293944, 0.2111553234822004, 0.21641124649739532, 0.2267248993242698, 0.2142902440546709, 0.2059718681401548]
        middle = [0.25256366063457464, 0.2526485649413288, 0.2528208453311233, 0.25308188938234044, 0.2534344837198268, 0.2538850521268364, 0.2543723155779333, 0.2524101060589099, 0.25049804621729016, 0.2486914678776313, 0.2469768344040889, 0.24493067172850505, 0.24456862804345336, 0.24388145885365284, 0.24327639333552706, 0.2427533180739001, 0.24231228173733535, 0.2419530572154209, 0.24167515081815566, 0.24147772321425534, 0.2413592778083356, 0.2413164485557411, 0.2415967587693277, 0.24248738350483914, 0.24369500833096155, 0.2449811807790942, 0.2463528636024925, 0.2478181466380884, 0.24962409980131944, 0.2492050036685459, 0.2491129584273569]
        upper_bound = [0.3343045765024401, 0.3281413083639469, 0.32179498930829564, 0.31517279886253224, 0.3080260223339081, 0.2999702211769854, 0.2896049201024101, 0.29287511850189896, 0.2927468432715987, 0.29028083336254223, 0.2854774014277441, 0.27690918857079355, 0.2845704626482758, 0.2888850700222543, 0.2915527104818432, 0.2929842124595849, 0.2932985364737587, 0.2925698866573905, 0.2907751593490415, 0.2877894561817685, 0.28334718697346983, 0.27692202853985914, 0.2668279934704941, 0.2766544764379494, 0.2822571343384848, 0.2849686602001599, 0.2850435613830249, 0.2820614435997141, 0.2740609939533624, 0.287818117826182, 0.29801775201784625]
        prediction = [{'year': int(years[i]), 'lower_bound': lower_bound[i], 'middle': middle[i], 'upper_bound': upper_bound[i]}
                      for i in range(len(lower_bound))]
        prediction = sorted(prediction, key=year_sorting_lambda)
        expected = prediction

        # merge the expected reference data into the prediction set of timeseries
        reference_data = [
            {"year": 1996, "reference_lower_bound": 0.23981374727242014, "reference_middle": 0.2604948722207692,
             "reference_upper_bound": 0.28117599716911834},
            {"year": 2001, "reference_lower_bound": 0.22454054040308905, "reference_middle": 0.2440743122097741,
             "reference_upper_bound": 0.2636080840164592},
            {"year": 2012, "reference_lower_bound": 0.22585032559621532, "reference_middle": 0.24001441022429484,
             "reference_upper_bound": 0.25417849485237437},
            {"year": 2018, "reference_lower_bound": 0.238198464534493, "reference_middle": 0.2511790758257739,
             "reference_upper_bound": 0.26415968711705484}]
        for ref_data in reference_data:
            for pred_data in expected:
                if ref_data['year'] == pred_data['year']:
                    pred_data.update(ref_data)
                    break

        route = 'timeseries'
        args = {
            'dot_name': 'Africa:Benin:Borgou',
            'channel': 'unmet_need',
            'subgroup': 'all'
        }
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        data = sorted(data, key=year_sorting_lambda)
        assert expected == data

    def map_test(self):
        """
        Checks the map values in the map plot
        """
        admin2 = 'Africa:Benin:Borgou'
        expected = self.get_df_from_files(dotname_prefix='Benin', dotname=admin2, channel='unmet_need', subgroup='all',
                                          version=1)
        route = 'map'
        args = {
            'dot_name': 'Africa:Benin',
            'admin_level': '2',
            'channel': 'unmet_need',
            'subgroup': 'all',
            'year': '2000',
            'data': 'data'
        }
        datatypes = {'data': 'middle', 'data_lower_bound': 'lower_bound', 'data_upper_bound': 'upper_bound'}
        for d in datatypes:
            args['data'] = d
            request = self.create_request(route, args)
            result = self.app.get(request, content_type='application/json')
            data = json.loads(result.data.decode('utf-8'))
            value = [i['value'] for i in data if i['id'] == admin2][0]
            expectedvalue = expected[expected.year == 2000][datatypes[d]].values[0]
            assert abs(value - expectedvalue) < 0.01

    def dotnames_test(self):
        route = 'dot_names'
        # continent level
        expected = {'dot_names': sorted(
            ['Africa:Mali', 'Africa:Burundi', 'Africa:Nigeria', 'Africa:Cameroon', 'Africa:Benin', 'Africa:Rwanda',
             'Africa:Burkina_Faso', 'Africa:Senegal', 'Africa:Niger', 'Africa:Ghana', 'Africa:Namibia', 'Africa:DRC',
             'Africa:Malawi', 'Africa:Cote_dIvoire', 'Africa:Lesotho', 'Africa:Liberia', 'Africa:Madagascar',
             'Africa:Ethiopia', 'Africa:Kenya', 'Africa:Guinea'])}
        args = {
            'dot_name': 'Africa'
        }
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        assert set(expected['dot_names']).issubset(set([i["id"] for i in data['dot_names']]))

        # country level
        expected = {"dot_names": sorted(
            ["Africa:Benin:Borgou", "Africa:Benin:Collines", "Africa:Benin:Donga", "Africa:Benin:Kouffo",
             "Africa:Benin:Littoral", "Africa:Benin:Mono", u"Africa:Benin:Ouémé", "Africa:Benin:Plateau",
             "Africa:Benin:Zou", "Africa:Benin:Alibori", "Africa:Benin:Atakora", "Africa:Benin:Atlantique"])}
        args = {
            'dot_name': 'Africa:Benin'
        }
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        assert sorted(expected['dot_names']) == sorted([i["id"] for i in data['dot_names']])

    '''
    Add shapes? tests
    - single dot_name
    - two dot_names
    - upfill=True (and returns no additional data)
    - upfill=True (and returns additional data)
    - continent-level request
    '''

    def shapes_test(self):
        """
        Checks the FeatureCollection of a sample of countries
        """
        # test above given dot_name
        route = 'shapes'
        args = {
            'dot_name': 'Africa:Benin:Collines',
            'admin_level': 1
        }
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        assert 400 == result.status_code

        # test at given dot_name
        expected = {"Africa:Benin:Collines": {"type": "FeatureCollection", "features": [
            {"type": "Feature", "id": "Africa:Benin:Collines",
             "properties": {"country": "benin", "TYPE": 2, "id": "Africa:Benin:Collines", "name": "Collines"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.28985906, 7.50524998], [2.00856805, 7.55127001], [1.91201103, 7.63768816],
                  [1.64199901, 7.63116312], [1.63023603, 8.58732033], [1.83638895, 8.61361217],
                  [2.16000104, 8.47583294], [2.21833301, 8.5124979], [2.1917491, 8.77678871], [2.72922397, 8.77042294],
                  [2.76183605, 8.50532818], [2.69565701, 8.32474709], [2.75410104, 8.21131229], [2.66843104, 7.889781],
                  [2.72946405, 7.79222298], [2.72628903, 7.65718794], [2.49749994, 7.6600008], [2.41934204, 7.44156218],
                  [2.28985906, 7.50524998]]]}}]}}
        args = {
            'dot_name': 'Africa:Benin:Collines',
            'admin_level': 2
        }
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        assert expected == data

        # test below given dot_name
        expected = {"Africa:Benin:Collines": {"type": "FeatureCollection", "features": [
            {"type": "Feature", "id": "Africa:Benin:Collines:Savalou",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Savalou", "name": "Savalou"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.13458204269415, 7.55629587173456], [2.00856804847729, 7.55127000808722],
                  [1.91201102733618, 7.63768815994268], [1.64199900627142, 7.63116312026983],
                  [1.63415002822882, 8.19340133666992], [1.8270059823991, 8.06210041046148],
                  [2.04353904724132, 8.0702657699585], [2.10787296295177, 8.1218633651734],
                  [2.11146903038031, 7.8902759552002], [2.03693699836731, 7.6754779815675],
                  [2.13458204269415, 7.55629587173456]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Sav\u00e8",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Sav\u00e8",
                            "name": "Sav\u00e8"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.37331700325024, 7.90681123733515], [2.33685302734381, 8.11242103576672],
                  [2.49686598777771, 8.13460063934338], [2.50351691246038, 8.29075241088873],
                  [2.69702506065374, 8.315094947815], [2.75410103797913, 8.21131229400635],
                  [2.66843104362493, 7.88978099822998], [2.72946405410761, 7.79222297668451],
                  [2.72628903388988, 7.6571879386903], [2.49765300750732, 7.65858316421509],
                  [2.37331700325024, 7.90681123733515]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Glazou\u00e9",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Glazou\u00e9",
                            "name": "Glazou\u00e9"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.10920405387884, 7.94455289840693], [2.11214804649353, 8.44165992736828],
                  [2.21617698669445, 8.5065736770631], [2.3420400619508, 8.40942764282232],
                  [2.32371997833263, 8.23923397064203], [2.37487602233881, 8.13879489898682],
                  [2.33685302734381, 8.11242103576672], [2.37922692298889, 7.92336177825939],
                  [2.21815299987793, 7.8302907943725], [2.10920405387884, 7.94455289840693]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Ou\u00e8ss\u00e8",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Ou\u00e8ss\u00e8",
                            "name": "Ou\u00e8ss\u00e8"},
             "geometry": {"type": "Polygon", "coordinates": [[
                 [2.74144005775452, 8.44869327545177], [2.69702506065374, 8.315094947815],
                 [2.50351691246038, 8.29075241088873], [2.49686598777771, 8.13460063934338],
                 [2.37487602233881, 8.13879489898682], [2.32371997833263, 8.23923397064203],
                 [2.3420400619508, 8.40942764282232], [2.20472192764294, 8.52666664123541],
                 [2.19000101089478, 8.77472400665295], [2.72922396659862, 8.77042293548578],
                 [2.74144005775452, 8.44869327545177]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Dassa-Zoum\u00e8",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Dassa-Zoum\u00e8",
                            "name": "Dassa-Zoum\u00e8"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.28985905647278, 7.50524997711187], [2.13458204269415, 7.55629587173456],
                  [2.03693699836731, 7.6754779815675], [2.10920405387884, 7.94455289840693],
                  [2.21815299987793, 7.8302907943725], [2.37331700325024, 7.90681123733515],
                  [2.46165394783026, 7.76562309265131], [2.4866669178009, 7.55583477020269],
                  [2.41934204101574, 7.44156217575085], [2.28985905647278, 7.50524997711187]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Bant\u00e8",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Bant\u00e8",
                            "name": "Bant\u00e8"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.12274599075329, 8.4773645401001], [2.10787296295177, 8.1218633651734],
                  [2.04353904724132, 8.0702657699585], [1.8270059823991, 8.06210041046148],
                  [1.63415002822882, 8.19340133666992], [1.630236029625, 8.58732032775885],
                  [1.83638894557959, 8.61361217498779], [2.12274599075329, 8.4773645401001]]]}}]}}
        args = {
            'dot_name': 'Africa:Benin:Collines',
            'admin_level': 3
        }
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        assert expected == data

    def continent_shapes_test(self):
        """
        Checks the features of Africa at admin level 2
        """
        route = 'shapes'

        # This is a big regression, moving expected value to file
        with open(os.path.join(os.path.dirname(__file__), 'test_continent_shapes_expected.json'), 'r') as f:
            expected = json.load(f)
        expected['Africa']['features'] = sorted(expected['Africa']['features'], key=sorting_lambda)
        args = {
            'dot_name': 'Africa',
            'admin_level': 2
        }
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        data['Africa']['features'] = sorted(data['Africa']['features'], key=sorting_lambda)
        self.maxDiff = None
        assert expected == data

    def shape_upfill_test(self):
        """
        Testing the upfill argument in API call
        """
        # test at given dot_name -- returns nothing different
        expected = {"Africa:Benin:Collines": {"type": "FeatureCollection", "features": [
            {"type": "Feature", "id": "Africa:Benin:Collines",
             "properties": {"country": "benin", "TYPE": 2, "id": "Africa:Benin:Collines", "name": "Collines"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.28985906, 7.50524998], [2.00856805, 7.55127001], [1.91201103, 7.63768816],
                  [1.64199901, 7.63116312], [1.63023603, 8.58732033], [1.83638895, 8.61361217],
                  [2.16000104, 8.47583294], [2.21833301, 8.5124979], [2.1917491, 8.77678871], [2.72922397, 8.77042294],
                  [2.76183605, 8.50532818], [2.69565701, 8.32474709], [2.75410104, 8.21131229], [2.66843104, 7.889781],
                  [2.72946405, 7.79222298], [2.72628903, 7.65718794], [2.49749994, 7.6600008], [2.41934204, 7.44156218],
                  [2.28985906, 7.50524998]]]}}]}}
        route = 'shapes'
        args = {
            'dot_name': 'Africa:Benin:Collines',
            'admin_level': 2,
            'upfill': True
        }
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        assert expected == data

        # testing at an unrealistic admin_level. Should return deepest available data.

        # First, show no data with upfill off
        expected = {"Africa:Benin:Collines": {"type": "FeatureCollection", "features": []}}
        args = {
            'dot_name': 'Africa:Benin:Collines',
            'admin_level': 10,
            'upfill': False
        }
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        assert expected == data

        # now turn upfill on
        expected = {"Africa:Benin:Collines": {"type": "FeatureCollection", "features": [
            {"type": "Feature", "id": "Africa:Benin:Collines:Savalou",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Savalou", "name": "Savalou"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.13458204269415, 7.55629587173456], [2.00856804847729, 7.55127000808722],
                  [1.91201102733618, 7.63768815994268], [1.64199900627142, 7.63116312026983],
                  [1.63415002822882, 8.19340133666992], [1.8270059823991, 8.06210041046148],
                  [2.04353904724132, 8.0702657699585], [2.10787296295177, 8.1218633651734],
                  [2.11146903038031, 7.8902759552002], [2.03693699836731, 7.6754779815675],
                  [2.13458204269415, 7.55629587173456]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Sav\u00e8",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Sav\u00e8",
                            "name": "Sav\u00e8"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.37331700325024, 7.90681123733515], [2.33685302734381, 8.11242103576672],
                  [2.49686598777771, 8.13460063934338], [2.50351691246038, 8.29075241088873],
                  [2.69702506065374, 8.315094947815], [2.75410103797913, 8.21131229400635],
                  [2.66843104362493, 7.88978099822998], [2.72946405410761, 7.79222297668451],
                  [2.72628903388988, 7.6571879386903], [2.49765300750732, 7.65858316421509],
                  [2.37331700325024, 7.90681123733515]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Glazou\u00e9",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Glazou\u00e9",
                            "name": "Glazou\u00e9"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.10920405387884, 7.94455289840693], [2.11214804649353, 8.44165992736828],
                  [2.21617698669445, 8.5065736770631], [2.3420400619508, 8.40942764282232],
                  [2.32371997833263, 8.23923397064203], [2.37487602233881, 8.13879489898682],
                  [2.33685302734381, 8.11242103576672], [2.37922692298889, 7.92336177825939],
                  [2.21815299987793, 7.8302907943725], [2.10920405387884, 7.94455289840693]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Ou\u00e8ss\u00e8",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Ou\u00e8ss\u00e8",
                            "name": "Ou\u00e8ss\u00e8"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.74144005775452, 8.44869327545177], [2.69702506065374, 8.315094947815],
                  [2.50351691246038, 8.29075241088873], [2.49686598777771, 8.13460063934338],
                  [2.37487602233881, 8.13879489898682], [2.32371997833263, 8.23923397064203],
                  [2.3420400619508, 8.40942764282232], [2.20472192764294, 8.52666664123541],
                  [2.19000101089478, 8.77472400665295], [2.72922396659862, 8.77042293548578],
                  [2.74144005775452, 8.44869327545177]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Dassa-Zoum\u00e8",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Dassa-Zoum\u00e8",
                            "name": "Dassa-Zoum\u00e8"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.28985905647278, 7.50524997711187], [2.13458204269415, 7.55629587173456],
                  [2.03693699836731, 7.6754779815675], [2.10920405387884, 7.94455289840693],
                  [2.21815299987793, 7.8302907943725], [2.37331700325024, 7.90681123733515],
                  [2.46165394783026, 7.76562309265131], [2.4866669178009, 7.55583477020269],
                  [2.41934204101574, 7.44156217575085], [2.28985905647278, 7.50524997711187]]]}},
            {"type": "Feature", "id": "Africa:Benin:Collines:Bant\u00e8",
             "properties": {"country": "benin", "TYPE": 3, "id": "Africa:Benin:Collines:Bant\u00e8",
                            "name": "Bant\u00e8"},
             "geometry": {"type": "Polygon", "coordinates": [
                 [[2.12274599075329, 8.4773645401001], [2.10787296295177, 8.1218633651734],
                  [2.04353904724132, 8.0702657699585], [1.8270059823991, 8.06210041046148],
                  [1.63415002822882, 8.19340133666992], [1.630236029625, 8.58732032775885],
                  [1.83638894557959, 8.61361217498779], [2.12274599075329, 8.4773645401001]]]}}]}}
        args['upfill'] = True
        request = self.create_request(route, args)
        result = self.app.get(request, content_type='application/json')
        data = json.loads(result.data.decode('utf-8'))
        assert expected == data

    def check_old_names_do_not_exist_in_data_test(self):
        """
        Checks the country names that have been homogenized in shape and data files
        """
        name_mapping = {
            'Burkina_Faso': ['Burkinafaso', 'BurkinaFaso', 'Burkina Faso'],
            'DRC': ['Democratic Republic of the Congo', 'Drc'],
            'Cote_dIvoire': ['Cotedivoire', "C╘TE D'IVOIRE", "CÔTE D'IVOIRE"],
            # There is currently no data for the following contries, just shape files
            # 'CAR': ['Central African Republic'],
            # 'Cape_Verde': ['Cape Verde'],
            # 'Equatorial_Guinea': ['EquatorialGuinea'],
            # 'Saint_Helena': ['SaintHelena'],
            # 'STaP': ['SaoTomeandPrincipe'],
            # 'Sierra_Leone': ['SierraLeone'],
            # 'South_Africa': ['SouthAfrica'],
            # 'South_Sudan': ['SouthSudan'],
        }

        # verify shapes do not exist for old names and that they do for the new/homogenized name.
        # verify that data does not exist for old names and does for new/homogenized names.
        for new_country_name, old_country_names in name_mapping.items():
            for old_country_name in old_country_names:
                old_country_dot_name = DotName.DOT_NAME_SEPARATOR.join(['Africa', old_country_name])

                # verify shapes do not exist for old country names
                route = 'shapes'
                args = {
                    'dot_name': old_country_dot_name,
                    'admin_level': 1
                }
                request = self.create_request(route, args)
                result = self.app.get(request, content_type='application/json')
                assert 400 == result.status_code

                # verify data files do not exist for old country names
                route = 'timeseries'
                args = {
                    'dot_name': old_country_dot_name,
                    'channel': 'unmet_need',
                    'subgroup': 'all'
                }
                request = self.create_request(route, args)
                result = self.app.get(request, content_type='application/json')
                assert 400 == result.status_code

            # TODO: when branch 15 is merged, make sure that all returned shapes in result are using the new country name
            # verify that shapes exist for the new country name
            new_country_dot_name = DotName.DOT_NAME_SEPARATOR.join(['Africa', new_country_name])

            route = 'shapes'
            args = {
                'dot_name': new_country_dot_name,
                'admin_level': 1
            }
            request = self.create_request(route, args)
            result = self.app.get(request, content_type='application/json')
            assert 200 == result.status_code

            # TODO: when branch 15 is merged, update new_country_dot_name to be a real, in-country dot_name and make sure that the returned data uses the new country name
            # verify that data exists for the new country name
            route = 'timeseries'
            args = {
                'dot_name': new_country_dot_name,
                'channel': 'unmet_need',
                'subgroup': 'all'
            }
            request = self.create_request(route, args)
            result = self.app.get(request, content_type='application/json')
            assert 200 == result.status_code


@pytest.mark.sfpet
class TestModelDataSFPET(TestModelData):
    """
    Model data tests for the SFPET dashboard
    """

    @pytest.mark.skip("Dependent on schema")
    def test_years(self):
        super().years_test()

    @pytest.mark.skip("Dependent on schema")
    def test_timeseries(self):
        super().timeseries_test()

    def test_map(self):
        super().map_test()

    def test_dotnames(self):
        super().dotnames_test()

    def test_shapes(self):
        super().shapes_test()

    def test_shape_upfill(self):
        super().shape_upfill_test()

    def test_check_old_names_do_not_exist_in_data(self):
        super().check_old_names_do_not_exist_in_data_test()


@pytest.mark.sstiet
class TestModelDataSSTIET(TestModelData):
    """
    Model data tests for the SSTIET dashboard
    """

    @pytest.mark.skip("Dependent on schema")
    def test_years(self):
        super().years_test()

    @pytest.mark.skip("Dependent on schema")
    def test_timeseries(self):
        super().timeseries_test()

    @pytest.mark.skip("NYI")
    def test_map(self):
        super().map_test()

    def test_dotnames(self):
        super().dotnames_test()

    def test_shapes(self):
        super().shapes_test()

    def test_shape_upfill(self):
        super().shape_upfill_test()

    @pytest.mark.skip("NYI")
    def test_check_old_names_do_not_exist_in_data(self):
        pass


@pytest.mark.serii
class TestModelDataSERII(TestModelData):
    """
    Model data tests for the SERII dashboard
    """

    @pytest.mark.skip("Dependent on schema")
    def test_years(self):
        super().years_test()

    @pytest.mark.skip("Dependent on schema")
    def test_timeseries(self):
        super().timeseries_test()

    def test_dotnames(self):
        super().dotnames_test()

    @pytest.mark.skip("NYI")
    def test_map(self):
        super().map_test()

    def test_shapes(self):
        super().shapes_test()

    def test_shape_upfill(self):
        super().shape_upfill_test()

    @pytest.mark.skip("NYI")
    def test_check_old_names_do_not_exist_in_data(self):
        pass


@pytest.mark.seunri
class TestModelDataSEUNRI(TestModelData):
    """
    Model data tests for the SEUNRI dashboard
    """

    @pytest.mark.skip("Dependent on schema")
    def test_years(self):
        super().years_test()

    @pytest.mark.skip("Dependent on schema")
    def test_timeseries(self):
        super().timeseries_test()

    def test_dotnames(self):
        super().dotnames_test()

    @pytest.mark.skip("NYI")
    def test_map(self):
        super().map_test()

    def test_shapes(self):
        super().shapes_test()

    def test_shape_upfill(self):
        super().shape_upfill_test()

    @pytest.mark.skip("NYI")
    def test_check_old_names_do_not_exist_in_data(self):
        pass
