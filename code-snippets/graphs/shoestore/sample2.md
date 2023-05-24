LET visitor = (FOR v IN shopVisitor FILTER v._key == @uid RETURN v)[0]

FOR item, edge,p IN 1..1 OUTBOUND visitor shopVisitorShoeEdges
    FILTER edge.relationship == "recent_view"
    sort edge.last_interaction_timestamp desc
    limit 16
    RETURN item