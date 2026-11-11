#!/usr/bin/env bash
# Turn raw postcard scans into the site's images.
#
# Drop files into assets/images/100postcards/_inbox/ with the postcard number anywhere in the name:
#   postcard-painting-001.jpg   -> the scan (paper edge included)
#   postcard-1-thumb.jpg        -> cropped to the painting, used for the thumbnail
#   001-received.jpg or -rcvd   -> the recipient's photo
# Then run:  bash scripts/process-postcards.sh
#
# Writes assets/images/100postcards/NNN.jpg (1600px), NNN-received.jpg (2000px)
# and thumbnails/NNN.jpg (400px), then moves each source into _originals/100postcards/
# (git-ignored, never published). The inbox folder itself stays, empty.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=assets/images/100postcards IN=$OUT/_inbox ORIG=_originals/100postcards
mkdir -p "$OUT/thumbnails" "$IN" "$ORIG/thumbnails"
shopt -s nullglob nocaseglob
for src in "$IN"/*.{jpg,jpeg,png,tif,tiff,heic,webp}; do
  name=$(basename "$src"); lower=$(echo "$name" | tr 'A-Z' 'a-z')
  num=$(echo "$lower" | grep -oE '[0-9]{1,3}' | head -1 || true)
  if [ -z "$num" ]; then echo "skip (no number): $name"; continue; fi
  id=$(printf '%03d' "$((10#$num))")
  if [[ $lower == *thumb* ]]; then
    kind=thumb; dest="$OUT/thumbnails/$id.jpg"; keep="$ORIG/thumbnails/$id.${name##*.}"; size=400; q=82
  elif [[ $lower == *receiv* || $lower == *rcvd* ]]; then
    kind=received; dest="$OUT/$id-received.jpg"; keep="$ORIG/$id-received.${name##*.}"; size=2000; q=85
  else
    kind=scan; dest="$OUT/$id.jpg"; keep="$ORIG/$id.${name##*.}"; size=1600; q=85
  fi
  convert "$src[0]" -auto-orient -colorspace sRGB -resize "${size}x${size}>" -strip -interlace JPEG -quality $q "$dest"
  [ -e "$keep" ] && keep="${keep%.*}-$(date +%s).${keep##*.}"
  mv "$src" "$keep"
  echo "#$id $kind -> $dest ($(du -h "$dest" | cut -f1))"
done
