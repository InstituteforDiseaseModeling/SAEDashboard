from marshmallow import post_dump, Schema, fields

LABELS = {
    "NoU5": "No children under 5 (NoU5)",
    "Parity0": "No children (Parity0)",
    "UnVx": "Majority of children under 5 unvaccinated (UnVx)",
    "Vx": "Majority of children vaccinated (Vx)",
    "unmet_need_limit": "Unmet need for limiting",
    "unmet_need_space": "Unmet need for spacing",
    "ALL_STD": "All STD",
    "CDM_Coverage": "CDM Coverage",
    "MILDA_Coverage": "MILDA Coverage",
    "CDM": "CDM Net Quantity",
    "MILDA": "MILDA Net Quantity",
}


def generate_label(indicator):
    # if we have a specific display name known, use it
    channel_name = indicator['channel']
    label = LABELS.get(channel_name, None)
    if label is None:
        # generate a display name according to a standard set of rules
        label = " ".join(p.capitalize() for p in channel_name.split('_'))
    return label


class IndicatorsSchema(Schema):
    channel = fields.Str(data_key="id")
    label = fields.Function(generate_label, data_key="text")

    @post_dump(pass_many=True)
    def wrap_with_envelope(self, data, many, **kwargs):
        return {"indicators": data}
