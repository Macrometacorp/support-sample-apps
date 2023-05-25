## Sample

CREATE STREAM SocialMediaPostsStream (timestamp long, username string, post string);

CREATE SINK STREAM SentimentAnalysisStream (timestamp long, username string, post string, sentimentScore int);

@info(name = 'socialMediaSentimentAnalysis')
INSERT INTO SentimentAnalysisStream
SELECT timestamp, username, post, sentiment:getRate(post) AS sentimentScore
FROM SocialMediaPostsStream;