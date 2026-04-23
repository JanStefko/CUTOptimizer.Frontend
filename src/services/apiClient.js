const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function buildUrl(path) {
  if (!API_BASE_URL) {
    throw new Error('Chybí VITE_API_BASE_URL v .env')
  }

  return `${API_BASE_URL}${path}`
}

async function parseErrorResponse(response, fallbackMessage) {
  try {
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const data = await response.json()
      return data?.message || JSON.stringify(data)
    }

    const text = await response.text()
    return text || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

async function getJson(path) {
  const response = await fetch(buildUrl(path), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      `HTTP ${response.status} při volání ${path}`
    )
    throw new Error(message)
  }

  return response.json()
}

async function postJson(path, body) {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const message = await parseErrorResponse(
      response,
      `HTTP ${response.status} při volání ${path}`
    )
    throw new Error(message)
  }

  return response.json()
}

export { getJson, postJson }