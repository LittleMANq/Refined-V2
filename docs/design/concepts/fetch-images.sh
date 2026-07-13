#!/usr/bin/env bash
# Downloads the three Today-screen concept renders from the Higgsfield CDN
# into this folder. Run from any network that allows cloudfront.net
# (the remote agent environment that generated them could not).
set -euo pipefail
cd "$(dirname "$0")"

base="https://d8j0ntlcm91z4.cloudfront.net/user_33u5nuYHdbDpVywvjjZ6eOtPaZK"
curl -fSL -o concept-1-editorial-ink.png "$base/hf_20260713_070314_186b0c9e-5cfe-4850-962b-eb5a99b2b16a.png"
curl -fSL -o concept-2-gallery.png       "$base/hf_20260713_070339_bd68f3d1-3b16-409e-ba97-719b7fbaed53.png"
curl -fSL -o concept-3-after-dark.png    "$base/hf_20260713_070402_bf03dddc-a833-44bb-8acf-096323dc08a9.png"
echo "Done. 3 concept images saved to $(pwd)"
