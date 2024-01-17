from marshmallow import post_dump, Schema, fields

LABELS = {
    "all": "all_ages",
    "25plus_rural": "Women 25+, Rural",
    "25plus_urban": "Women 25+, Urban",
    "15-24_urban": "Women 15-24, Urban",
    "15-24_rural": "Women 15-24, Rural",
    "15-24": "Women 15-24",
    "25plus": "Women 25+",
    "15-24_Parity-0": "Women 15-24, Parity 0",
    "15-24_Parity-1plus": "Women 15-24, Parity 1+",
    "25plus_Parity-0": "Women 25+, Parity 0",
    "25plus_Parity-1": "Women 25+, Parity 1",
    "25plus_Parity-1plus": "Women 25+, Parity 1+",
    "Parity-0": "Parity 0",
    "Parity-1plus": "Parity 1+",
    'all-1': 'All-1',
    'all-NA': 'All-NA',
    'rural': 'Rural',
    'urban': 'Urban'
}


def generate_label(indicator):
    # if we have a specific display name known, use it
    subgroup_name = indicator['subgroup']
    label = LABELS.get(subgroup_name, None)
    if label is None:
        # generate a display name according to a standard set of rules
        label = " ".join(p.capitalize() for p in subgroup_name.split('_'))
    return label


class SubgroupsSchema(Schema):
    subgroup = fields.Str(data_key="id")
    label = fields.Function(generate_label, data_key="text")

    @post_dump(pass_many=True)
    def wrap_with_envelope(self, data, many, **kwargs):
        return {"subgroups": data}
