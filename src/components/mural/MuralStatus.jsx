import { Wifi, WifiOff } from 'lucide-react';
/** Componente somente visual: a regra de disponibilidade reside no hook. */
export default function MuralStatus({ status, connected }) {
  const Icon = connected ? Wifi : WifiOff;
  return <div role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-[#41344d] bg-[#20192a] px-4 py-3 text-xs text-[#d5c7e3]"><Icon size={17} className="shrink-0 text-purple-300"/>{status}</div>;
}
