import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'soundconnect-test-'));
const port=38000+Math.floor(Math.random()*2000);
const base=`http://127.0.0.1:${port}/api`;
const child=spawn(process.execPath,['server/index.js'],{cwd:path.resolve('..',path.basename(path.resolve('.'))),env:{...process.env,PORT:String(port),SOUNDCONNECT_DB:path.join(tmp,'db.json')},stdio:'pipe'});
async function request(route,method='GET',body,token){const res=await fetch(base+route,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:res.status,data:await res.json()};}
async function ready(){for(let i=0;i<50;i++){try{const r=await request('/health');if(r.status===200)return;}catch{}await new Promise(r=>setTimeout(r,80));}throw new Error('Servidor não inicializou');}
test('fluxo completo com cadastro, login, recomendações, conexões, mensagens e playlist',async()=>{try{
 await ready();
 const a=await request('/register','POST',{name:'Teste A',email:'a@example.org',password:'senha1234'});
 const b=await request('/register','POST',{name:'Teste B',email:'b@example.org',password:'senha5678'});
 assert.equal(a.status,201);assert.equal(b.status,201);
 const ta=a.data.token,tb=b.data.token,ua=a.data.user.id,ub=b.data.user.id;
 const bad=await request('/login','POST',{email:'a@example.org',password:'errada'});assert.equal(bad.status,401);
 const updA=await request('/me','PATCH',{artists:['Arctic Monkeys','Tame Impala'],genre:'Rock',age:23},ta);
 const updB=await request('/me','PATCH',{artists:['Arctic Monkeys','Lana Del Rey'],genre:'Indie'},tb);
 assert.equal(updA.status,200);assert.equal(updB.status,200);
 const people=await request('/people','GET',undefined,ta);const match=people.data.people.find(p=>p.id===ub);
 assert.deepEqual(match.shared,['Arctic Monkeys']);assert.equal(match.score,33);
 const invite=await request('/connections','POST',{userId:ub},ta);assert.equal(invite.status,201);
 const before=await request('/messages','POST',{userId:ub,text:'oi'},ta);assert.equal(before.status,403);
 const recv=await request('/connections','GET',undefined,tb);assert.equal(recv.data.connections[0].direction,'received');
 const acc=await request(`/connections/${invite.data.connection.id}/accept`,'POST',{},tb);assert.equal(acc.status,200);
 const sent=await request('/messages','POST',{userId:ub,text:'E aí!'},ta);assert.equal(sent.status,201);
 const messages=await request(`/messages?userId=${ua}`,'GET',undefined,tb);assert.equal(messages.data.messages[0].text,'E aí!');
 const playlist=await request('/playlists','POST',{title:'Nossa vibe'},ta);assert.equal(playlist.status,201);
 const track=await request(`/playlists/${playlist.data.playlist.id}/tracks`,'POST',{title:'505',artist:'Arctic Monkeys'},tb);assert.equal(track.status,201);
 const lists=await request('/playlists','GET',undefined,tb);assert.equal(lists.data.playlists[0].tracks.length,1);
 const block=await request('/block','POST',{userId:ub},ta);assert.equal(block.status,200);
 const after=await request('/messages','POST',{userId:ua,text:'oi'},tb);assert.equal(after.status,403);
 const persisted=JSON.parse(fs.readFileSync(path.join(tmp,'db.json'),'utf8'));assert.ok(persisted.messages.length>=1);
}finally{child.kill();fs.rmSync(tmp,{recursive:true,force:true});}});
