"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs/promises");
const os=require("node:os");
const path=require("node:path");
const Guard=require("../src/modules/project-guard.js");
const Editor=require("../src/modules/play-editor-session.js");
const Session=require("../src/modules/play-session-state.js");
const Transaction=require("../src/main/file-transactions.js");

function makeEditor(projectId, title="Same title") {
  const pm={activeSceneId:"stage",worldType:"sidescroller",scenes:[{id:"stage",worldType:"sidescroller"}],
    nodeEditor:{runtime:{variables:{},inventory:[]}}};
  return Editor.create({projectId:()=>projectId,title:()=>title,playMode:()=>pm,running:()=>true,
    actor:()=>({x:0,y:0}),camera:()=>({}),rules:()=>null,dialogue:()=>({}),
    checkpoint:()=>null,message:()=>"",finished:()=>false,tick:()=>0,entered:()=>[],
    container:()=>null,document:{},window:{}});
}

test("save slot identity follows project ID rather than editable title or scene name",()=>{
  const first=makeEditor("project-00000000-1111-2222-3333-444444444444","A");
  const renamed=makeEditor("project-00000000-1111-2222-3333-444444444444","B");
  const different=makeEditor("project-99999999-1111-2222-3333-444444444444","A");
  assert.equal(first.gameId(),renamed.gameId());
  assert.notEqual(first.gameId(),different.gameId());
  const memory=new Map(), storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
  const a=Session.createStorage(storage,first.gameId());
  a.save(1,{sceneId:"stage",mode:"sidescroller",actor:{x:7}},first.modes());
  assert.equal(Session.createStorage(storage,renamed.gameId()).load(1,renamed.modes()).actor.x,7);
  assert.equal(Session.createStorage(storage,different.gameId()).load(1,different.modes()),null);
});

test("legacy projects migrate in place without losing an established project ID",()=>{
  const legacy={name:"Legacy Game",size:16,frames:[{layers:[{pixels:[[null]]}]}]};
  Guard.prepare(legacy);
  assert.equal(legacy.schemaVersion,Guard.SCHEMA_VERSION);
  assert.equal(legacy.width,16);assert.equal(legacy.height,16);
  const current={...legacy,projectId:"project-1234567890abcdef"};
  Guard.prepare(current);
  assert.equal(current.projectId,"project-1234567890abcdef");
  assert.throws(()=>Guard.prepare({...current,schemaVersion:999}),/version is not supported/);
});

test("storage quota errors do not erase the last valid save slot",()=>{
  const values=new Map();let attempts=0;
  const memory={
    getItem:key=>values.get(key)||null,
    setItem:(key,value)=>{if(++attempts===2){const error=new Error("Quota exceeded");error.name="QuotaExceededError";throw error;}values.set(key,value);},
    removeItem:key=>values.delete(key)
  };
  const modes={stage:"sidescroller"};
  const store=Session.createStorage(memory,"project-unique");
  store.save(1,{sceneId:"stage",actor:{x:10}},modes);
  assert.throws(()=>store.save(1,{sceneId:"stage",actor:{x:99}},modes),/Quota exceeded/);
  assert.equal(store.load(1,modes).actor.x,10);
});

test("multi-file transaction rolls back after the second install fails",async()=>{
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),"pb-rollback-"));
  const first=path.join(directory,"one.json"),second=path.join(directory,"two.json");
  await fs.writeFile(first,"OLD-ONE");await fs.writeFile(second,"OLD-TWO");
  const native=fs.rename;let failed=false;
  fs.rename=async (from,to)=>{
    if(!failed&&to===second&&from.includes(".pending-")){failed=true;const error=new Error("Simulated disk-full");error.code="ENOSPC";throw error;}
    return native(from,to);
  };
  try {
    await assert.rejects(Transaction.writeFilesTransaction([{filePath:first,payload:"NEW-ONE"},{filePath:second,payload:"NEW-TWO"}]),/Simulated disk-full/);
    assert.equal(await fs.readFile(first,"utf8"),"OLD-ONE");
    assert.equal(await fs.readFile(second,"utf8"),"OLD-TWO");
    assert.deepEqual((await fs.readdir(directory)).sort(),["one.json","two.json"]);
  }finally{fs.rename=native;await fs.rm(directory,{recursive:true,force:true});}
});

test("transaction staging failures preserve existing files",async()=>{
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),"pb-stage-"));
  const target=path.join(directory,"original.dat");await fs.writeFile(target,"ORIGINAL");
  const native=fs.open;let failed=false;
  fs.open=async (location,...args)=>{
    if(!failed&&String(location).includes(".pending-")){failed=true;const error=new Error("No space");error.code="ENOSPC";throw error;}
    return native(location,...args);
  };
  try{
    await assert.rejects(Transaction.writeFileAtomic(target,"REPLACEMENT"),/No space/);
    assert.equal(await fs.readFile(target,"utf8"),"ORIGINAL");
    assert.deepEqual(await fs.readdir(directory),["original.dat"]);
  }finally{fs.open=native;await fs.rm(directory,{recursive:true,force:true});}
});
