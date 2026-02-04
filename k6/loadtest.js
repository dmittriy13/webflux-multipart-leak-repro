import http from 'k6/http';
import {check, sleep} from 'k6';

const BASE_URL = __ENV.LT_BASE_URL || 'http://app:7878';
const PROXY_CONFIG_URL = __ENV.LT_PROXY_CONFIG_URL || 'http://toxi-proxy:8474';
const REQ_TIMEOUT = __ENV.LT_REQ_TIMEOUT || '1s';

const file = open('/loadtest/files/loadtest_1mb.bin', 'b');

function pickFile() {
    return {data: file, name: 'loadtest_1mb.bin'};
}

export function setup() {
    // 1. create proxy
    let p = http.post(`${PROXY_CONFIG_URL}/proxies`, JSON.stringify({
        name: 'app_limit',
        listen: `0.0.0.0:7777`,
        upstream: `app:7878`,
        enabled: true,
    }));

    // 2. add latency (500 KB/s)
    http.post(`${PROXY_CONFIG_URL}/proxies/app_limit/toxics`, JSON.stringify({
        type: 'bandwidth',
        name: 'upload_limit',
        stream: 'upstream',
        attributes: { rate: 500 }
    }));

    console.log('Toxiproxy configured successfully');
}

export default function () {
    const picked = pickFile();
    const headers = {
        accept: 'text/plain',
    };

    const formData = {
        file: http.file(picked.data, picked.name, 'application/octet-stream'),
    };
    let res = http.post(`${BASE_URL}/api/v1/multipart`, formData, {headers, timeout: REQ_TIMEOUT});

    check(res, {
        'status is 2xx': (r) => r.status >= 200 && r.status < 300,
    });

    sleep(0.01);
}
