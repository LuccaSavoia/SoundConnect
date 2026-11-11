const KEY='soundconnect-token';
export const getToken=()=>localStorage.getItem(KEY);
export const setToken=t=>t?localStorage.setItem(KEY,t):localStorage.removeItem(KEY);
export async function api(route,{method='GET',body,token=getToken()}={}){
  let response;
  try{response=await fetch('/api'+route,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});}
  catch{throw new Error('Servidor indisponível. Execute npm run server em outro terminal.');}
  const data=await response.json().catch(()=>null);
  if(!data){throw new Error('A API não respondeu corretamente. Confirme que você iniciou o projeto com npm run dev na pasta atual.');}
  if(!response.ok)throw new Error(data.error||'Não foi possível concluir a operação.');
  return data;
}
