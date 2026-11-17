import { useState } from 'react';
import { RefreshCcw, Globe, Database } from 'lucide-react';
import { useMusicMural } from '../hooks/useMusicMural.js';
import MuralForm from '../components/mural/MuralForm.jsx';
import MuralCard from '../components/mural/MuralCard.jsx';
import MuralStatus from '../components/mural/MuralStatus.jsx';
import { SectionHeader } from '../components/NavBar.jsx';
export default function MuralPage() {
  const { posts, external, status, busy, create, update, remove, reload } = useMusicMural();
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');
  async function save(payload) { if (edit) { await update(edit.id, payload); setEdit(null); } else await create(payload); }
  async function del(id) { try { setError(''); await remove(id); } catch(e) { setError(e.message); } }
  return <div className="space-y-8"><SectionHeader eyebrow="COMPARTILHE" title="Mural musical" subtitle="Indique músicas para iniciar conversas. Crie, consulte, edite e exclua suas recomendações."/>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(280px,390px)_1fr] items-start"><MuralForm edit={edit} busy={busy} onSave={save} onCancel={() => setEdit(null)} />
    <section aria-label="Minhas indicações"><h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white"><Database size={19} className="text-purple-300"/> Minhas indicações ({posts.length})</h2>{error && <p role="alert" className="text-red-300">{error}</p>}{posts.length ? <div className="grid gap-4 sm:grid-cols-2">{posts.map(post => <MuralCard key={post.id} post={post} onEdit={setEdit} onDelete={del}/>)}</div> : <div className="rounded-2xl border border-dashed border-[#4c3a60] p-8 text-center text-[#b6a9c6]">Nenhuma indicação ainda. Publique sua primeira música.</div>}</section></div>
    <section className="rounded-2xl border border-[#332c42] bg-[#15131f] p-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-lg font-semibold text-white"><Globe size={20} className="text-purple-300"/> Exemplos consultados em API externa</h2><button onClick={reload} className="inline-flex items-center gap-2 rounded-lg border border-[#514264] px-3 py-2 text-xs text-purple-200 hover:bg-purple-400/10"><RefreshCcw size={14}/> Atualizar GET</button></div><MuralStatus status={`${status} JSONPlaceholder é uma API pública de testes: POST, PATCH e DELETE são demonstrativos, não persistem no serviço externo. As suas indicações persistem neste navegador.`} connected={status.includes("conectada")}/><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{external.map(post => <MuralCard key={post.id} post={post} readOnly/>)}</div></section>
  </div>;
}
