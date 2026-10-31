export const submission = {
  // 换成真实可收信的地址；改这一处，页面与 mailto 会同步更新。
  email: 'mail@sanxiaoxing.cn',
  subject: '投稿｜《稿件标题》｜署名',
  templateHref: '/templates/submission.md',
  reviewDays: 7,
};

export const submissionMailto = `mailto:${submission.email}?subject=${encodeURIComponent(submission.subject)}`;
