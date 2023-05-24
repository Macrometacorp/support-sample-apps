## Sample

Let alternatives = ["Very good", "Very Good", "very good"]
FOR alternative in alternatives
LET count = FIRST(
FOR review IN sample_view
      SEARCH ANALYZER(review.Review_Title == alternative, "identity")
      OPTIONS { countApproximate: "cost" }
COLLECT WITH COUNT INTO count
  RETURN count
  ) RETURN {alternative, count}