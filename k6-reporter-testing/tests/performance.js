import http from 'k6/http';
import { check } from 'k6';

import { htmlReport } from '../dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

export const options = {
    vus: 1000,
    iterations: 3500,
    thresholds: {
        http_req_duration: ['max<=2000'],
    },
};

export default function () {
    for (let i = 0; i < 2; i++) {
        // Performance Test Scenario for API Create
        const createPayload = {
            name: 'morpheus',
            job: 'leader',
        };

        const createRes = http.post('https://reqres.in/api/users', JSON.stringify(createPayload), {
            headers: { 'Content-Type': 'application/json' },
        });

        if (createRes.status === 201 && createRes.json().hasOwnProperty('id')) {
            check(createRes, {
                'Create User Status is 201': () => true,
                'Create User Response includes ID': () => true,
            });
            break; // Exit the loop if the request is successful
        } else {
            console.warn(`Attempt ${i + 1} failed. Retrying...`);
        }
    }

    for (let i = 0; i < 2; i++) {
        // Performance Test Scenario for API Update
        const updatePayload = {
            name: 'morpheus',
            job: 'zion resident',
        };

        const updateRes = http.put('https://reqres.in/api/users/2', JSON.stringify(updatePayload), {
            headers: { 'Content-Type': 'application/json' },
        });

        if (updateRes.status === 200 && updateRes.json().hasOwnProperty('updatedAt')) {
            check(updateRes, {
                'Update User Status is 200': () => true,
                'Update User Response includes Updated At': () => true,
            });
            break; // Exit the loop if the request is successful
        } else {
            console.warn(`Attempt ${i + 1} failed. Retrying...`);
        }
    }
}

export function handleSummary(data) {
    return {
        'summary-performance.html': htmlReport(data, { debug: true }),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    }
};
