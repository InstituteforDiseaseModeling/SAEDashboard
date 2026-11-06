import unicodedata

_IGNORED_CHARS = {' ', '-', '_'}


def normalize_dot_name(s):
    return ''.join(
        c for c in unicodedata.normalize('NFD', str(s))
        if unicodedata.category(c) != 'Mn' and c not in _IGNORED_CHARS
    ).casefold()


class DotName:
    DOT_NAME_SEPARATOR = ':'

    def __init__(self, dot_name_str):
        self.parts = dot_name_str.split(self.DOT_NAME_SEPARATOR)
        self._key_parts = [normalize_dot_name(p) for p in self.parts]

    @property
    def admin_level(self):
        return len(self.parts) - 2

    @property
    def country(self):
        return self.parts[1] if len(self.parts) > 1 else None

    @property
    def continent(self):
        return self.parts[0]

    def __eq__(self, other):
        if not isinstance(other, DotName):
            return NotImplemented
        return self._key_parts == other._key_parts

    def __repr__(self):
        return self.DOT_NAME_SEPARATOR.join(self.parts)

    def __str__(self):
        return self.DOT_NAME_SEPARATOR.join(self.parts)

    def __hash__(self):
        return hash(tuple(self._key_parts))

    def is_ancestor(self, dn):
        return (dn._key_parts[0:len(self._key_parts)] == self._key_parts) and (dn.admin_level > self.admin_level)

    def is_descendant(self, dn):
        return dn.is_ancestor(dn=self)

    def is_descendant_or_self(self, dn):
        return self.is_descendant(dn=dn) or self == dn

    def is_ancestor_or_self(self, dn):
        return self.is_ancestor(dn=dn) or self == dn

    def is_related(self, dn):
        return self.is_ancestor(dn=dn) or self.is_descendant(dn=dn) or self == dn

    def generational_distance(self, dn):
        return self.admin_level - dn.admin_level if self.is_related(dn=dn) else None

    @classmethod
    def from_parts(cls, parts):
        return cls(cls.DOT_NAME_SEPARATOR.join(parts))
