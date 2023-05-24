## Sample

CREATE STREAM LoginStream ( userID string, loginSuccessful bool);

-- Optional purging configuration, to remove partition instances that haven't received events for `1 hour` by checking every `10 sec`.
@purge(enable='true', interval='10 sec', idle.period='1 hour')
-- Partitions the events based on `userID`.
partition with ( userID of LoginStream )

begin
    @info(name='Aggregation-query')
-- Calculates success and failure login attempts from last 3 events of each `userID`.
    insert into #LoginAttempts
    select userID, loginSuccessful, count() as attempts
    from LoginStream window sliding_length(3)
    group by loginSuccessful;
-- Inserts results to `#LoginAttempts` inner stream that is only accessible within the partition instance.
    


    @info(name='Alert-query')
-- Consumes events from the inner stream, and suspends `userID`s that have 3 consecutive login failures.
    insert into UserSuspensionStream
    select userID, "3 consecutive login failures!" as message
    from #LoginAttempts[loginSuccessful==false and attempts==3];

end;
