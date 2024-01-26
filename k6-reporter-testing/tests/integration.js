
import http from 'k6/http';
import { check, sleep } from 'k6';

import { htmlReport } from '../dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

const BASE_URL = 'https://reqres.in';
const USERS_ENDPOINT = '/api/users';

export const options = {
  stages: [
    { duration: '10s', target: 5 }, // Ramp-up phase
    { duration: '20s', target: 5 }, // Steady state
    { duration: '10s', target: 0 }, // Ramp-down phase
  ],
};

export default function () {
  // Scenario 1: Create user
  const createUserPayload = {
    name: 'morpheus',
    job: 'leader',
  };

  const createUserRes = http.post(
    `${BASE_URL}${USERS_ENDPOINT}`,
    JSON.stringify(createUserPayload),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(createUserRes, {
    'Create User Status is 201': (res) => res.status === 201,
    'Create User Response includes ID': (res) =>
      JSON.parse(res.body).hasOwnProperty('id'),
  });

  // Scenario 2: Update user
  const updateUserPayload = {
    name: 'morpheus',
    job: 'zion resident',
  };

  const updateUserRes = http.put(
    `${BASE_URL}${USERS_ENDPOINT}/2`,
    JSON.stringify(updateUserPayload),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(updateUserRes, {
    'Update User Status is 200': (res) => res.status === 200,
    'Update User Response includes Updated At': (res) =>
      JSON.parse(res.body).hasOwnProperty('updatedAt'),
  });

  // Add a sleep to simulate a realistic scenario
  sleep(1);
};

export function handleSummary(data) {
    return {
      'summary-integration.html': htmlReport(data, { debug: true }),
      stdout: textSummary(data, { indent: ' ', enableColors: true }),
    }
  };
