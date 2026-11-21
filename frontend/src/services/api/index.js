/**
 * WAHAJ Scientific API Client
 * Connects React frontend directly to FastAPI backend & SQLite database.
 */

import { API_URL } from '../../config';

const BASE_URL = API_URL;

export async function checkBackendStatus() {
  try {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) throw new Error('Backend offline');
    return await res.json();
  } catch (err) {
    console.warn('WAHAJ Backend offline, using client fallback', err);
    return null;
  }
}

export async function fetchInvestigations(search = '') {
  try {
    const url = search 
      ? `${BASE_URL}/api/investigations?search=${encodeURIComponent(search)}`
      : `${BASE_URL}/api/investigations`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch investigations');
    return await res.json();
  } catch (err) {
    console.warn('API error, falling back to local dataset', err);
    return null;
  }
}

export async function fetchInvestigationDetails(psiId) {
  try {
    const res = await fetch(`${BASE_URL}/api/investigations/${encodeURIComponent(psiId)}`);
    if (!res.ok) throw new Error(`Investigation ${psiId} not found`);
    return await res.json();
  } catch (err) {
    console.warn(`API error for ${psiId}`, err);
    return null;
  }
}

export async function fetchRuns(investigationId = null, materialForm = null) {
  try {
    const params = new URLSearchParams();
    if (investigationId) params.append('investigation_id', investigationId);
    if (materialForm) params.append('material_form', materialForm);
    const res = await fetch(`${BASE_URL}/api/runs?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch runs');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching runs', err);
    return null;
  }
}

export async function fetchDropletAnalytics() {
  try {
    const res = await fetch(`${BASE_URL}/api/analytics/droplets`);
    if (!res.ok) throw new Error('Failed to fetch droplet analytics');
    return await res.json();
  } catch (err) {
    console.warn('API error droplet analytics', err);
    return null;
  }
}

export async function fetchSolidAnalytics() {
  try {
    const res = await fetch(`${BASE_URL}/api/analytics/solids`);
    if (!res.ok) throw new Error('Failed to fetch solid analytics');
    return await res.json();
  } catch (err) {
    console.warn('API error solid analytics', err);
    return null;
  }
}

export async function fetchCoolFlamesAnalytics() {
  try {
    const res = await fetch(`${BASE_URL}/api/analytics/cool-flames`);
    if (!res.ok) throw new Error('Failed to fetch cool flames analytics');
    return await res.json();
  } catch (err) {
    console.warn('API error cool flames analytics', err);
    return null;
  }
}

export async function fetchMaterialsSafety() {
  try {
    const res = await fetch(`${BASE_URL}/api/safety/materials`);
    if (!res.ok) throw new Error('Failed to fetch materials safety');
    return await res.json();
  } catch (err) {
    console.warn('API error materials safety', err);
    return null;
  }
}

export async function predictSimulation(payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/simulation/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to run simulation');
    return await res.json();
  } catch (err) {
    console.warn('Simulation API error', err);
    return null;
  }
}

export async function askResearchAssistant(question) {
  try {
    const res = await fetch(`${BASE_URL}/api/ai/research-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    if (!res.ok) throw new Error('Assistant API error');
    return await res.json();
  } catch (err) {
    console.warn('Assistant API fallback', err);
    return null;
  }
}

export async function askNL2SQL(question, sessionId = 'default', apiKey = null) {
  try {
    const payload = { question, session_id: sessionId };
    if (apiKey) payload.api_key = apiKey;
    const res = await fetch(`${BASE_URL}/api/chat/nl2sql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('NL2SQL API error');
    return await res.json();
  } catch (err) {
    console.warn('NL2SQL API error', err);
    return null;
  }
}

export async function getNL2SQLStatus() {
  try {
    const res = await fetch(`${BASE_URL}/api/chat/status`);
    if (!res.ok) throw new Error('Status error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function configureLLMAPI(apiKey, provider = 'auto', model = null) {
  try {
    const res = await fetch(`${BASE_URL}/api/chat/configure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, provider, model })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}
