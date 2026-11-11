import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILE = process.env.SOUNDCONNECT_DB || path.join(HERE, 'data.json');
const ROOT = path.resolve(HERE, '..', 'dist');
const PORT = Number(process.env.PORT || 3001);
const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const norm = (v) => String(v || '').trim().toLocaleLowerCase('pt-BR');
const clean = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const encodePassword = password => { const salt = crypto.randomBytes(16).toString('hex'); return salt + ':' + crypto.scryptSync(password, salt, 64).toString('hex'); };
const matchPassword = (password, stored) => {const [salt, hash] = (stored || '').split(':'); if (!salt || !hash) return false; const calculated = crypto.scryptSync(password, salt, 64); const expected = Buffer.from(hash,'hex'); return expected.length===calculated.length && crypto.timingSafeEqual(calculated, expected);};
const initialArtists = ['Arctic Monkeys','Lana Del Rey','Tame Impala','The Strokes'];
function seed() {
  const seeds = [
    ['Lara','lara@demo.local',23,'Vila Mariana',['Arctic Monkeys','The Neighbourhood','Lana Del Rey'],'Gosto de descobrir músicas novas e conversar sobre letras.','Indie'],
    ['Gabriel','gabriel@demo.local',25,'Pinheiros',['Tame Impala','Arctic Monkeys','The Strokes'],'Shows, cafés e playlists para cada momento.','Rock'],
    ['Bia','bia@demo.local',22,'Consolação',['Lana Del Rey','Billie Eilish','Cigarettes After Sex'],'Sou tímida no começo, mas música sempre rende assunto.','Pop'],
    ['Rafa','rafa@demo.local',24,'Moema',['Radiohead','The Strokes','Arctic Monkeys'],'Sempre atrás de novas recomendações.','Alternativo']
  ];
  return {users:seeds.map(([name,email,age,location,artists,bio,genre])=>({id:uid(),name,email,age,location,artists,bio,genre,password:encodePassword('demo1234'),demoProfile:true,createdAt:now()})),sessions:[],connections:[],messages:[],blocks:[],reports:[],playlists:[]};
}
function readDb(){if(!fs.existsSync(FILE)){const db=seed();writeDb(db);return db;}return JSON.parse(fs.readFileSync(FILE,'utf8'));}
function writeDb(db){fs.mkdirSync(path.dirname(FILE),{recursive:true});const tmp=FILE+'.tmp';fs.writeFileSync(tmp,JSON.stringify(db,null,2),{mode:0o600});fs.renameSync(tmp,FILE);}
function publicUser(u){return {id:u.id,name:u.name,age:u.age,location:u.location,artists:u.artists,bio:u.bio,genre:u.genre,createdAt:u.createdAt};}
function ownUser(u){return {...publicUser(u),email:u.email};}
function affinity(a,b){const own=new Set(a.artists.map(norm));const shared=b.artists.filter(x=>own.has(norm(x)));const union=new Set([...a.artists,...b.artists].map(norm)).size;const score=union?Math.round(100*shared.length/union):0;return {score,shared};}
const respond=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
const error=(res,status,message)=>respond(res,status,{error:message});
const other=(c,id)=>c.from===id?c.to:c.from;
const isBlocked=(db,a,b)=>db.blocks.some(x=>(x.by===a&&x.target===b)||(x.by===b&&x.target===a));
const canChat=(db,a,b)=>db.connections.some(c=>c.status==='accepted' && ((c.from===a&&c.to===b)||(c.to===a&&c.from===b)))&&!isBlocked(db,a,b);
function sanitizeArtists(value){if(!Array.isArray(value))return null;return [...new Map(value.map(x=>clean(x,55)).filter(Boolean).slice(0,25).map(x=>[norm(x),x])).values()];}
async function parseBody(req){let raw='';for await(const part of req){raw+=part;if(raw.length>32768)throw Object.assign(new Error('Dados muito grandes.'),{status:413});}try{return JSON.parse(raw||'{}')}catch{throw Object.assign(new Error('JSON inválido.'),{status:400})}}
function sessionUser(db,req){const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');if(!token)return null;const hash=crypto.createHash('sha256').update(token).digest('hex');const s=db.sessions.find(x=>x.hash===hash && Date.parse(x.expires)>Date.now());return s ? db.users.find(x=>x.id===s.userId):null;}
function makeSession(db,u){const token=crypto.randomBytes(32).toString('hex');db.sessions.push({hash:crypto.createHash('sha256').update(token).digest('hex'),userId:u.id,expires:new Date(Date.now()+7*86400000).toISOString()});return token;}
async function handler(req,res){
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE','Access-Control-Allow-Headers':'Authorization,Content-Type'});return res.end();}
  const url=new URL(req.url,'http://localhost');const route=url.pathname;let db;
  try{
    if(route==='/api/health')return respond(res,200,{ok:true});
    if(!route.startsWith('/api/')){
      if(req.method!=='GET'&&req.method!=='HEAD')return error(res,405,'Método não permitido.');
      let fp=path.resolve(ROOT,'.'+(route==='/'?'/index.html':route));if(!fp.startsWith(ROOT+path.sep)&&fp!==path.join(ROOT,'index.html'))return error(res,403,'Acesso negado.');
      if(!fs.existsSync(fp)||fs.statSync(fp).isDirectory())fp=path.join(ROOT,'index.html');
      if(!fs.existsSync(fp))return error(res,404,'Interface não compilada. Use npm run dev para desenvolvimento.');
      const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};res.writeHead(200,{'Content-Type':types[path.extname(fp)]||'application/octet-stream'});return fs.createReadStream(fp).pipe(res);
    }
    db=readDb();
    if(route==='/api/demo'&&req.method==='POST'){
      const b=await parseBody(req);
      // Sessão experimental por navegador, sem identificação pessoal.
      const key=clean(b.visitorKey,100);
      if(!/^[a-zA-Z0-9_-]{16,100}$/.test(key))return error(res,400,'Identificador experimental inválido.');
      const email=`demo-${crypto.createHash('sha256').update(key).digest('hex')}@soundconnect.invalid`;
      let u=db.users.find(x=>x.email===email);
      if(!u){u={id:uid(),name:'Visitante',email,age:null,location:'São Paulo, SP',artists:[...initialArtists],bio:'Explorando novas amizades pela música.',genre:'Indie',demoVisitor:true,createdAt:now()};db.users.push(u)}
      const token=makeSession(db,u);writeDb(db);return respond(res,200,{token,user:ownUser(u)});
    }
    if(route==='/api/register'&&req.method==='POST'){
      const b=await parseBody(req);const email=norm(b.email);const name=clean(b.name,70);const password=String(b.password||'');
      if(name.length<2||!/^\S+@\S+\.\S+$/.test(email)||password.length<8)return error(res,400,'Informe nome, e-mail válido e senha com pelo menos 8 caracteres.');
      if(db.users.some(x=>x.email===email))return error(res,409,'Este e-mail já foi cadastrado.');
      const u={id:uid(),name,email,password:encodePassword(password),age:null,location:'São Paulo, SP',artists:[],bio:'Aqui para conhecer pessoas pela música.',genre:'Outros',createdAt:now()};db.users.push(u);const token=makeSession(db,u);writeDb(db);return respond(res,201,{token,user:ownUser(u)});
    }
    if(route==='/api/login'&&req.method==='POST'){
      const b=await parseBody(req);const u=db.users.find(x=>x.email===norm(b.email));if(!u||!matchPassword(String(b.password||''),u.password))return error(res,401,'E-mail ou senha incorretos.');const token=makeSession(db,u);writeDb(db);return respond(res,200,{token,user:ownUser(u)});
    }
    const me=sessionUser(db,req);if(!me)return error(res,401,'Faça login para continuar.');
    if(route==='/api/logout'&&req.method==='POST'){const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');const hash=crypto.createHash('sha256').update(token).digest('hex');db.sessions=db.sessions.filter(x=>x.hash!==hash);writeDb(db);return respond(res,200,{ok:true});}
    if(route==='/api/me'&&req.method==='GET')return respond(res,200,{user:ownUser(me)});
    if(route==='/api/me'&&req.method==='PATCH'){
      const b=await parseBody(req);if(b.name!==undefined){if(clean(b.name,70).length<2)return error(res,400,'O nome precisa ter pelo menos dois caracteres.');me.name=clean(b.name,70)}
      if(b.age!==undefined){if(b.age!==null&&(!Number.isInteger(Number(b.age))||Number(b.age)<18||Number(b.age)>110))return error(res,400,'O aplicativo é destinado a maiores de 18 anos.');me.age=b.age===null?null:Number(b.age)}
      if(b.location!==undefined)me.location=clean(b.location,90);
      if(b.bio!==undefined)me.bio=clean(b.bio,350);
      if(b.genre!==undefined)me.genre=clean(b.genre,50);
      if(b.artists!==undefined){const artists=sanitizeArtists(b.artists);if(!artists)return error(res,400,'Lista de artistas inválida.');me.artists=artists;}
      writeDb(db);return respond(res,200,{user:ownUser(me)});
    }
    if(route==='/api/people'&&req.method==='GET'){
      const people=db.users.filter(u=>u.id!==me.id&&!isBlocked(db,me.id,u.id)).map(u=>({...publicUser(u),...affinity(me,u),connection:db.connections.find(c=>other(c,me.id)===u.id&&[c.from,c.to].includes(me.id))||null})).map(p=>({...p,connection:p.connection?{id:p.connection.id,status:p.connection.status,direction:p.connection.from===me.id?'sent':'received'}:null})).sort((a,b)=>b.score-a.score);
      return respond(res,200,{people});
    }
    if(route==='/api/connections'&&req.method==='GET')return respond(res,200,{connections:db.connections.filter(c=>(c.from===me.id||c.to===me.id)&&!isBlocked(db,c.from,c.to)).map(c=>({...c,person:publicUser(db.users.find(u=>u.id===other(c,me.id))),direction:c.from===me.id?'sent':'received'}))});
    if(route==='/api/connections'&&req.method==='POST'){
      const b=await parseBody(req);const to=db.users.find(u=>u.id===b.userId&&u.id!==me.id);if(!to)return error(res,404,'Pessoa não encontrada.');if(isBlocked(db,me.id,to.id))return error(res,403,'Conexão indisponível.');
      if(db.connections.some(c=>[c.from,c.to].includes(me.id)&&[c.from,c.to].includes(to.id)))return error(res,409,'Solicitação já existente.');
      const autoAccept=Boolean(me.demoVisitor&&to.demoProfile);const c={id:uid(),from:me.id,to:to.id,status:autoAccept?'accepted':'pending',createdAt:now(),...(autoAccept?{acceptedAt:now()}: {})};db.connections.push(c);writeDb(db);return respond(res,201,{connection:c});
    }
    const connMatch=route.match(/^\/api\/connections\/([^/]+)\/(accept|reject|cancel)$/);
    if(connMatch&&req.method==='POST'){
      const c=db.connections.find(x=>x.id===connMatch[1]);if(!c)return error(res,404,'Conexão não encontrada.');const action=connMatch[2];
      if(action==='accept'&&c.to===me.id&&c.status==='pending'){c.status='accepted';c.acceptedAt=now();}
      else if(action==='reject'&&c.to===me.id&&c.status==='pending'){db.connections=db.connections.filter(x=>x.id!==c.id)}
      else if(action==='cancel'&&[c.from,c.to].includes(me.id)){db.connections=db.connections.filter(x=>x.id!==c.id)}
      else return error(res,403,'Ação não permitida.');writeDb(db);return respond(res,200,{ok:true});
    }
    if(route==='/api/messages'&&req.method==='GET'){
      const userId=url.searchParams.get('userId');if(!canChat(db,me.id,userId))return error(res,403,'Aceitem a conexão para conversar.');return respond(res,200,{messages:db.messages.filter(m=>(m.from===me.id&&m.to===userId)||(m.to===me.id&&m.from===userId)).slice(-200)});
    }
    if(route==='/api/messages'&&req.method==='POST'){
      const b=await parseBody(req);if(!canChat(db,me.id,b.userId))return error(res,403,'Aceitem a conexão para conversar.');const content=clean(b.text,1500);if(!content)return error(res,400,'Digite uma mensagem.');const m={id:uid(),from:me.id,to:b.userId,text:content,createdAt:now()};db.messages.push(m);
      const recipient=db.users.find(u=>u.id===b.userId);
      if(me.demoVisitor&&recipient?.demoProfile){
        const replies=['Que legal! Também gosto muito desse artista. Qual música você recomenda?', 'Música é uma ótima forma de conhecer gente nova. Qual álbum você mais escuta?', 'Adorei a indicação! Você já foi a algum show desse estilo?', 'Boa! Vou colocar na minha playlist. Tem mais alguma sugestão?'];
        const previous=db.messages.filter(x=>x.from===recipient.id&&x.to===me.id).length;
        db.messages.push({id:uid(),from:recipient.id,to:me.id,text:replies[previous%replies.length],createdAt:now(),simulated:true});
      }
      writeDb(db);return respond(res,201,{message:m});
    }
    if(route==='/api/playlists'&&req.method==='GET')return respond(res,200,{playlists:db.playlists.filter(p=>p.owner===me.id||canChat(db,me.id,p.owner))});
    if(route==='/api/playlists'&&req.method==='POST'){
      const b=await parseBody(req);const title=clean(b.title,90);if(!title)return error(res,400,'Informe um nome para a playlist.');const p={id:uid(),owner:me.id,title,tracks:[],createdAt:now()};db.playlists.push(p);writeDb(db);return respond(res,201,{playlist:p});
    }
    const playlistMatch=route.match(/^\/api\/playlists\/([^/]+)\/tracks$/);
    if(playlistMatch&&req.method==='POST'){
      const p=db.playlists.find(x=>x.id===playlistMatch[1]);if(!p||!(p.owner===me.id||canChat(db,me.id,p.owner)))return error(res,403,'Playlist indisponível.');const b=await parseBody(req);const artist=clean(b.artist,80),title=clean(b.title,100);if(!artist||!title)return error(res,400,'Informe música e artista.');p.tracks.push({id:uid(),artist,title,addedBy:me.id});writeDb(db);return respond(res,201,{playlist:p});
    }
    if(route==='/api/block'&&req.method==='POST'){
      const b=await parseBody(req);if(!db.users.some(u=>u.id===b.userId&&u.id!==me.id))return error(res,404,'Pessoa não encontrada.');if(!db.blocks.some(x=>x.by===me.id&&x.target===b.userId))db.blocks.push({by:me.id,target:b.userId,createdAt:now()});db.connections=db.connections.filter(c=>!([c.from,c.to].includes(me.id)&&[c.from,c.to].includes(b.userId)));writeDb(db);return respond(res,200,{ok:true});
    }
    if(route==='/api/report'&&req.method==='POST'){
      const b=await parseBody(req);if(!db.users.some(u=>u.id===b.userId&&u.id!==me.id))return error(res,404,'Pessoa não encontrada.');const reason=clean(b.reason,500);if(reason.length<5)return error(res,400,'Descreva o motivo da denúncia.');db.reports.push({id:uid(),reporter:me.id,target:b.userId,reason,createdAt:now()});writeDb(db);return respond(res,201,{ok:true});
    }
    return error(res,404,'Rota não encontrada.');
  }catch(e){console.error(e);return error(res,e.status||500,e.status?e.message:'Ocorreu um erro no servidor.');}
}
const server=http.createServer(handler);
if(process.env.NODE_ENV!=='test')server.listen(PORT,()=>console.log(`SoundConnect API: http://localhost:${PORT}`));
export {server,affinity};
