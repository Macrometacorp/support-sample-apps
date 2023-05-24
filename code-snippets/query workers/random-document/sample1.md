## Sample

LET nm = (FOR doc IN donations2donations_made
    SORT RAND()
    LIMIT 1
    RETURN doc['Donor Name'])

    FOR doc IN donations2donations_made
        FILTER doc['Donor Name'] == nm[0]
        RETURN doc.name