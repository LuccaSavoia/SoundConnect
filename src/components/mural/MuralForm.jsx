import { useEffect, useState } from 'react';
export default function MuralForm({ edit, busy, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { setTitle(edit?.title || ''); setBody(edit?.body || ''); setError(''); }, [edit]);
  async function submit(event) {
    event.preventDefault(); setError('');
    try { await onSave({ title, body }); if (!edit) { setTitle(''); setBody(''); } }
    catch (exception) { setError(exception.message); }
  }
  return <form onSubmit={submit} className="rounded-2xl border border-[#41334f] bg-[#211b2e] p-5 space-y-4" aria-label="Criar ou editar indicação musical">
    <h3 className="text-lg font-bold text-white">{edit ? 'Editar indicação' : 'Nova indicação musical'}</h3>
    <label className="block text-sm text-[#c5b4d8]">Música, artista ou álbum
      <input required minLength={3} maxLength={90} value={title} onChange={event => setTitle(event.target.value)} className="mt-2 block w-full rounded-xl border border-[#554367] bg-[#12111d] p-3 text-white outline-none focus:border-purple-300" placeholder="Ex.: Meu álbum favorito" />
    </label>
    <label className="block text-sm text-[#c5b4d8]">Por que você recomenda?
      <textarea required minLength={3} maxLength={500} rows={3} value={body} onChange={event => setBody(event.target.value)} className="mt-2 block w-full rounded-xl border border-[#554367] bg-[#12111d] p-3 text-white outline-none focus:border-purple-300" placeholder="Conte o que torna essa música especial..." />
    </label>
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    <div className="flex flex-wrap gap-3"><button disabled={busy} className="rounded-xl bg-purple-300 px-5 py-3 text-sm font-bold text-[#20122e] hover:bg-purple-200 disabled:opacity-60" type="submit">{edit ? 'Salvar edição' : 'Publicar indicação'}</button>{edit && <button type="button" className="rounded-xl border border-[#554367] px-5 py-3 text-sm text-white" onClick={onCancel}>Cancelar</button>}</div>
  </form>;
}
