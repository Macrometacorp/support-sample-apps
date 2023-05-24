## Sample

FOR review IN sample_view
  SEARCH ANALYZER(PHRASE(review.Review_Text, "for", 1, "nights"), "text_en")
  RETURN {
  Property_Name: review.Property_Name,
  Review_Rating: review.Review_Rating
  }