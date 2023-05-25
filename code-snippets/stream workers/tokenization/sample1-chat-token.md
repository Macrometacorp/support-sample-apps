## Sample

CREATE STREAM PlayerChatStream (timestamp long, rawChatMessage string);
CREATE SINK STREAM TokenizedPlayerChatStream (timestamp long, word string);

@info(name = 'tokenizePlayerChat')
INSERT INTO TokenizedPlayerChatStream
SELECT timestamp, token AS word
FROM PlayerChatStream#str:tokenize(rawChatMessage, ' ');