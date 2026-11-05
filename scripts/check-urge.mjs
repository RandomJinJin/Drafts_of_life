// 催更纯逻辑的可运行检查：node scripts/check-urge.mjs
import assert from 'node:assert/strict';
import { parseCount, mergeCount, interpolate, counterEndpoints } from '../src/lib/urge.js';

// counterEndpoints：读端点必须带 readOnly（只读不涨），写端点不带；key 走转义
const ep = counterEndpoints('20260714');
assert.equal(ep.read, 'https://counterapi.com/api/sanxiaoxing.cn/urge/20260714?readOnly=true');
assert.equal(ep.hit, 'https://counterapi.com/api/sanxiaoxing.cn/urge/20260714');
assert.equal(counterEndpoints('a/b').hit.endsWith('/a%2Fb'), true);

// parseCount：数字/字符串都能取，异常归 0
assert.equal(parseCount({ value: 42 }), 42);
assert.equal(parseCount({ value: '7' }), 7);
assert.equal(parseCount({ value: 'x' }), 0);
assert.equal(parseCount(null), 0);
assert.equal(parseCount({}), 0);

// mergeCount：只升不降（乱序/失败响应不得回退数字）
assert.equal(mergeCount(5, 3), 5);
assert.equal(mergeCount(3, 5), 5);
assert.equal(mergeCount(5, 5), 5);

// interpolate：端点精确、区间单调
assert.equal(interpolate(10, 20, 0), 10);
assert.equal(interpolate(10, 20, 1), 20);
const mid = interpolate(10, 20, 0.5);
assert.ok(mid > 10 && mid < 20 && mid > 15, `ease-out 中点应过半，得到 ${mid}`);

console.log('check-urge: 全部通过');
