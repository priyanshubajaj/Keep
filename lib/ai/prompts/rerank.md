# Re-ranking Cached Responses

Given a user's question and a candidate cached response's original question, determine if they have the same semantic intent.

Return JSON:
```json
{
  "match": true
}
```

or

```json
{
  "match": false
}
```

Match should be true if:
- The user's question is a paraphrase or variant of the cached question
- Both would be answered by the same response
- The semantic intent is the same, even if wording differs

Match should be false if:
- The questions ask about different topics
- They have different emotional contexts
- The answers would differ substantively
