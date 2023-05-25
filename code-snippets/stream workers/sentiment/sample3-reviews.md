## Sample

CREATE STREAM CustomerReviewsStream (productId string, timestamp long, username string, review string);

CREATE TABLE AverageSentimentTable (_key string , avgSentiment double);

CREATE SINK STREAM SentimentAnalysisStream (productId string, timestamp long, username string, review string, sentimentScore int);

@info(name = 'customerReviewsSentimentAnalysis')
INSERT INTO SentimentAnalysisStream
SELECT productId, timestamp, username, review, sentiment:getRate(review) AS sentimentScore
FROM CustomerReviewsStream;

@info(name = 'averageSentimentPerProduct')
INSERT INTO AverageSentimentTable
SELECT productId as _key, avg(sentimentScore) AS avgSentiment
FROM SentimentAnalysisStream WINDOW TUMBLING_LENGTH(5)
GROUP BY productId;

@info(name = 'averageSentimentPerProductUpdate')
UPDATE AverageSentimentTable
SET AverageSentimentTable._key = _key, AverageSentimentTable.avgSentiment = avgSentiment
ON AverageSentimentTable._key == _key
SELECT productId as _key, avg(sentimentScore) AS avgSentiment
FROM SentimentAnalysisStream WINDOW TUMBLING_LENGTH(5)
GROUP BY productId;


