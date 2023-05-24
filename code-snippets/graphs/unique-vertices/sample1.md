## Sample

LET investmentThreshold = 50000
FOR customer IN customers
  FILTER customer.total_investment >= investmentThreshold
  FOR influenced_customer, influenced_edge IN 1..1 OUTBOUND customer influenced
    COLLECT influenced_investment = influenced_customer.total_investment INTO groups
    SORT LENGTH(groups) DESC, influenced_investment DESC
    LIMIT 10
    FOR influential_customer, investment_edge, path IN 1..1 INBOUND influenced_customer._id invested_in
      OPTIONS {uniqueVertices: 'path'}
      RETURN DISTINCT influential_customer