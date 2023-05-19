FOR doc in directorsView
SEARCH PHRASE(doc.directors.name, SUBSTITUTE(@value, "&#x27;", "'"), "text_en")
RETURN doc 