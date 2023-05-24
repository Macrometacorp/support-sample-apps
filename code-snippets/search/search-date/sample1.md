## Sample

LET startDate = SPLIT(@startDate, "/")
LET fStartDate = DATETIMESTAMP(startDate[2], startDate[1], startDate[0]) 
LET endDate = SPLIT(@endDate, "/") 
LET fEndDate = DATETIMESTAMP(endDate[2], endDate[1], endDate[0])

FOR x IN tenders1
LET date = SPLIT(x["Publish Date"], "/")
LET formattedDate = DATE_TIMESTAMP(date[2], date[1], date[0])
FILTER formattedDate >= fStartDate && formattedDate <= fEndDate
RETURN x["Publish Date"]