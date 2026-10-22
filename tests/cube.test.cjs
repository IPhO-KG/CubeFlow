const test=require('node:test'),assert=require('node:assert/strict');
const {Cube,parse,inverse}=require('../assets/cube.js'),cases=require('../assets/data.js');
test('all 21 distinct PLLs, with three valid equivalent algorithms each',()=>{
 assert.equal(cases.length,21);const keys=new Set();
 for(const c of cases){assert.equal(c.algs.length,3);const expected=new Cube().apply(inverse(c.algs[0].alg)).caseKey();assert.ok(!keys.has(expected),c.id+' duplicates a different named PLL');keys.add(expected);
  for(const a of c.algs){const cube=new Cube().apply(inverse(a.alg));assert.ok(cube.isPLL(),a.id+' disturbs F2L or OLL');assert.ok(!cube.solved(),a.id+' is not a permutation');assert.equal(cube.caseKey(),expected,a.id+' is a different case');cube.apply(a.alg);assert.ok(cube.solved(),a.id+' does not solve');}
 }
});
test('face, slice, whole-cube and wide-turn conventions agree',()=>{
 for(const move of 'URFDLBMESxyzurfdlb'){const cube=new Cube(),initial=cube.key();cube.apply([move,move,move,move]);assert.equal(cube.key(),initial,move+' fourth power');cube.apply([move,move+"'"]);assert.equal(cube.key(),initial,move+' inverse');}
 for(const [wide,parts]of [['r',"R M'"],['l','L M'],['u',"U E'"],['d','D E'],['f','F S'],['b',"B S'"],['x',"R M' L'"],['y',"U E' D'"],['z',"F S B'"]])assert.equal(new Cube().apply(wide).key(),new Cube().apply(parts).key(),wide);
});
test('training scrambles with every AUF produce the intended PLL',()=>{
 for(const c of cases)for(const a of c.algs)for(const auf of ['', 'U', "U'", 'U2']){const cube=new Cube().apply(inverse(a.alg)).apply(auf);assert.ok(cube.isPLL(),a.id+' AUF invalid');cube.apply(inverse(auf)).apply(a.alg);assert.ok(cube.solved(),a.id+' training setup');}
});
test('notation accepts apostrophes and wide aliases, rejects unsupported text',()=>{
 assert.deepEqual(parse("(Rw U) R’ U2'"),['r','U',"R'",'U2']);assert.throws(()=>parse('R U banana'));assert.throws(()=>parse('R3'));
});
