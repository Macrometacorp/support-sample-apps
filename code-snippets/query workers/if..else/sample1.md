FOR doc IN 1..1
   LET result = (@value != "" ? (FOR x in honorifics filter x.cat == @value return x) : (FOR y in honorifics return y))
RETURN result