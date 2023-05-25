## Sample

CREATE STREAM VideoMetadataStream (videoId string, metadataJson string);
CREATE STREAM IntermediateTitleStream (videoId string, title string);
CREATE STREAM IntermediateDescriptionStream (videoId string, description string);
CREATE SINK STREAM TokenizedMetadataStream (videoId string, title string, description string);

@info(name = 'tokenizeVideoTitle')
INSERT INTO IntermediateTitleStream
SELECT videoId, jsonElement AS title
FROM VideoMetadataStream#json:tokenize(metadataJson, '$.title');

@info(name = 'tokenizeVideoDescription')
INSERT INTO IntermediateDescriptionStream
SELECT videoId, jsonElement AS description
FROM VideoMetadataStream#json:tokenize(metadataJson, '$.description');

@info(name = 'combineTokenizedMetadata')
INSERT INTO TokenizedMetadataStream
SELECT t.videoId, t.title, d.description
FROM IntermediateTitleStream AS t JOIN IntermediateDescriptionStream AS d ON t.videoId == d.videoId;