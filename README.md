# multipart-leak-repro

Minimal repro project for an off-heap ByteBuf leak when the client aborts during multipart upload.

## Structure

- `src/main/java/org/example/UploadController.java` — two endpoints:
  - `/api/v1/multipart` (multipart)
- `src/main/resources/application.yaml` — `spring.webflux.multipart.max-in-memory-size: 0B`
- `k6/loadtest.js` — k6 script that aborts by request timeout
- `docker-compose.yml` — app + k6 runner container + toxiproxy(for simulate slow uploading)
- `k6/run.sh` — generates a 1MB file and runs k6

## k6 configuration

Default k6 settings are provided via environment variables in `docker-compose.yml`:
- `LT_BASE_URL` (default `http://app:7878`)
- `LT_REQ_TIMEOUT` (default `1s`)

## Quick start

1) Build the app jar:
```bash
mvn clean package
```

2) Run app + k6 with Docker Compose:
If you are using IntelliJ IDEA, use the configuration run command "repro", otherwise:
```bash
docker compose up --build
```

3) See app logs
```bash
docker compose logs -f app | grep LEAK
```


