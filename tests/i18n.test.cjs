const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {translate}=require('../assets/i18n.js'),cases=require('../assets/data.js');
const cyrillic=/[А-Яа-яЁё]/;
test('every static interface string and accessibility label has an English translation',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const strings=[...Array.from(html.matchAll(/>([^<>]+)</g),m=>m[1]),...Array.from(html.matchAll(/(?:aria-label|placeholder|title|content)="([^"]+)"/g),m=>m[1])].filter(s=>cyrillic.test(s));
 for(const text of strings)assert.ok(!cyrillic.test(translate(text,'en')),'Missing translation: '+text);
});
test('all 21 descriptions, recognition tips and 63 algorithm labels are bilingual',()=>{
 for(const c of cases)for(const text of [c.description,c.tip,...c.algs.map(a=>a.name)]){assert.ok(!cyrillic.test(translate(text,'en')),'Missing translation: '+text);assert.equal(translate(text,'ru'),text);}
});
test('dynamic timer, training, favourite and move labels translate without touching notation',()=>{
 for(const text of ['Выбрать формулу 3','Сохранить формулу 2','Убрать из избранного формулу 1','Мини-анимация формулы 2','Пауза мини-анимации формулы 2','Ход 14: R2','Показать состояние после хода 4','ПОДГОТОВКА PLL · Ua · ВАРИАНТ 1','Перед формулой: U2 · M2 U M U2 M\' U M2','Ua-perm · вариант 2','14 ходов · лучшее 12.34','7 ходов · попробуй на кубике','Сборка 12: 5.43. Изменить штраф или удалить','Копия объединена: добавлено сборок 3','Твой вариант для T сохранён'])assert.ok(!cyrillic.test(translate(text,'en')),'Missing translation: '+text);
 const alg="R U R' U' R' F R2 U' R' U' R U R' F'";assert.equal(translate(alg,'en'),alg);assert.equal(translate('17.00','en'),'17.00');assert.equal(translate('DNF','en'),'DNF');assert.equal(translate('ao12','en'),'ao12');
});
