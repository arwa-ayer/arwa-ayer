const JIRA_KEY = 'pp_jira_config';
const CORS_PROXY = 'https://corsproxy.io/?';

export function loadJiraConfig() {
  try { return JSON.parse(localStorage.getItem(JIRA_KEY) || 'null'); }
  catch { return null; }
}

export function saveJiraConfig(cfg) {
  localStorage.setItem(JIRA_KEY, JSON.stringify(cfg));
}

// Extract just the atlassian.net hostname from anything the user pastes
export function cleanDomain(raw) {
  if (!raw) return '';
  let d = raw.trim().replace(/^https?:\/\//, '');
  const slash = d.indexOf('/');
  if (slash >= 0) d = d.slice(0, slash);
  return d;
}

function headers(cfg) {
  return {
    'Authorization': `Basic ${btoa(`${cfg.email}:${cfg.token}`)}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
}

function proxied(url) {
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
}

export async function fetchJiraTickets(cfg) {
  const domain = cleanDomain(cfg.domain);
  const target = `https://${domain}/rest/api/3/search`
    + `?jql=${encodeURIComponent(cfg.jql)}`
    + `&fields=summary,customfield_10020,customfield_10016,status`
    + `&maxResults=50`;
  const res = await fetch(proxied(target), { headers: headers(cfg) });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jira ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.issues || []).map(issue => {
    const sprints = issue.fields.customfield_10020 || [];
    const sprint = sprints.find(s => s.state === 'active') || sprints.slice(-1)[0];
    return {
      id: issue.key,
      key: issue.key,
      titreUS: issue.fields.summary,
      numDECOR: sprint ? `Sprint ${sprint.id}` : '—',
      titreDECOR: sprint?.name || '—',
      dateImport: new Date().toLocaleDateString('fr-FR'),
      chiffrage: issue.fields.customfield_10016 ?? null,
      browse: `https://${domain}/browse/${issue.key}`,
    };
  });
}

export async function pushEstimateToJira(cfg, issueKey, value) {
  const domain = cleanDomain(cfg.domain);
  const target = `https://${domain}/rest/api/3/issue/${issueKey}`;
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  for (const field of ['customfield_10016', 'story_points']) {
    const res = await fetch(proxied(target), {
      method: 'PUT',
      headers: headers(cfg),
      body: JSON.stringify({ fields: { [field]: num } }),
    });
    if (res.ok || res.status === 204) return true;
  }
  return false;
}
