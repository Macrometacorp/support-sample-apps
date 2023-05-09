### Query Worker definition to insert access log JSON documents into target table.

```sql
FOR i IN @array
INSERT i INTO httpAccessLogs
```