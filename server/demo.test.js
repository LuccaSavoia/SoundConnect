import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
test('modo experimental: entrar sem senha, conexão automática e conversa simulada',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'soundconnect-demo-'));
 const port=30000+Math.floor(Math.random()*20000);
 const child=spawn(process.execPath,['server/index.js'],{cwd:root,env:{...process.env,PORT:String(port),SOUNDCONNECT_DB:path.join(dir,'db.json')},stdio:'ignore'});
 const base=`http://127.0.0.1:${port}/api`;
 async function request(route,method='GET',body,token){const r=await fetch(base+route,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{'Authorization':`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});const json=await r.json();assert.ok(r.ok,`${route}: ${JSON.stringify(json)}`);return json}
 try{
  let ready=false;for(let i=0;i<70;i++){try{await request('/health');ready=true;break}catch{await new Promise(resolve=>setTimeout(resolve,70))}}assert.ok(ready,'API não iniciou');
  const auth=await request('/demo','POST',{visitorKey:crypto.randomBytes(24).toString('hex')});assert.equal(auth.user.name,'Visitante');assert.ok(auth.token);
  const people=(await request('/people','GET',undefined,auth.token)).people;assert.ok(people.length>=4);
  const connect=await request('/connections','POST',{userId:people[0].id},auth.token);assert.equal(connect.connection.status,'accepted');
  await request('/messages','POST',{userId:people[0].id,text:'Oi, tudo bem?'},auth.token);
  const chat=await request('/messages?userId='+people[0].id,'GET',undefined,auth.token);assert.equal(chat.messages.length,2);assert.equal(chat.messages[1].simulated,true);
  const refreshed=await request('/demo','POST',{visitorKey:auth.user.email?'not_valid_here':'not_valid_here'}).catch(()=>null);assert.equal(refreshed,null);
 }finally{child.kill();rmSync(dir,{recursive:true,force:true})}
});
