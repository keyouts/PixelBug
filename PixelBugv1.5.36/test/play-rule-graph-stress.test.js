"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const vm=require("node:vm");
const runtime=require("../src/modules/play-rule-runtime.js");

function seeded(seed=12345) {let value=seed;return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}
const rnd=seeded();
const action=(type,data,next="")=>({id:`n-${type}`,type,data,next});
const standalone=vm.runInNewContext(runtime.standaloneSource);
const plain=record=>JSON.parse(JSON.stringify(record));

test("graph analyzer reports duplicates, missing edges, cycles and size limit",()=>{
  const nodes=[
    {id:"start",type:"eventStart",next:"branch"},
    {id:"branch",type:"logicCompareNumber",next:"answer",alt:"missing"},
    {id:"answer",type:"actionSetVariable",next:"branch"},
    {id:"answer",type:"actionFinish"}
  ];
  const issues=runtime.analyzeGraph(nodes);
  for(const kind of ["duplicate","dangling","cycle"])assert.ok(issues.some(x=>x.kind===kind),`Missed ${kind}`);
  assert.equal(runtime.analyzeGraph([{id:"start",next:"finish"},{id:"finish",next:""}]).length,0);
  assert.equal(runtime.analyzeGraph(Array.from({length:101},(_,i)=>({id:String(i)}))).some(x=>x.kind==="limit"),true);
  assert.equal(runtime.analyzeGraph("invalid")[0].kind,"invalid");
});

test("shared conditional predicates preserve Then/Else truth tables for all comparison operators",()=>{
  const operators=["=","!=","<","<=",">",">="];
  for(const l of [-2,-1,0,1,2,10])for(const r of [-2,-1,0,1,2,10])for(const operator of operators){
    const s={variables:{n:String(l)},inventory:[]};
    const node={id:"branch",type:"logicCompareNumber",next:"T",alt:"F",data:{variable:"n",compare:r,operator}};
    const result=runtime.evaluateNode(node,s);
    const expected=operator==="="?l===r:operator==="!="?l!==r:operator==="<"?l<r:operator==="<="?l<=r:operator===">"?l>r:l>=r;
    assert.equal(result.nextId,expected?"T":"F",`${l} ${operator} ${r}`);
    assert.equal(result.predicate.matched,expected);
    assert.deepEqual(s,{variables:{n:String(l)},inventory:[]});
  }
});

test("thousands of deterministic variable operations have identical native and exported semantics",()=>{
  const operations=["add","subtract","multiply","divide","modulo","set"];
  let state={variables:{n:"0"},inventory:[]};
  let exportState=plain(state);
  for(let i=0;i<6000;i++){
    const op=operations[Math.floor(rnd()*operations.length)];
    const operand=Math.floor(rnd()*41)-20;
    const n=action("actionMathNumber",{variable:"n",mathOperation:op,operand});
    const first=runtime.evaluateNode(n,state);
    const second=standalone.evaluateNode(n,exportState);
    assert.equal(first.state.variables.n,second.state.variables.n,`Step ${i}, ${op} ${operand}`);
    assert.ok(Number.isFinite(Number(first.state.variables.n)),`Nonfinite output at ${i}`);
    assert.ok(Math.abs(Number(first.state.variables.n))<=1e9,`Unbounded output at ${i}`);
    state=first.state;exportState=plain(second.state);
  }
  for(const amount of [1e200,-1e200,1e20,-1e20,Infinity,-Infinity,NaN]){
    const result=runtime.evaluateNode(action("actionChangeNumber",{variable:"n",amount}),state);
    assert.ok(Math.abs(Number(result.state.variables.n))<=1e9);
    assert.ok(Number.isFinite(Number(result.state.variables.n)));
  }
});

test("randomized acyclic rule graphs route deterministically under state changes",()=>{
  for(let iteration=0;iteration<700;iteration++){
    const nodes=[{id:"start",type:"eventStart",next:"set",data:{}}];
    nodes.push({id:"set",type:"actionSetVariable",next:"comparison",data:{variable:"score",value:Math.floor(rnd()*100)}});
    const value=Number(nodes[1].data.value);
    const expected=Math.floor(rnd()*100);
    nodes.push({id:"comparison",type:"logicCompareNumber",next:"true",alt:"false",data:{variable:"score",operator:">=",compare:expected}});
    nodes.push({id:"true",type:"actionAddItem",next:"end",data:{item:"win"}});
    nodes.push({id:"false",type:"actionAddItem",next:"end",data:{item:"lose"}});
    nodes.push({id:"end",type:"actionFinish",data:{message:"Done"}});
    assert.deepEqual(runtime.analyzeGraph(nodes),[]);
    let state={variables:{},inventory:[]},id="start",steps=0;
    while(id){
      assert.ok(steps++<runtime.MAX_RULE_STEPS);
      const result=runtime.evaluateNode(nodes.find(n=>n.id===id),state);
      state=result.state;id=result.nextId;
    }
    assert.deepEqual(state.inventory,[value>=expected?"win":"lose"]);
  }
});

test("inventory caps, value branches, scene matching, dice bounds and object safety",()=>{
  let state={variables:{},inventory:[]};
  for(let i=0;i<200;i++)state=runtime.evaluateNode(action("actionAddItem",{item:`item-${i}`}),state).state;
  assert.equal(state.inventory.length,64);
  assert.equal(new Set(state.inventory).size,64);
  const invalid=runtime.evaluateNode(action("actionSetVariable",{variable:"__proto__",value:"injection"}),state);
  assert.equal({}.injection,undefined);
  assert.ok(Object.hasOwn(invalid.state.variables,"flag"));
  for(const random of [0,.2,.5,.9999999,1,-100,Infinity,NaN]){
    const result=runtime.evaluateNode(action("actionRollNumber",{variable:"roll",rollMin:9,rollMax:2}),{}, {random:()=>random});
    const roll=Number(result.state.variables.roll);
    assert.ok(Number.isInteger(roll)&&roll>=2&&roll<=9);
  }
  const event={id:"trigger",type:"eventTrigger",data:{trigger:"door",sceneId:"a"}};
  assert.equal(runtime.eventMatches(event,"triggerEnter",{ids:["door"],sceneId:"a"},"a"),true);
  assert.equal(runtime.eventMatches(event,"triggerEnter",{ids:["door"],sceneId:"b"},"b"),false);
  const npc={id:"interaction",type:"eventInteract",data:{character:"guide",sceneId:"a"}};
  assert.equal(runtime.eventMatches(npc,"characterInteract",{id:"guide"},"a"),true);
  assert.equal(runtime.eventMatches(npc,"characterInteract",{id:"guide"},"b"),false);
});
