## Sample

WITH suppliers, products, retail_locations, supplies, stocks
FOR supplier IN suppliers
  FOR product, supply_edge IN 1..1 OUTBOUND supplier supplies
    FILTER supply_edge.supply_volume > 500
    FOR location, stock_edge IN 1..1 OUTBOUND product stocks
      FILTER stock_edge.stock_level < 100
      OPTIONS {uniqueEdges: "path"}
      RETURN {
        supplier: supplier.name,
        product: product.name,
        location: location.name,
        supply_volume: supply_edge.supply_volume,
        stock_level: stock_edge.stock_level
      }