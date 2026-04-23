/**
 * BOSS直聘求职者工具 - 简历列表
 */

import { cli, Strategy } from '@jackwener/opencli/registry';
import { requirePage, navigateTo, verbose } from './utils.js';

const RESUME_URL = 'https://www.zhipin.com/web/geek/resume';

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

    verbose(`Navigating to ${RESUME_URL}`);
    await navigateTo(page, RESUME_URL, 2);

    // Extract resume data
    const resumes = await page.evaluate(`(function() {
      const result = [];

      // Extract online resume
      const userInfo = document.querySelector('#userinfo');
      if (userInfo) {
        const nameEl = userInfo.querySelector('p');
        const name = nameEl ? nameEl.textContent.trim() : '在线简历';
        result.push({
          type: '在线简历',
          name: name,
          updatedAt: '',
          downloadUrl: ''
        });
      }

      // Extract attachment resumes (placeholder - will refine later)
      const allLi = Array.from(document.querySelectorAll('li'));
      for (const li of allLi) {
        const text = li.textContent || '';
        if (text.includes('.pdf') || text.includes('.doc') || text.includes('更新于')) {
          const titleA = li.querySelector('a[title]');
          const downloadA = li.querySelector('a[type=download]');
          const title = titleA ? titleA.getAttribute('title') : '';
          const downloadUrl = downloadA ? downloadA.getAttribute('href') : '';

          // Try to extract update time
          let updatedAt = '';
          const dateMatch = text.match(/更新于[\\s]*([\\d]{4}\\.[\\d]{2}\\.[\\d]{2}[\\s]*[\\d]{2}:[\\d]{2})/);
          if (dateMatch) {
            updatedAt = dateMatch[1];
          }

          if (title) {
            result.push({
              type: '附件简历',
              name: title,
              updatedAt: updatedAt,
              downloadUrl: downloadUrl
            });
          }
        }
      }

      return result;
    })()`);

    // Normalize and return
    return Array.isArray(resumes) ? resumes : [];
  },
});
