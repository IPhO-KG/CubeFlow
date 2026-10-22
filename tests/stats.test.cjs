const test=require('node:test'),assert=require('node:assert/strict');
const S=require('../assets/stats.js');const solve=(ms,penalty='')=>({ms,penalty});
test('ao5 trims fastest and slowest; one DNF can be discarded',()=>{
 assert.equal(S.average([1000,2000,3000,4000,10000].map(t=>solve(t)),5),3000);
 assert.equal(S.average([solve(1000),solve(2000),solve(3000),solve(4000),solve(1,'DNF')],5),3000);
 assert.equal(S.average([solve(1,'DNF'),solve(2,'DNF'),solve(3000),solve(4000),solve(5000)],5),Infinity);
 assert.equal(S.average([solve(1000)],5),null);
});
test('ao12 trims one at each end and uses the latest twelve attempts',()=>{
 assert.equal(S.average(Array.from({length:12},(_,i)=>solve((i+1)*1000)),12),6500);
 assert.equal(S.average([solve(1,'DNF'),...Array.from({length:12},(_,i)=>solve((i+1)*1000))],12),6500);
});
test('penalties, hundredths and minute formatting',()=>{
 assert.equal(S.value(solve(12349,'+2')),14340);assert.equal(S.value(solve(12349)),12340);assert.equal(S.value(solve(1000,'DNF')),Infinity);
 assert.equal(S.format(60120),'1:00.12');assert.equal(S.format(59999),'1:00.00');assert.equal(S.format(null),'—');assert.equal(S.format(Infinity),'DNF');assert.equal(S.format(0),'0.00');
});
test('session means exclude DNFs; personal bests include penalties',()=>{
 const summary=S.summary([solve(1000,'+2'),solve(2500),solve(900,'DNF')]);assert.equal(summary.best,2500);assert.equal(summary.mean,2750);assert.equal(summary.count,3);assert.equal(S.summary([]).best,null);assert.equal(S.summary([solve(2,'DNF')]).best,Infinity);
});
test('practice random-move scrambles have no repeated axis',()=>{
 for(let n=0;n<100;n++){const alg=S.randomScramble();assert.equal(alg.length,20);let prev='';for(const t of alg){assert.match(t,/^[URFDLB](2|')?$/);let axis='UD'.includes(t[0])?'y':'RL'.includes(t[0])?'x':'z';assert.notEqual(axis,prev);prev=axis;}}
});
