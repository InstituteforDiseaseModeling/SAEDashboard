from flask import request
from flask_restful import Resource
from rse_api.decorators import register_resource, schema_out

from service.helpers.controller_helpers import get_subgroups, read_dot_names, ControllerException, \
    read_admin_level, read_use_descendant_dot_names
from service.helpers.dot_name import DotName
from service.schemas.SubgroupsSchema import SubgroupsSchema


@register_resource(['/subgroups'])
class Subgroups(Resource):
    @schema_out(SubgroupsSchema())
    def get(self):
        """
        Example:
        /subgroups?dot_name=Africa:Benin:Borgou
        return:
            {
                'subgroups': [
                  {"id":'15-24_urban', "text":"Women 15-24, Urban"},
                  {"id":'25plus_urban', "text":"Women 25+, Urban"},
                  ...
                ]
            }
        :return: subgroups
        """
        try:
            # handle get arguments
            dot_names = read_dot_names(request=request)
            if len(dot_names) > 1:
                raise ControllerException('subgroups can only be requested for one dot_name at a time.')
            dot_name = DotName(dot_name_str=dot_names[0])
            use_descendant_dot_names = read_use_descendant_dot_names(request=request)
            requested_admin_level = read_admin_level(request=request, required=False)
            if requested_admin_level is not None:
                if requested_admin_level < dot_name.admin_level:
                    raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')

            subgroups = sorted(get_subgroups(dot_name=dot_name, use_descendent_dot_names=use_descendant_dot_names,
                                             admin_level=requested_admin_level))
            return [{'subgroup': subgroup} for subgroup in subgroups]
        except ControllerException as e:
            return str(e), 400
