// 催更计数的纯逻辑，供 UrgeUpdate 组件与 scripts/check-urge.mjs 共用。
// 后端 = countapi.mileshilliard.com（免费公共服务，无需账号/密钥），端点规则集中在本文件；
// ponytail: 换服务只改下面两个常量 + counterEndpoints 的路径拼法，组件里不出现任何 URL。

// 曾试过 counterapi.com：其 /api 端点长期 502，读写全废，故回退到这里。
export const COUNTER_BASE = 'https://countapi.mileshilliard.com/api/v1';
// 保留最初上线时的前缀，老文章已经累积的计数不会丢。
export const COUNTER_PREFIX = 'sanxiaoxing_story_cuigeng_';

/** 生成某篇文章的读/写端点；key = 前缀 + story id，首次 hit 即自动建计数，新文章零配置。 */
export const counterEndpoints = (key, { base = COUNTER_BASE, prefix = COUNTER_PREFIX } = {}) => {
  const full = encodeURIComponent(`${prefix}${key}`);
  return { read: `${base}/get/${full}`, hit: `${base}/hit/${full}` };
};

/** 服务端响应取数：value（或 count）可能是数字或字符串，异常一律归 0。 */
export const parseCount = (data) => Math.round(Number(data?.value ?? data?.count)) || 0;

/** 合并乐观值与服务端值：只升不降，容忍乱序响应与失败请求。 */
export const mergeCount = (shown, incoming) => Math.max(shown, incoming);

/** ease-out 插值，t ∈ [0,1]，返回小数（显示时再取整）。 */
export const interpolate = (from, to, t) => from + (to - from) * (1 - (1 - t) ** 3);
