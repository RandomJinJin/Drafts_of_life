// 催更计数的纯逻辑，供 UrgeUpdate 组件与 scripts/check-urge.mjs 共用。
// 后端 = counterapi.com（免费公共 API，无需账号/密钥），端点规则集中在本文件；
// ponytail: 换服务只改下面三个常量 + counterEndpoints 的路径拼法，组件里不出现任何 URL。

// counterapi.com 的写读同端点：GET {base}/{ns}/{action}/{key} 默认 +1，加 readOnly=true 只读。
export const COUNTER_BASE = 'https://counterapi.com/api';
// 命名空间锁站点域名，换域名/多端复用只改这一行。
export const COUNTER_NS = 'sanxiaoxing.cn';
// 事件分组：后台可按 action 单独看「催更」趋势，不和其他统计混在一起。
export const COUNTER_ACTION = 'urge';

/** 生成某篇文章的读/写端点；key 用 story id，首次点击即自动建计数，新文章零配置。 */
export const counterEndpoints = (
  key,
  { base = COUNTER_BASE, ns = COUNTER_NS, action = COUNTER_ACTION } = {},
) => {
  const path = `${base}/${encodeURIComponent(ns)}/${encodeURIComponent(action)}/${encodeURIComponent(key)}`;
  return { read: `${path}?readOnly=true`, hit: path };
};

/** 服务端响应取数：value（或 count）可能是数字或字符串，异常一律归 0。 */
export const parseCount = (data) => Math.round(Number(data?.value ?? data?.count)) || 0;

/** 合并乐观值与服务端值：只升不降，容忍乱序响应与失败请求。 */
export const mergeCount = (shown, incoming) => Math.max(shown, incoming);

/** ease-out 插值，t ∈ [0,1]，返回小数（显示时再取整）。 */
export const interpolate = (from, to, t) => from + (to - from) * (1 - (1 - t) ** 3);
