/**
 * BOSS直聘求职者工具 - 简历列表
 */

import { cli, Strategy } from '@jackwener/opencli/registry';
import { requirePage, navigateTo, verbose } from './utils.js';

cli({
  site: 'boss-job',
  name: 'resume-list',
  description: '查看简历列表（在线简历和附件简历）',
  domain: 'www.zhipin.com',
  strategy: Strategy.COOKIE,
  browser: true,
  args: [],
  columns: ['type', 'name', 'updatedAt', 'downloadUrl'],
  func: async (page, kwargs) => {
    requirePage(page);
    // TODO: Implement
    return [];
  },
});
