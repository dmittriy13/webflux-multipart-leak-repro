FROM grafana/k6:latest

WORKDIR /loadtest
COPY k6/loadtest.js /loadtest/loadtest.js
COPY k6/run.sh /loadtest/run.sh

ENTRYPOINT ["sh","/loadtest/run.sh"]
