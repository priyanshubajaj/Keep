# Entity Extraction

Given a memory segment, extract structured entities. Output must be valid JSON:

```json
{
  "people": ["name1", "name2"],
  "places": ["place1", "place2"],
  "dates": ["1943", "March 1962"],
  "topic": "childhood | family | work | loss | joy | travel | home | faith | friendship | legacy | other",
  "valence": "warm | grief | complicated | neutral | joyful"
}
```

Rules:
- Extract only names actually mentioned, not inferred
- Dates can be years, months, or month-year combinations
- Topic: pick the primary category that best fits
- Valence: emotional tone of the segment
