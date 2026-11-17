import test from 'node:test';
import assert from 'node:assert/strict';
import { listExternalPosts, createExternalPost, updateExternalPost, deleteExternalPost } from './externalPosts.js';

test('serviço externo emite GET, POST, PATCH e DELETE e processa 204', async () => {
  const oldFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options={}) => {
    calls.push({url, method: options.method || 'GET'});
    if ((options.method || 'GET') === 'DELETE') return new Response(null, {status: 204});
    return new Response(JSON.stringify(options.method ? {id:101, ok:true} : [{id:1,title:'Som',body:'Música'}]), {status: options.method === 'POST' ? 201 : 200, headers:{'content-type':'application/json'}});
  };
  try {
    assert.equal((await listExternalPosts())[0].title,'Som');
    await createExternalPost({title:'Uma música',body:'Gostei'});
    await updateExternalPost(1,{title:'Atualizada'});
    assert.deepEqual(await deleteExternalPost(1), {ok:true});
    assert.deepEqual(calls.map(x=>x.method), ['GET','POST','PATCH','DELETE']);
  } finally {global.fetch=oldFetch;}
});
