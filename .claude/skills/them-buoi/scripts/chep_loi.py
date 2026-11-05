"""Chép lời một file nghe, in ra mốc thời gian để làm transcript và gắn `t` cho câu hỏi.

Cài một lần (ở thư mục gốc repo, .venv đã có trong .gitignore):
    python3 -m venv .venv && .venv/bin/pip install faster-whisper numpy
Chạy:
    .venv/bin/python .claude/skills/them-buoi/scripts/chep_loi.py So_hoc_tieng_Anh/am-thanh/1.20.mp3
    thêm --words để in mốc thời gian từng từ (khi cần `t` chính xác cho một câu hỏi)

Giải mã bằng ffmpeg thay vì PyAV (PyAV bản mới lỗi `metadata_errors`).
Kết quả in dạng dòng transcript dán thẳng vào buoi-NN.js: [giây, "câu"],
"""
import json
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

args = [a for a in sys.argv[1:] if not a.startswith("--")]
words = "--words" in sys.argv
if not args:
    sys.exit(__doc__)

model = WhisperModel("medium.en", device="cpu", compute_type="int8")
for path in args:
    raw = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", path, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
        capture_output=True, check=True,
    ).stdout
    audio = np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0
    segs, _ = model.transcribe(audio, beam_size=5, word_timestamps=words)
    print(f"// {path}")
    for s in segs:
        print(f"[{round(s.start, 1)}, {json.dumps(s.text.strip(), ensure_ascii=False)}],")
        if words:
            print("//   " + " ".join(f"{w.word.strip()}@{w.start:.1f}" for w in s.words))
