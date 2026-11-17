const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const source = script.slice(script.indexOf('  const pad ='), script.indexOf('  // ---------- actions ----------')) +
 script.slice(script.indexOf('  function buildExportCsv'), script.indexOf('  async function exportFile'));
const context = vm.createContext({ events: [], weekOffset: 0 });
vm.runInContext(source, context);
const at = (d,h) => new Date(2026,10,d,h).getTime();
const shift = (d,a,b,site) => [{t:at(d,a),type:'in',site},{t:at(d,b),type:'out'}];
context.events = [
 ...shift(2,8,10,'Old site'),
 {t:at(16,8),type:'in',site:'A'}, {t:at(16,10),type:'bs'},
 {t:at(16,11),type:'be'}, {t:at(16,12),type:'out'},
 ...shift(16,13,16,'B'), ...shift(17,8,9,''),
 ...shift(17,10,11,'Comma, "quote"'),
 {t:at(17,12),type:'in',site:'A'}
];
const run = (range,site) => vm.runInContext('buildExportCsv('+JSON.stringify(range)+','+JSON.stringify(site)+','+at(17,14)+')',context);
assert.ok(run('all',null).includes('"TOTAL","","13.00","1.00","12.00","12.00"'));
assert.ok(run('all','A').includes('"TOTAL","","6.00","1.00","5.00","5.00"'));
assert.ok(!run('all','A').includes('"B"'));
assert.ok(run('all',['A','']).includes('"TOTAL","","7.00","1.00","6.00","6.00"'));
assert.ok(!run('all',['A','']).includes('"B"'));
assert.equal(run('all',[]),null);
assert.ok(!run('week',null).includes('2026-11-02'));
assert.ok(run('all','').includes('"No site","1.00"'));
assert.ok(run('all',null).includes('"Comma, ""quote"""'));
assert.equal(run('all','Missing'),null);
assert.ok(run('all','A').includes('"2026-11-16 08:00","2026-11-16 12:00"'));
assert.ok(run('all','B').includes('"2026-11-16 13:00","2026-11-16 16:00"'));
assert.ok(run('all','A').includes('"2026-11-17 12:00",""'));
context.events = [{t:at(16,23),type:'in',site:'Night'},{t:at(17,2),type:'out'}];
assert.ok(run('all','Night').includes('"2026-11-16","Night","3.00"'));
assert.ok(run('all','Night').includes('"2026-11-16 23:00","2026-11-17 02:00"'));
context.events = [...shift(16,8,10,'A'), ...shift(16,13,15,'A')];
assert.ok(run('all','A').includes('"2026-11-16 08:00","2026-11-16 15:00"'));
context.events = [...shift(16,8,9,'=formula')];
assert.ok(run('all',null).includes('"\'=formula"'));
context.events = [];
assert.equal(run('all',null),null);
console.log('Passed: all-time totals, jobsite isolation, week filtering, unassigned sites, CSV quoting, active shifts, overnight shifts, formula escaping, empty results.');
