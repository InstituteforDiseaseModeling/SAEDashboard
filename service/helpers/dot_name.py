"""
This module defines the DotName class for representing and working with hierarchical geographic identifiers
(aka "dot names") in the form of strings like 'Africa:Senegal:Saint-Louis:Dagana'. These identifiers encode
administrative hierarchy and are used throughout the backend to manage spatial data structures.

DotNames are split on the ':' character and can be used to compare geographic containment relationships such
as ancestor/descendant or same level.
"""

class DotName:
    """
    Represents a hierarchical region identifier split by colons (:),
    such as 'Africa:Senegal:Saint-Louis:Dagana'. Provides utility methods
    for comparing and manipulating these dot names.
    """

    DOT_NAME_SEPARATOR = ':'

    def __init__(self, dot_name_str):
        """
        Initialize a DotName instance from a colon-separated string.

        Args:
            dot_name_str (str): The full dot name (e.g., 'Africa:Senegal:Saint-Louis')
        """
        self.parts = dot_name_str.split(self.DOT_NAME_SEPARATOR)
        self._lower_parts = [p.lower() for p in self.parts]

    @property
    def admin_level(self):
        """
        Returns the number of administrative levels below the continent.
        For example, 'Africa:Senegal:Saint-Louis' => level 2
        """
        return len(self.parts) - 1

    @property
    def country(self):
        """
        Returns the country part of the dot name (2nd segment), or None if missing.
        """
        return self.parts[1] if len(self.parts) > 1 else None

    @property
    def continent(self):
        """
        Returns the continent part (1st segment) of the dot name.
        """
        return self.parts[0]

    def __eq__(self, other):
        """
        Equality comparison based on dot name parts (case-insensitive).
        """
        return self._lower_parts == other._lower_parts

    def __repr__(self):
        """
        String representation (e.g., 'Africa:Senegal:Saint-Louis').
        """
        return self.DOT_NAME_SEPARATOR.join(self.parts)

    def is_ancestor(self, dn):
        """
        Checks if self is an ancestor of the given DotName.
        """
        return (dn._lower_parts[0:self.admin_level + 1] == self._lower_parts) and (dn.admin_level > self.admin_level)

    def is_descendant(self, dn):
        """
        Checks if self is a descendant of the given DotName.
        """
        return dn.is_ancestor(dn=self)

    def is_descendant_or_self(self, dn):
        """
        Checks if self is a descendant or the same as the given DotName.
        """
        return self.is_descendant(dn=dn) or self == dn

    def is_ancestor_or_self(self, dn):
        """
        Checks if self is an ancestor or the same as the given DotName.
        """
        return self.is_ancestor(dn=dn) or self == dn

    def is_related(self, dn):
        """
        Checks if self and dn are part of the same hierarchy (ancestor, descendant, or equal).
        """
        return True if self.is_ancestor(dn=dn) or self.is_descendant(dn=dn) or self == dn else False

    def generational_distance(self, dn):
        """
        Calculates the admin level difference between self and dn if related.
        """
        return self.admin_level - dn.admin_level if self.is_related(dn=dn) else None

    @classmethod
    def from_parts(cls, parts):
        """
        Creates a DotName instance from a list of name segments.
        """
        return cls(cls.DOT_NAME_SEPARATOR.join(parts))
