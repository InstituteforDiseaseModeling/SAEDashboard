class DotName:

    DOT_NAME_SEPARATOR = ':'

    # DOT_NAME_REGEX = re.compile('^[\w]+(%s[\w]+)*$' % DOT_NAME_SEPARATOR)

    def __init__(self, dot_name_str):
        # if not self.DOT_NAME_REGEX.match(dot_name_str):
        #     raise ValueError('DotNames must be one or more %s separated strings, \'_\' and \'-\' allowed. %s' %
        #                      (self.DOT_NAME_SEPARATOR, dot_name_str))

        self.parts = dot_name_str.split(self.DOT_NAME_SEPARATOR)

    @property
    def admin_level(self):
        return len(self.parts) - 1

    @property
    def country(self):
        return self.parts[1] if len(self.parts) > 1 else None

    @property
    def continent(self):
        return self.parts[0]

    def __eq__(self, other):
        return True if self.parts == other.parts else False

    def __repr__(self):
        return self.DOT_NAME_SEPARATOR.join(self.parts)

    def is_ancestor(self, dn):
        return (dn.parts[0:self.admin_level + 1] == self.parts) and (dn.admin_level > self.admin_level)

    def is_descendant(self, dn):
        return dn.is_ancestor(dn=self)

    def is_descendant_or_self(self, dn):
        return self.is_descendant(dn=dn) or self == dn

    def is_ancestor_or_self(self, dn):
        return self.is_ancestor(dn=dn) or self == dn

    def is_related(self, dn):
        return True if self.is_ancestor(dn=dn) or self.is_descendant(dn=dn) or self == dn else False

    def generational_distance(self, dn):
        return self.admin_level - dn.admin_level if self.is_related(dn=dn) else None

    @classmethod
    def from_parts(cls, parts):
        return cls(cls.DOT_NAME_SEPARATOR.join(parts))
