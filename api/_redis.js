const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

export function storageConfigured() {
  return Boolean(url && token);
}

export async function redis(command, ...args) {
  if (!storageConfigured()) {
    throw new Error('Redis storage is not configured');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([command, ...args])
  });

  if (!response.ok) {
    throw new Error(`Redis request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
}
