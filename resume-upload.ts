/**
 * BOSS直聘求职者工具 - 简历上传
 */

import { cli, Strategy } from '@jackwener/opencli/registry';
import { requirePage, navigateTo, verbose } from './utils.js';

const RESUME_URL = 'https://www.zhipin.com/web/geek/resume';

cli({
  site: 'boss-job',
  name: 'resume-upload',
  description: '上传 PDF 简历',
  domain: 'www.zhipin.com',
  strategy: Strategy.COOKIE,
  browser: true,
  args: [
    { name: 'file', positional: true, required: true, help: 'PDF 简历文件路径' },
  ],
  columns: ['type', 'name', 'updatedAt', 'downloadUrl'],
  func: async (page, kwargs) => {
    requirePage(page);
    // TODO: 实现上传逻辑
    verbose(`Navigating to ${RESUME_URL}`);
    await navigateTo(page, RESUME_URL, 3);
    return [];
  },
});
