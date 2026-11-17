import { useCallback, useEffect, useState } from 'react';
import { listExternalPosts, createExternalPost, updateExternalPost, deleteExternalPost } from '../services/externalPosts.js';

const KEY = 'soundconnect-mural-v1';
const load = () => {
  try { const data = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(data) ? data : []; }
  catch { return []; }
};
const newId = () => (globalThis.crypto?.randomUUID?.() || String(Date.now()) + Math.random().toString(36).slice(2));

/** Camada de estado e regras de CRUD separada dos componentes visuais. */
export function useMusicMural() {
  const [posts, setPosts] = useState(load);
  const [external, setExternal] = useState([]);
  const [status, setStatus] = useState('Carregando indicações externas...');
  const [busy, setBusy] = useState(false);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(posts)); }, [posts]);
  const reload = useCallback(async () => {
    try { setExternal(await listExternalPosts()); setStatus('API externa conectada.'); }
    catch { setStatus('API externa indisponível. O mural local continua funcionando.'); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  const create = async (payload) => {
    const title = String(payload.title || '').trim();
    const body = String(payload.body || '').trim();
    if (title.length < 3 || title.length > 90 || body.length < 3 || body.length > 500) throw new Error('Preencha título (3 a 90) e descrição (3 a 500 caracteres).');
    const entry = { id: newId(), title, body, createdAt: new Date().toISOString() };
    setBusy(true);
    try {
      let synced = false;
      try { await createExternalPost({ title, body }); synced = true; } catch { /* offline: mantém cópia local */ }
      setPosts((current) => [{ ...entry, synced }, ...current]);
      setStatus(synced ? 'POST enviado à API externa; salvo localmente.' : 'Sem conexão externa; salvo localmente.');
      return entry;
    } finally { setBusy(false); }
  };
  const update = async (id, payload) => {
    const title = String(payload.title || '').trim();
    const body = String(payload.body || '').trim();
    if (title.length < 3 || title.length > 90 || body.length < 3 || body.length > 500) throw new Error('Preencha título (3 a 90) e descrição (3 a 500 caracteres).');
    setBusy(true);
    try {
      // IDs gerados localmente não existem no JSONPlaceholder. Usa registro de teste 1 para demonstrar PATCH.
      let synced = false;
      try { await updateExternalPost(1, { title, body }); synced = true; } catch { /* mantém edição local */ }
      setPosts((current) => current.map((post) => post.id === id ? { ...post, title, body, synced } : post));
      setStatus(synced ? 'PATCH demonstrado na API externa; edição salva localmente.' : 'Edição salva localmente.');
    } finally { setBusy(false); }
  };
  const remove = async (id) => {
    setBusy(true);
    try {
      let synced = false;
      try { await deleteExternalPost(1); synced = true; } catch { /* mantém exclusão local */ }
      setPosts((current) => current.filter((post) => post.id !== id));
      setStatus(synced ? 'DELETE demonstrado na API externa; registro local excluído.' : 'Registro excluído localmente.');
    } finally { setBusy(false); }
  };
  return { posts, external, status, busy, create, update, remove, reload };
}
