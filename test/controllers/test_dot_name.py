import pytest
from test.base_api_test import BaseApiTest

from service.helpers.dot_name import DotName


class TestDotName(BaseApiTest):
    """
    Tests the DotName class
    """
    def valid_dot_name_strings_test(self):
        """
        Checks that DotName can be instantiated from various strings
        """
        DotName(dot_name_str='Africa')
        DotName(dot_name_str='Africa:Kenya')
        DotName(dot_name_str='Africa:Kenya:some_province')
        DotName(dot_name_str='Africa:Kenya:some__other--province')
        DotName(dot_name_str='A:F:R:I:C:A:K:E:N:Y:A')
        DotName(dot_name_str='Earth:Mars:Belt')

    def country_property_test(self):
        """
        Checks that DotName country is assigned to DotName.country
        """
        dot_name_str = 'Africa'
        dot_name = DotName(dot_name_str=dot_name_str)
        assert dot_name.country is None

        dot_name_str = 'Africa:Kenya'
        dot_name = DotName(dot_name_str=dot_name_str)
        assert 'Kenya' == dot_name.country

        dot_name_str = 'Africa:Kenya:SomePlace'
        dot_name = DotName(dot_name_str=dot_name_str)
        assert 'Kenya' == dot_name.country

    def continent_property_test(self):
        """
        Checks that DotName continent is assigned to DotName.continent
        """
        dot_name_str = 'Africa'
        dot_name = DotName(dot_name_str=dot_name_str)
        assert 'Africa' == dot_name.continent

        dot_name_str = 'Africa:Kenya'
        dot_name = DotName(dot_name_str=dot_name_str)
        assert 'Africa' == dot_name.continent

    def admin_level_property_test(self):
        """
        Checks that DotName admin level is assigned to dot_name.admin_level
        """
        dot_name_str = 'Africa'
        dot_name = DotName(dot_name_str=dot_name_str)
        assert 0 == dot_name.admin_level

        dot_name_str = 'Africa:Kenya:SomePlace'
        dot_name = DotName(dot_name_str=dot_name_str)
        assert 2 == dot_name.admin_level

    def equality_test(self):
        """
        Tests equality between DotName objects
        """
        assert DotName(dot_name_str='Africa') == DotName(dot_name_str='Africa')
        assert DotName(dot_name_str='Africa:Kenya') == DotName(dot_name_str='Africa:Kenya')

        assert DotName(dot_name_str='Africa:Kenya') != DotName(dot_name_str='Africa:Nigeria')
        assert DotName(dot_name_str='Africa:Kenya') != DotName(dot_name_str='Africa:Kenya:SomePlace')

    # reversible dot name pairs for testing the two ancestor/descendant methods
    ANCESTOR_TRUE = 1
    DESCENDANT_TRUE = -1
    NONE_TRUE = None
    ancestor_descendant_pairs = {
        ('Africa', 'Africa'): {'relationship': NONE_TRUE, 'distance': 0},
        ('Africa', 'Africa:Mali'): {'relationship': ANCESTOR_TRUE, 'distance': -1},

        # descendant test covers flipped order cases, but including one such test, just in case
        ('Africa', 'Africa:Mali:Gao'): {'relationship': ANCESTOR_TRUE, 'distance': -2},
        ('Africa:Mali:Gao', 'Africa'): {'relationship': DESCENDANT_TRUE, 'distance': 2},

        ('Africa:Mali', 'Africa:Mali:Gao:A:B:C:D'): {'relationship': ANCESTOR_TRUE, 'distance': -5},
        ('Africa:Mali', 'Africa:Senegal'): {'relationship': NONE_TRUE, 'distance': None},
        ('Africa:Mali:Gao', 'Africa:Senegal:Gao'): {'relationship': NONE_TRUE, 'distance': None},
        ('Africa:Mali', 'Africa:Senegal:Dakar'): {'relationship': NONE_TRUE, 'distance': None},
        ('Africa:Mali', 'Europe:Italy'): {'relationship': NONE_TRUE, 'distance': None}
    }

    def is_ancestor_and_is_descendant_test(self):
        """
        Tests DotName.is_ancestor() and DotName.is_descendant()
        """
        for dn_str_pair, expected in self.ancestor_descendant_pairs.items():
            expected = expected['relationship']
            dn1 = DotName(dot_name_str=dn_str_pair[0])
            dn2 = DotName(dot_name_str=dn_str_pair[1])
            if expected is self.ANCESTOR_TRUE:
                assert dn1.is_ancestor(dn=dn2)
                assert not dn1.is_descendant(dn=dn2)
            elif expected is self.DESCENDANT_TRUE:
                assert not dn1.is_ancestor(dn=dn2)
                assert dn1.is_descendant(dn=dn2)
            elif expected is self.NONE_TRUE:
                assert not dn1.is_ancestor(dn=dn2)
                assert not dn1.is_descendant(dn=dn2)
            else:
                raise Exception('Unknown expected result case: %s' % expected)

    def generational_distance_test(self):
        """
        Checks DotName.generational_distance attribute
        """
        for dn_str_pair, expected in self.ancestor_descendant_pairs.items():
            expected = expected['distance']
            dn1 = DotName(dot_name_str=dn_str_pair[0])
            dn2 = DotName(dot_name_str=dn_str_pair[1])
            assert expected == dn1.generational_distance(dn=dn2)

    def from_parts_test(self):
        """
        Checks instantiating DotName with from_parts()
        """
        dn = DotName.from_parts(parts=['Africa'])
        assert 0 == dn.admin_level
        assert 'Africa' == dn.continent
        assert dn.country is None

        dn = DotName.from_parts(parts=['Africa', 'Senegal', 'Dakar'])
        assert 2 == dn.admin_level
        assert 'Africa' == dn.continent
        assert 'Senegal' == dn.country


