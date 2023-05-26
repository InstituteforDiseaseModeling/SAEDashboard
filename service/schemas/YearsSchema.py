from marshmallow import Schema, fields, post_dump


class YearsSchema(Schema):
    id = fields.Str(data_key='id', required=True)
    start_year = fields.Int(data_key="start_year", required=True)
    end_year = fields.Int(data_key="end_year", required=True)

    @post_dump(pass_many=True)
    def wrap_with_envelope(self, data, many, **kwargs):
        return {"years": data}
