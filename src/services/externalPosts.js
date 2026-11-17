// API externa de testes. JSONPlaceholder confirma POST/PATCH/DELETE mas NAO persiste as alteracoes.
export const EXTERNAL_API = 'https://jsonplaceholder.typicode.com/posts';
const request = async (path = '', options = {}) => {
  const response = await fetch(EXTERNAL_API + path, {
    ...options,
    headers: { 'Content-Type': 'application/json; charset=UTF-8', ...(options.headers || {}) },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`API externa: HTTP ${response.status}`);
  if (response.status === 204) return { ok: true };
  const body = await response.text();
  return body ? JSON.parse(body) : { ok: true };
};
export async function listExternalPosts() {
  const results = await request('?_limit=6');
  return results.map((post) => ({ id: post.id, title: post.title, body: post.body, external: true }));
}
export const createExternalPost = (post) => request('', { method: 'POST', body: JSON.stringify({ ...post, userId: 1 }) });
export const updateExternalPost = (id, post) => request(`/${id}`, { method: 'PATCH', body: JSON.stringify(post) });
export const deleteExternalPost = (id) => request(`/${id}`, { method: 'DELETE' });
