# Memoir Segmentation

Split the provided written text into self-contained segments. Each segment should:

- Be 100-300 words
- Contain a single cohesive topic or memory
- Read naturally, as if the author could plausibly say it aloud
- Stand alone without reference to other segments

Output a JSON array of objects with this shape:
```json
[
  { "text": "...", "source": "memoir:chapter-3" },
  { "text": "...", "source": "memoir:chapter-3" }
]
```

Use the `source` field to tag which part of the input the segment came from (e.g., "memoir:chapter-3", "letters:1987").
