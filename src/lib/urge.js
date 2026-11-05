// 催更计数的纯逻辑，供 UrgeUpdate 组件与 scripts/check-urge.mjs 共用。
// ponytail: 计数服务是免费公共服务（单机托管），存在存亡风险；迁移路径 = 换组件里的 BASE 一行。

/** 服务端响应取数：value 可能是数字或字符串，异常一律归 0。 */
export const parseCount = (data) => Math.round(Number(data?.value)) || 0;

/** 合并乐观值与服务端值：只升不降，容忍乱序响应与失败请求。 */
export const mergeCount = (shown, incoming) => Math.max(shown, incoming);

/** ease-out 插值，t ∈ [0,1]，返回小数（显示时再取整）。 */
export const interpolate = (from, to, t) => from + (to - from) * (1 - (1 - t) ** 3);
