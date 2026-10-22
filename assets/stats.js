(function(root){
'use strict';
const value=s=>s.penalty==='DNF'?Infinity:Math.floor(s.ms/10)*10+(s.penalty==='+2'?2000:0);
function format(ms){if(ms===null||ms===undefined)return'—';if(!Number.isFinite(ms))return'DNF';let cs=Math.round(ms/10),minutes=Math.floor(cs/6000),sec=Math.floor(cs/100)%60,fraction=String(cs%100).padStart(2,'0');return(minutes?minutes+':'+String(sec).padStart(2,'0'):sec)+'.'+fraction;}
function average(solves,n){if(solves.length<n)return null;let v=solves.slice(-n).map(value).sort((a,b)=>a-b).slice(1,-1);return v.some(v=>!Number.isFinite(v))?Infinity:v.reduce((a,b)=>a+b,0)/v.length;}
function summary(solves){let values=solves.map(value),valid=values.filter(Number.isFinite);return{best:values.length?Math.min(...values):null,mean:valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:null,ao5:average(solves,5),ao12:average(solves,12),count:solves.length};}
function randomScramble(n=20,rng=Math.random){const faces=['U','D','R','L','F','B'],axis={U:0,D:0,R:1,L:1,F:2,B:2};let out=[],previous=-1;for(let i=0;i<n;i++){let pool=faces.filter(f=>axis[f]!==previous),face=pool[Math.floor(rng()*pool.length)];previous=axis[face];out.push(face+['',"'",'2'][Math.floor(rng()*3)]);}return out;}
const api={value,format,average,summary,randomScramble};root.CubeStats=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