@pytest.mark.sfpet
class TestDotNameSFPET(TestDotName):
    """
    Test suite for SFPET Dashboard
    """
    def test_valid_dot_name_strings(self):
        super().valid_dot_name_strings_test()

    def test_country_property(self):
        super().country_property_test()

    def test_continent_property(self):
        super().continent_property_test()

    def test_admin_level_property(self):
        super().admin_level_property_test()

    def test_equality(self):
        super().equality_test()

    def test_is_ancestor_and_is_descendant(self):
        super().is_ancestor_and_is_descendant_test()

    def test_generational_distance(self):
        super().generational_distance_test()

    def test_from_parts(self):
        super().from_parts_test()


@pytest.mark.sstiet
class TestDotNameSSTIET(TestDotName):
    """
    Test suite for SSTIET Dashboard
    """
    def test_valid_dot_name_strings(self):
        super().valid_dot_name_strings_test()

    def test_country_property(self):
        super().country_property_test()

    def test_continent_property(self):
        super().continent_property_test()

    def test_admin_level_property(self):
        super().admin_level_property_test()

    def test_equality(self):
        super().equality_test()

    def test_is_ancestor_and_is_descendant(self):
        super().is_ancestor_and_is_descendant_test()

    def test_generational_distance(self):
        super().generational_distance_test()

    def test_from_parts(self):
        super().from_parts_test()


@pytest.mark.serii
class TestDotNameSERII(TestDotName):
    """
    Test suite for SERII Dashboard
    """
    def test_valid_dot_name_strings(self):
        super().valid_dot_name_strings_test()

    def test_country_property(self):
        super().country_property_test()

    def test_continent_property(self):
        super().continent_property_test()

    def test_admin_level_property(self):
        super().admin_level_property_test()

    def test_equality(self):
        super().equality_test()

    def test_is_ancestor_and_is_descendant(self):
        super().is_ancestor_and_is_descendant_test()

    def test_generational_distance(self):
        super().generational_distance_test()

    def test_from_parts(self):
        super().from_parts_test()


@pytest.mark.seunri
class TestDotNameSEUNRI(TestDotName):
    """
    Test suite for SEUNRI Dashboard
    """
    def test_valid_dot_name_strings(self):
        super().valid_dot_name_strings_test()

    def test_country_property(self):
        super().country_property_test()

    def test_continent_property(self):
        super().continent_property_test()

    @pytest.mark.skip("Test isn't generalized for this dashboard")
    def test_admin_level_property(self):
        super().admin_level_property_test()

    def test_equality(self):
        super().equality_test()

    @pytest.mark.skip("Test isn't generalized for this dashboard")
    def test_is_ancestor_and_is_descendant(self):
        super().is_ancestor_and_is_descendant_test()

    def test_from_parts(self):
        super().from_parts_test()

    @pytest.mark.skip("Test isn't generalized for this dashboard")
    def test_generational_distance(self):
        super().generational_distance_test()


@pytest.mark.kenya
class TestDotNameKenya(TestDotName):
    """
    Test suite for SEVP Kenya  Dashboard
    """
    def test_valid_dot_name_strings(self):
        super().valid_dot_name_strings_test()

    def test_country_property(self):
        super().country_property_test()

    def test_continent_property(self):
        super().continent_property_test()

    def test_admin_level_property(self):
        super().admin_level_property_test()

    def test_equality(self):
        super().equality_test()

    def test_from_parts(self):
        super().from_parts_test()

    def test_is_ancestor_and_is_descendant(self):
        super().is_ancestor_and_is_descendant_test()

    @pytest.mark.skip("Values out of bounds are hardcoded")
    def test_generational_distance(self):
        super().generational_distance_test()
