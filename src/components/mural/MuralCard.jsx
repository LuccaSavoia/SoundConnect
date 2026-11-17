import { Music, Pencil, Trash2 } from 'lucide-react';
export default function MuralCard({ post, onEdit, onDelete, readOnly = false }) {
  return <article className="rounded-2xl border border-[#373045] bg-[#1b1928] p-5 shadow-lg shadow-black/10">
    <div className="mb-3 flex items-center justify-between"><div className="rounded-lg bg-purple-400/10 p-2 text-purple-300"><Music size={20}/></div><span className="text-[11px] text-[#978aa8]">{readOnly ? 'Exemplo da API externa' : 'Salvo neste navegador'}</span></div>
    <h3 className="mb-2 text-lg font-semibold text-white break-words">{post.title}</h3><p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#bcb4cb]">{post.body}</p>
    {!readOnly && <div className="mt-4 flex gap-2 border-t border-[#3b334a] pt-4"><button type="button" onClick={() => onEdit(post)} className="inline-flex items-center gap-2 rounded-lg border border-[#554367] px-3 py-2 text-xs text-purple-200 hover:bg-purple-500/10"><Pencil size={14}/> Editar</button><button type="button" onClick={() => { if(window.confirm('Excluir esta indicação?')) onDelete(post.id); }} className="inline-flex items-center gap-2 rounded-lg border border-[#6a3b58] px-3 py-2 text-xs text-rose-200 hover:bg-rose-500/10"><Trash2 size={14}/> Excluir</button></div>}
  </article>;
}
