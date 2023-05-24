LET current_time = DATE_NOW()
LET time_limit = DATE_SUBTRACT(current_time, 15 * 60 * 1000,"millisecond") // 15 minutes ago

// Get recent views
  FOR edge IN shopVisitorShoeEdges
  FILTER DATE_ISO8601(edge.last_interaction_timestamp) > time_limit AND edge.relationship == 'recent_view'
    LET item = DOCUMENT(edge._to)
    SORT DATE_ISO8601(edge.last_interaction_timestamp) desc
    RETURN {
      item: item,
      lastViewed: DATE_ISO8601(edge.last_interaction_timestamp)
    }