## Sample

LET visitor = (FOR v IN shopVisitor FILTER v._key == @uid RETURN v)[0]
LET recent_views = (
  FOR item, edge IN 1..1 OUTBOUND visitor shopVisitorShoeEdges
    FILTER edge.relationship == "recent_view"
    COLLECT itemId = item._id AGGREGATE totalWeight = SUM(edge.weight)
    SORT totalWeight DESC
    RETURN { _id: itemId, totalWeight: totalWeight })
LET clicked_links = (
  FOR item, edge IN 1..1 OUTBOUND visitor shopVisitorShoeEdges
    FILTER edge.relationship == "clicked_link"
    COLLECT itemId = item._id AGGREGATE totalWeight = SUM(edge.weight)
    SORT totalWeight DESC
    RETURN { _id: itemId, totalWeight: totalWeight })

FOR shoe IN shopInventory
    LET recent_view_relation = FIRST(FOR view IN recent_views FILTER view._id == shoe._id RETURN view)
    LET recent_view_score = recent_view_relation ? recent_view_relation.totalWeight * 2 : 0
    LET clicked_link_relation = FIRST(FOR link IN clicked_links FILTER link._id == shoe._id RETURN link)
    LET clicked_link_score = clicked_link_relation ? clicked_link_relation.totalWeight * 4 : 0
    LET totalScore = recent_view_score + clicked_link_score
    SORT totalScore DESC
    for c in shoe.stock
        filter c.quantity <= 10    
    LIMIT 4
    RETURN shoe