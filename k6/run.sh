#!/bin/sh
set -eu

FILE_DIR="/loadtest/files"
FILE_PATH="${FILE_DIR}/loadtest_1mb.bin"

mkdir -p "${FILE_DIR}"
if [ ! -f "${FILE_PATH}" ]; then
  dd if=/dev/zero of="${FILE_PATH}" bs=1M count=5 2>/dev/null
fi

k6 run --vus 50 --duration 1m --rps 50 /loadtest/loadtest.js
