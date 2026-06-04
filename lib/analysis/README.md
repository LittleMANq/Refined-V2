# /lib/analysis

The Personal Analysis engine: body type, proportions, skin tone / color season,
and garment detection from photos.

Built behind a swappable `AnalysisProvider` interface (Anthropic vision at MVP).
Accuracy is the #1 product risk, so this stays modular and the model can be
swapped without changing callers.

Built in Prompt 4. See CLAUDE.md §6 and /docs/Refined_Features.md Module 1.
