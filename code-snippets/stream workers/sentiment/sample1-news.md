## Sample

CREATE STREAM NewsHeadlinesStream (headline string);
CREATE SINK STREAM SentimentAnalysisStream (headline string, sentimentScore int);

@info(name = 'simpleSentimentAnalysis')
INSERT INTO SentimentAnalysisStream
SELECT headline, sentiment:getRate(headline) AS sentimentScore
FROM NewsHeadlinesStream;