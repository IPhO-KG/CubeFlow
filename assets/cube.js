/* Cube geometry adapted from Emir Anaraly's Cube AI Lab 3D. No dependencies. */
(function(root){
'use strict';
const normals={U:[0,1,0],D:[0,-1,0],F:[0,0,1],B:[0,0,-1],R:[1,0,0],L:[-1,0,0]};
const colors={U:'#ebc965',D:'#f4f0e6',F:'#72977b',B:'#7697bd',R:'#c97563',L:'#d69c5e'};
const rules={U:[1,[1],-1],D:[1,[-1],1],R:[0,[1],-1],L:[0,[-1],1],F:[2,[1],-1],B:[2,[-1],1],M:[0,[0],1],E:[1,[0],1],S:[2,[0],-1],x:[0,[-1,0,1],-1],y:[1,[-1,0,1],-1],z:[2,[-1,0,1],-1],r:[0,[0,1],-1],l:[0,[-1,0],1],u:[1,[0,1],-1],d:[1,[-1,0],1],f:[2,[0,1],-1],b:[2,[-1,0],1]};
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,n)=>a.map(v=>v*n);
function rotate(v,axis,a){let [x,y,z]=v,c=Math.cos(a),s=Math.sin(a);return axis===0?[x,y*c-z*s,y*s+z*c]:axis===1?[x*c+z*s,y,-x*s+z*c]:[x*c-y*s,x*s+y*c,z];}
function parse(alg){if(Array.isArray(alg))return alg.slice();let clean=String(alg||'').replace(/[’′`]/g,"'").replace(/([URFDLB])w/g,(_,f)=>f.toLowerCase()).replace(/[()\[\]]/g,' ').replace(/2'/g,'2');let tokens=clean.trim().split(/\s+/).filter(Boolean);for(const t of tokens)if(!/^[URFDLBMESxyzurfdlb](2|')?$/.test(t))throw new Error('Неизвестный ход: '+t);return tokens;}
const inverse=tokens=>parse(tokens).reverse().map(t=>t.endsWith('2')?t:t.endsWith("'")?t.slice(0,-1):t+"'");
function rule(token){const [axis,layers,dir]=rules[token[0]];return{axis,layers,angle:dir*(token.endsWith("'")?-1:1)*(token.endsWith('2')?Math.PI:Math.PI/2)};}
class Cube{
 constructor(){this.reset();}
 reset(){this.pieces=[];for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){let p=[x,y,z],stickers=[];for(const [color,n]of Object.entries(normals))if(dot(n,p)===1)stickers.push({color,n:n.slice()});this.pieces.push({p,stickers});}return this;}
 clone(){const c=new Cube();c.pieces=JSON.parse(JSON.stringify(this.pieces));return c;}
 turn(token){const {axis,layers,angle}=rule(token);for(const c of this.pieces)if(layers.includes(c.p[axis])){c.p=rotate(c.p,axis,angle).map(Math.round);c.stickers.forEach(s=>s.n=rotate(s.n,axis,angle).map(Math.round));}return this;}
 apply(alg){parse(alg).forEach(t=>this.turn(t));return this;}
 sticker(p,n){const c=this.pieces.find(c=>c.p.every((v,i)=>v===p[i]));return c?.stickers.find(s=>dot(s.n,n)===1)?.color;}
 centers(){return Object.fromEntries(Object.entries(normals).map(([f,n])=>[f,this.sticker(n,n)]));}
 solved(){const centers=this.centers();return this.pieces.every(c=>c.stickers.every(s=>s.color===centers[Object.keys(normals).find(f=>dot(s.n,normals[f])===1)]));}
 isPLL(){const ce=this.centers();return this.pieces.every(c=>c.stickers.every(s=>{const face=Object.keys(normals).find(f=>dot(s.n,normals[f])===1);return c.p[1]<1||face==='U'?s.color===ce[face]:true;}));}
 key(){return this.pieces.flatMap(c=>c.stickers.map(s=>c.p.join(',')+':'+s.n.join(',')+':'+s.color)).sort().join('|');}
 caseKey(){let keys=[];for(let y=0;y<4;y++)for(let u=0;u<4;u++){let c=this.clone();for(let j=0;j<y;j++)c.turn('y');for(let j=0;j<u;j++)c.turn('U');const ce=c.centers(),labels=Object.fromEntries(Object.entries(ce).map(([f,color])=>[color,f]));keys.push(c.pieces.flatMap(p=>p.stickers.map(s=>p.p.join(',')+':'+s.n.join(',')+':'+labels[s.color])).sort().join('|'));}return keys.sort()[0];}
}
const bases=Object.values(normals).map(n=>({n,u:Math.abs(n[1])===1?[1,0,0]:Math.abs(n[0])===1?[0,0,1]:[1,0,0],v:Math.abs(n[1])===1?[0,0,1]:[0,1,0]}));
class Player{
 constructor(canvas,{mini=false,onChange=()=>{}}={}){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.mini=mini;this.onChange=onChange;this.yaw=-.57;this.pitch=.48;this.speed=1;this.plan=[];this.index=0;this.playing=false;this.anim=null;this.cube=new Cube();this.dirty=true;this.disposed=false;this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(canvas);if(!mini)this.attach();this.frame=this.frame.bind(this);this.raf=requestAnimationFrame(this.frame);}
 resize(){let r=this.canvas.getBoundingClientRect();this.w=r.width;this.h=r.height;let d=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.w*d);this.canvas.height=Math.round(this.h*d);this.ctx.setTransform(d,0,0,d,0,0);this.dirty=true;}
 setAlgorithm(alg){this.playing=false;this.anim=null;this.plan=parse(alg);this.start=new Cube().apply(inverse(this.plan));this.cube=this.start.clone();this.index=0;this.dirty=true;this.changed();}
 changed(){this.onChange(this.index,this.plan.length,this.playing);}
 play(){if(!this.plan.length)return;if(this.index===this.plan.length)this.seek(0);this.playing=!this.playing;this.changed();}
 seek(index){this.anim=null;this.playing=false;this.index=Math.max(0,Math.min(this.plan.length,index));this.cube=this.start.clone().apply(this.plan.slice(0,this.index));this.dirty=true;this.changed();}
 step(dir){this.seek(this.index+dir);}
 resetView(){this.yaw=-.57;this.pitch=.48;this.dirty=true;}
 attach(){let drag=null;this.canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw:this.yaw,pitch:this.pitch};this.canvas.setPointerCapture(e.pointerId);});this.canvas.addEventListener('pointermove',e=>{if(!drag)return;this.yaw=drag.yaw+(e.clientX-drag.x)*.009;this.pitch=Math.max(-1.2,Math.min(1.2,drag.pitch+(e.clientY-drag.y)*.009));this.dirty=true;});const end=()=>drag=null;this.canvas.addEventListener('pointerup',end);this.canvas.addEventListener('pointercancel',end);}
 frame(now){if(this.disposed)return;const visible=this.canvas.getClientRects().length>0;if(visible){if(this.anim&&now-this.anim.start>=this.anim.duration){this.cube.turn(this.plan[this.index]);this.index++;this.anim=null;this.dirty=true;if(this.index===this.plan.length)this.playing=false;this.changed();}if(!this.anim&&this.playing&&this.index<this.plan.length)this.anim={start:now,duration:420/this.speed};if(this.dirty||this.anim){this.draw(now);this.dirty=false;}}this.raf=requestAnimationFrame(this.frame);}
 view(v){let q=rotate(v,1,this.yaw);return rotate(q,0,this.pitch);}
 project(v){let q=this.view(v),f=Math.min(this.w,this.h)*(this.mini?1.52:1.39)/(8.4-q[2]);return[this.w/2+q[0]*f,this.h*.5-q[1]*f,q[2]];}
 draw(now=performance.now()){const ctx=this.ctx;ctx.clearRect(0,0,this.w,this.h);const polys=[];let moving=this.anim?rule(this.plan[this.index]):null,t=this.anim?Math.min(1,(now-this.anim.start)/this.anim.duration):0;t=t*t*(3-2*t);for(const c of this.cube.pieces){const active=moving&&moving.layers.includes(c.p[moving.axis]);const tr=v=>active?rotate(v,moving.axis,moving.angle*t):v;const p=tr(c.p);for(const face of bases){const n=tr(face.n),u=tr(face.u),v=tr(face.v);if(this.view(n)[2]<.01)continue;const sticker=c.stickers.find(s=>dot(s.n,face.n)===1);const quad=(half,offset)=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>this.project(add(add(p,mul(n,offset)),add(mul(u,half*a),mul(v,half*b)))));const base=quad(.497,.5);polys.push({p:base,color:'#343935',depth:base.reduce((s,p)=>s+p[2],0)/4});if(sticker){let q=quad(.438,.506);polys.push({p:q,color:colors[sticker.color],depth:q.reduce((s,p)=>s+p[2],0)/4+.003});}}}polys.sort((a,b)=>a.depth-b.depth);for(const {p,color}of polys){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(v=>ctx.lineTo(v[0],v[1]));ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#343935';ctx.lineWidth=.6;ctx.stroke();}}
 dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.ro.disconnect();}
}
function diagram(alg,size=84){const c=new Cube().apply(inverse(alg)),tile=18,gap=2,start=23;let rects='';const rect=(x,y,w,h,color)=>rects+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${colors[color]||'#d8d9cd'}"/>`;for(let z=-1;z<=1;z++)for(let x=-1;x<=1;x++)rect(start+(x+1)*20,start+(z+1)*20,tile,tile,c.sticker([x,1,z],normals.U));for(let i=-1;i<=1;i++){rect(start+(i+1)*20,12,18,8,c.sticker([i,1,-1],normals.B));rect(start+(i+1)*20,84,18,8,c.sticker([i,1,1],normals.F));rect(12,start+(i+1)*20,8,18,c.sticker([-1,1,i],normals.L));rect(84,start+(i+1)*20,8,18,c.sticker([1,1,i],normals.R));}return`<svg viewBox="0 0 104 104" width="${size}" height="${size}" aria-hidden="true">${rects}</svg>`;}
const api={Cube,Player,parse,inverse,rule,diagram,colors};root.Cubing=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
