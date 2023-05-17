from flask import request
from flask_restful import Resource
from rse_api.decorators import schema_out, register_resource

from service.helpers.controller_helpers import ControllerException, read_dot_names, get_channels, \
    read_admin_level, read_use_descendant_dot_names
from service.helpers.dot_name import DotName
from service.schemas.IndicatorsSchema import IndicatorsSchema


@register_resource(['/indicators'])
class Indicators(Resource):
    @schema_out(IndicatorsSchema(), many=True, detect_many=False)
    def get(self):
        """
        Example 1: /indicators?dot_name=Africa:Benin:Borgou
        return:
            {
                'indicators': [
                     {"id": 'traditional_method', "text":"Traditional Method"},
                     ...
                 ]
            }

        Example 2:
        /indicators?dot_name=Africa:Benin   (no data at this level, no exact dot-name matching)
        indicators =
            "indicators": [
                { "id": "modern_method", "text": "Modern Method" },
                ...
            ]
        :return: indicators
        """
        try:
            # handle get arguments
            dot_names = read_dot_names(request=request)
            if len(dot_names) > 1:
                raise ControllerException('indicators can only be requested for one dot_name at a time.')
            dot_name = DotName(dot_name_str=dot_names[0])
            use_descendant_dot_names = read_use_descendant_dot_names(request=request)
            requested_admin_level = read_admin_level(request=request, required=False)
            if requested_admin_level is not None:
                if requested_admin_level < dot_name.admin_level:
                    raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')

            # # TODO: no version check here
            indicators = sorted(get_channels(dot_name=dot_name, use_descendent_dot_names=use_descendant_dot_names,
                                             admin_level=requested_admin_level))
            return [{'channel': indicator} for indicator in indicators]

        except ControllerException as e:
            return str(e), 400
