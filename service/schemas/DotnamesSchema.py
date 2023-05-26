from marshmallow import fields, post_dump, Schema


class DotnamesSchema(Schema):
    dot_name = fields.Str(data_key='id')
    label = fields.Function(lambda obj: obj['dot_name'].split(':')[-1].capitalize(), data_key="text")

    @post_dump(pass_many=True)
    def wrap_with_envelope(self, data, many, **kwargs):
        return {"dot_names": data}
