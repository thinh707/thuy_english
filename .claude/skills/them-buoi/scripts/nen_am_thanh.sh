#!/usr/bin/env bash
# Nén file nghe cho trang web (96 kbps mono, ~0,7 MB/phút).
#   bash .claude/skills/them-buoi/scripts/nen_am_thanh.sh "<file gốc>" 1.20
# → So_hoc_tieng_Anh/am-thanh/1.20.mp3
set -euo pipefail
src="$1"; name="$2"
root="$(cd "$(dirname "$0")/../../../.." && pwd)"
out="$root/So_hoc_tieng_Anh/am-thanh/$name.mp3"
ffmpeg -v error -y -i "$src" -vn -ac 1 -b:a 96k "$out"
printf '%s  %s  %ss\n' "$out" "$(du -h "$out" | cut -f1)" \
  "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out" | cut -d. -f1)"
