(function(){
'use strict';
const KEY='ancrx_v1_state';
const DIMENSIONS=[
{id:'direction',name:'Direction',layer:'Leadership Intelligence'},
{id:'financial',name:'Financial Strength',layer:'Leadership Intelligence'},
{id:'risk',name:'Risk Controls',layer:'Leadership Intelligence'},
{id:'human',name:'Human Intelligence',layer:'Leadership Intelligence'},
{id:'governance',name:'Governance',layer:'Operating Systems'},
{id:'workplace',name:'Workplace Dynamics',layer:'Operating Systems'},
{id:'capacity',name:'Carrying Capacity',layer:'Operating Systems'},
{id:'continuity',name:'Operational Continuity',layer:'Operating Systems'},
{id:'relationships',name:'Strategic Relationships',layer:'Operating Systems'}
];
const BASELINE_PROMPTS={
direction:'Priorities are clear and used to decide what the organization will and will not do.',
financial:'Leadership has enough financial visibility and stability to act before pressure becomes crisis.',
risk:'Material risks have owners, practical controls, and clear response actions.',
human:'Leadership judgments about people are based on evidence, context, empathy, direct dialogue, and emotional discipline.',
governance:'Authority, oversight, decision rights, and executive accountability are clear and consistently practiced.',
workplace:'People communicate, disagree, collaborate, and follow through effectively, especially under pressure.',
capacity:'Current commitments are realistic given available people, time, systems, and resources.',
continuity:'Essential work can continue when key people, knowledge, access, or vendors become unavailable.',
relationships:'Donor, partner, board, community, and champion relationships are maintained and strong enough to support the mission.'
};
const SCALE=[
{v:1,l:'Exposed',t:'This condition is unreliable and creates immediate risk.'},
{v:2,l:'Strained',t:'Some practices exist, but the condition breaks down under pressure.'},
{v:3,l:'Developing',t:'The condition is functional, with important gaps.'},
{v:4,l:'Reliable',t:'The condition works consistently in most situations.'},
{v:5,l:'Strong',t:'The condition is visible and dependable under pressure.'}
];
const CHANGES={
people:{name:'People',items:[
{id:'staff_unavailable',text:'A key person became unavailable.',effects:{capacity:-1,continuity:-2}},
{id:'role_confusion',text:'A role, expectation, or responsibility became unclear.',effects:{direction:-1,workplace:-1,governance:-1}},
{id:'behavior_concern',text:'A concern about someone’s behavior or performance emerged.',effects:{human:-1,workplace:-1},human:true},
{id:'people_improved',text:'A staffing, supervision, or teamwork condition improved.',effects:{human:1,workplace:1,capacity:1}}
]},
work:{name:'Work and priorities',items:[
{id:'work_added',text:'Significant work was added without removing or resourcing other work.',effects:{direction:-1,capacity:-2}},
{id:'deadline_risk',text:'An important deadline became at risk.',effects:{capacity:-1,continuity:-1}},
{id:'decision_blocked',text:'Work is blocked by an unresolved leadership or board decision.',effects:{direction:-1,governance:-1,capacity:-1}},
{id:'work_removed',text:'Work was completed, paused, reduced, reassigned, or removed.',effects:{direction:1,capacity:2}}
]},
money:{name:'Money',items:[
{id:'cash_worse',text:'Cash visibility, revenue certainty, or financial flexibility worsened.',effects:{financial:-2,risk:-1}},
{id:'unexpected_cost',text:'A significant unplanned cost appeared.',effects:{financial:-1,risk:-1}},
{id:'money_improved',text:'Revenue, cash visibility, or financial flexibility improved.',effects:{financial:2}}
]},
governance:{name:'Governance',items:[
{id:'board_added',text:'The board added or changed a priority without resolving the tradeoff.',effects:{governance:-2,direction:-1,capacity:-1}},
{id:'expectation_shift',text:'An executive expectation changed after work was already underway.',effects:{governance:-2,human:-1,workplace:-1}},
{id:'gov_resolved',text:'A governance decision, role boundary, or expectation was clarified.',effects:{governance:2,direction:1}}
]},
risk:{name:'Risk',items:[
{id:'risk_new',text:'A material risk emerged without a clear owner or response.',effects:{risk:-2,continuity:-1}},
{id:'control_failed',text:'A control, safeguard, or response plan failed.',effects:{risk:-2,continuity:-1}},
{id:'risk_controlled',text:'A risk received a clear owner, control, or response plan.',effects:{risk:2}}
]},
relationships:{name:'Relationships',items:[
{id:'relationship_risk',text:'A key donor, partner, board, or community relationship weakened.',effects:{relationships:-2}},
{id:'relationship_gain',text:'A strategic relationship strengthened or produced meaningful support.',effects:{relationships:2}}
]}
};
const DEFAULT={profile:null,adjustments:{},updates:[],decisions:[]};
let state=load();
let view='home';
let profileIndex=0;
let draftProfile={};
let selectedCategories=[];
let selectedChanges=[];
function load(){try{return Object.assign({},DEFAULT,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return {...DEFAULT};}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function score(id){const base=state.profile?.scores?.[id]||0;const adj=state.adjustments[id]||0;return Math.max(1,Math.min(5,base+adj*.25));}
function overall(){if(!state.profile)return 0;return DIMENSIONS.reduce((n,d)=>n+score(d.id),0)/DIMENSIONS.length;}
function conditionLabel(n){if(n>=4.25)return'Well positioned';if(n>=3.5)return'Generally reliable';if(n>=2.75)return'Under pressure';if(n>=2)return'Strained';return'Immediate attention required';}
function weakest(){return [...DIMENSIONS].sort((a,b)=>score(a.id)-score(b.id))[0];}
function strongest(){return [...DIMENSIONS].sort((a,b)=>score(b.id)-score(a.id))[0];}
function decisionText(id){const map={capacity:'Decide what will pause, shrink, move, or receive additional resources.',direction:'Clarify the priority before adding more work.',financial:'Review near-term cash and decide what must change before pressure becomes crisis.',risk:'Assign an owner and define the first response action.',human:'Seek context and direct clarification before making a performance judgment.',governance:'Clarify who decides, what outcome is required, and what tradeoff the board accepts.',workplace:'Address the blocked conversation or unclear expectation directly.',continuity:'Name and prepare a backup for the most exposed critical function.',relationships:'Assign ownership for the relationship and make the next meaningful contact.'};return map[id];}
function header(active){return `<header class="shell topbar"><div class="brand">ANCR<span>X</span></div><nav class="nav"><button data-view="home" class="${active==='home'?'active':''}">Today</button><button data-view="update" class="${active==='update'?'active':''}">Update</button><button data-view="brief" class="${active==='brief'?'active':''}">Brief</button><button data-view="history" class="${active==='history'?'active':''}">History</button><button data-view="profile" class="${active==='profile'?'active':''}">Organization</button></nav></header>`;}
function home(){if(!state.profile)return landing();const w=weakest(),s=strongest(),o=overall();return `${header('home')}<section class="shell hero"><div class="focus-reveal"><p class="kicker">Today’s organizational condition</p><h1>${conditionLabel(o)}<em>${w.name} needs attention.</em></h1><p class="lead">ANCRX is tracking what changed, what is carrying too much weight, and what leadership should decide next.</p><div class="actions"><button class="button" data-view="update">Update what changed</button><button class="button secondary" data-view="brief">Open executive brief</button></div></div><div class="orbit focus-reveal" data-delay="2"><div class="orbit-ring"><div class="orbit-core">${Math.round(o*20)}</div></div></div></section><section class="shell section"><div class="condition focus-reveal"><aside class="condition-aside"><p class="kicker">Current condition</p><div class="score-ring" style="--score:${Math.round(o*20)}%"><span>${Math.round(o*20)}</span></div><p><strong>${conditionLabel(o)}</strong></p><p style="color:rgba(255,255,255,.75);line-height:1.5">Strongest: ${s.name}<br>Greatest pressure: ${w.name}</p></aside><div class="condition-main"><p class="kicker">Leadership decision</p><h2 class="section-title" style="color:var(--ink);font-size:clamp(2rem,4vw,3.5rem)">${decisionText(w.id)}</h2><div class="decision" style="margin-top:26px"><strong>Human Intelligence safeguard</strong>Context is not automatically an excuse. Before deciding that behavior reflects poor attitude, resistance, or weak performance, determine whether expectations, authority, resources, workload, disability, stress, or other relevant conditions change the facts or the response required.</div></div></div></section>`;}
function landing(){return `${header('home')}<section class="shell hero"><div class="focus-reveal"><p class="kicker">Organizational Intelligence System</p><h1>Know what your organization<em>can carry today.</em></h1><p class="lead">Build a one-time intelligence profile. Then record only what changes. ANCRX will show where strain is building and what leadership decision matters most.</p><div class="actions"><button class="button" data-view="profile">Build intelligence profile</button></div></div><div class="orbit focus-reveal" data-delay="2"><div class="orbit-ring"><div class="orbit-core">A</div></div></div></section><section class="shell section"><div class="grid three focus-reveal"><div><p class="kicker">01</p><h2 class="section-title">Establish the baseline.</h2></div><div><p class="kicker">02</p><h2 class="section-title">Record what changes.</h2></div><div><p class="kicker">03</p><h2 class="section-title">Make the next decision.</h2></div></div></section>`;}
function profile(){const d=DIMENSIONS[profileIndex],selected=draftProfile[d.id]||state.profile?.scores?.[d.id];return `${header('profile')}<section class="shell section"><div style="width:100%"><div class="stepper"><span style="width:${((profileIndex+1)/DIMENSIONS.length)*100}%"></span></div><div class="panel focus-reveal"><p class="kicker" style="color:var(--orange)">${d.layer} · ${profileIndex+1} of ${DIMENSIONS.length}</p><h2 class="section-title" style="color:var(--ink);font-size:clamp(2rem,4vw,3.5rem)">${d.name}</h2><p class="lead" style="color:#625c56">${BASELINE_PROMPTS[d.id]}</p><div class="choice-list">${SCALE.map(x=>`<button class="choice ${selected===x.v?'selected':''}" data-score="${x.v}"><strong>${x.l}</strong><br><span>${x.t}</span></button>`).join('')}</div><div class="actions"><button class="button secondary" id="profile-prev" ${profileIndex===0?'disabled':''}>Previous</button><button class="button" id="profile-next" ${!selected?'disabled':''}>${profileIndex===DIMENSIONS.length-1?'Save profile':'Continue'}</button></div></div></div></section>`;}
function update(){if(!state.profile)return profile();return `${header('update')}<section class="shell section"><div style="width:100%"><p class="kicker">Daily change update</p><h1 class="section-title">What changed since your last update?</h1><p class="lead">Select only the areas with a meaningful change.</p><div class="tag-row focus-reveal">${Object.entries(CHANGES).map(([id,c])=>`<button class="tag ${selectedCategories.includes(id)?'selected':''}" data-category="${id}">${c.name}</button>`).join('')}<button class="tag" id="nothing-changed">Nothing significant changed</button></div>${selectedCategories.length?`<div class="grid two" style="margin-top:28px">${selectedCategories.map(id=>`<div class="panel focus-reveal"><p class="kicker" style="color:var(--orange)">${CHANGES[id].name}</p><div class="choice-list">${CHANGES[id].items.map(x=>`<button class="choice ${selectedChanges.includes(x.id)?'selected':''}" data-change="${x.id}" data-category-id="${id}">${x.text}</button>`).join('')}</div></div>`).join('')}</div><div class="actions"><button class="button" id="save-update" ${!selectedChanges.length?'disabled':''}>Save today’s changes</button></div>`:''}</div></section>`;}
function brief(){if(!state.profile)return profile();const rows=DIMENSIONS.map(d=>({d,s:score(d.id)}));return `${header('brief')}<section class="shell section"><div style="width:100%"><p class="kicker">Executive Intelligence Brief</p><h1 class="section-title">Current organizational condition</h1><div class="grid two" style="margin-top:32px"><div class="panel dark focus-reveal"><p class="kicker">Leadership focus</p><h2 style="font-size:2rem">${weakest().name}</h2><p>${decisionText(weakest().id)}</p></div><div class="panel focus-reveal" data-delay="1">${rows.map(r=>`<div class="metric"><div><strong>${r.d.name}</strong><small>${r.d.layer}</small><div class="bar"><span style="width:${r.s*20}%"></span></div></div><span class="status">${r.s.toFixed(1)}</span></div>`).join('')}</div></div><div class="decision focus-reveal" style="margin-top:28px"><strong>Leadership observation</strong>Context does not eliminate accountability. It helps leadership apply accountability accurately.</div></div></section>`;}
function history(){const entries=[...state.updates].reverse();return `${header('history')}<section class="shell section"><div style="width:100%"><p class="kicker">Organizational history</p><h1 class="section-title">What changed, and what leadership did next.</h1><div class="timeline" style="margin-top:36px">${entries.length?entries.map(e=>`<article class="focus-reveal"><strong>${new Date(e.date).toLocaleDateString()}</strong><p>${e.summary}</p>${e.decision?`<p><em>Decision:</em> ${e.decision}</p>`:''}</article>`).join(''):'<div class="empty">No change history has been recorded yet.</div>'}</div></div></section>`;}
function bind(){document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;render();});document.querySelectorAll('[data-score]').forEach(b=>b.onclick=()=>{draftProfile[DIMENSIONS[profileIndex].id]=Number(b.dataset.score);render();});const prev=document.getElementById('profile-prev');if(prev)prev.onclick=()=>{if(profileIndex>0){profileIndex--;render();}};const next=document.getElementById('profile-next');if(next)next.onclick=()=>{if(profileIndex<DIMENSIONS.length-1){profileIndex++;render();}else{state.profile={scores:{...(state.profile?.scores||{}),...draftProfile},created:new Date().toISOString()};state.adjustments={};save();view='home';render();}};document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{const id=b.dataset.category;selectedCategories=selectedCategories.includes(id)?selectedCategories.filter(x=>x!==id):[...selectedCategories,id];selectedChanges=selectedChanges.filter(ch=>selectedCategories.some(c=>CHANGES[c].items.some(i=>i.id===ch)));render();});document.querySelectorAll('[data-change]').forEach(b=>b.onclick=()=>{const id=b.dataset.change;selectedChanges=selectedChanges.includes(id)?selectedChanges.filter(x=>x!==id):[...selectedChanges,id];render();});const nothing=document.getElementById('nothing-changed');if(nothing)nothing.onclick=()=>{state.updates.push({date:new Date().toISOString(),summary:'No significant organizational change was reported.'});save();view='home';render();};const saveBtn=document.getElementById('save-update');if(saveBtn)saveBtn.onclick=()=>{const effects={};let humanAlert=false;selectedChanges.forEach(id=>{Object.values(CHANGES).forEach(cat=>{const item=cat.items.find(i=>i.id===id);if(item){Object.entries(item.effects).forEach(([k,v])=>effects[k]=(effects[k]||0)+v);if(item.human)humanAlert=true;}});});Object.entries(effects).forEach(([k,v])=>state.adjustments[k]=(state.adjustments[k]||0)+v);const summary=selectedChanges.map(id=>Object.values(CHANGES).flatMap(c=>c.items).find(i=>i.id===id)?.text).filter(Boolean).join(' ');state.updates.push({date:new Date().toISOString(),summary,humanAlert});save();selectedCategories=[];selectedChanges=[];view='home';render();};requestAnimationFrame(()=>observeFocus());}
function observeFocus(){const items=document.querySelectorAll('.focus-reveal');if(matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(x=>x.classList.add('is-crisp'));return;}const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-crisp');}),{threshold:.38,rootMargin:'0px 0px -8% 0px'});items.forEach(x=>io.observe(x));}
function render(){const app=document.getElementById('ancrx-app');app.innerHTML=view==='home'?home():view==='profile'?profile():view==='update'?update():view==='brief'?brief():history();bind();window.scrollTo({top:0,behavior:'smooth'});}
document.addEventListener('DOMContentLoaded',render);
})();