
from flask import request
from flask_restful import Resource
from rse_api.decorators import register_resource, schema_out

from service.helpers.controller_helpers import get_child_dot_names, read_dot_names, ControllerException
from service.helpers.dot_name import DotName
from service.schemas.DotnamesSchema import DotnamesSchema


@register_resource(['/dot_names'])
class DotNames(Resource):
    @schema_out(DotnamesSchema())
    def get(self):
        """
        Example 1: /dot_names?dot_name=Africa
        return:
            {
                "dot_names": [
                    { "id": "Africa:Benin", "text": "Benin" },
                    { "id": "Africa:Burkina_Faso", "text": "Burkina_faso" },
                ...
            }

        Example 2:
        /dot_names?dot_name=Africa:Benin
        return:
            {
                "dot_names": [
                    { "id": "Africa:Benin:Alibori", "text": "Alibori" },
                    { "id": "Africa:Benin:Atakora", "text": "Atakora" },
                    ...
                ]
            }

        Example 3:
        /dot_names?dot_name=Africa:Benin:Borgou    (no lower-level data)
        return: {'dot_names': []}

        :return: available dot names
        """
        try:
            # handle get arguments
            dot_names = read_dot_names(request=request)
            if len(dot_names) > 1:
                raise ControllerException('child dot_names can only be requested for one parent dot_name at a time.')
            dot_name = DotName(dot_name_str=dot_names[0])

            dot_names = sorted([str(dn) for dn in get_child_dot_names(parent_dot_name=dot_name)])
            return [{'dot_name': dot_name} for dot_name in dot_names]

        except ControllerException as e:
            return str(e), 400
