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

    const resumes = await page.evaluate(`(function() {
      const result = [];

      // Get online resume
      let onlineName = '在线简历';
      const userInfo = document.querySelector('#userinfo');
      if (userInfo) {
        const nameEl = userInfo.querySelector('p');
        if (nameEl && nameEl.textContent.trim()) {
          onlineName = nameEl.textContent.trim();
        }
      }
      result.push({
        type: '在线简历',
        name: onlineName,
        updatedAt: '',
        downloadUrl: ''
      });

      // Get attachment resumes
      const seen = {};
      const downloadLinks = document.querySelectorAll('a[type=download]');

      for (let i = 0; i < downloadLinks.length; i++) {
        const downloadLink = downloadLinks[i];
        const href = downloadLink.getAttribute('href') || '';

        // Find the filename
        let name = '';
        const parent = downloadLink.parentElement;
        if (parent) {
          const titleLink = parent.querySelector('a[title]');
          if (titleLink) {
            name = titleLink.getAttribute('title') || '';
          }

          if (!name) {
            const text = parent.textContent || '';
            const pdfMatch = text.match(/([^\\s]+\\.pdf)/i);
            const docMatch = text.match(/([^\\s]+\\.doc[x]?)/i);
            if (pdfMatch) name = pdfMatch[1];
            else if (docMatch) name = docMatch[1];
          }
        }

        if (!name) {
          let current = downloadLink.previousElementSibling;
          for (let j = 0; j < 5 && current; j++) {
            const text = current.textContent || '';
            if (text.indexOf('.pdf') >= 0 || text.indexOf('.doc') >= 0) {
              const pdfMatch = text.match(/([^\\s]+\\.pdf)/i);
              const docMatch = text.match(/([^\\s]+\\.doc[x]?)/i);
              if (pdfMatch) { name = pdfMatch[1]; break; }
              else if (docMatch) { name = docMatch[1]; break; }
            }
            current = current.previousElementSibling;
          }
        }

        if (name && !seen[name]) {
          seen[name] = true;
          let url = href;
          if (url && url.indexOf('http') !== 0 && url.indexOf('/') === 0) {
            url = 'https://www.zhipin.com' + url;
          }
          result.push({
            type: '附件简历',
            name: name,
            updatedAt: '',
            downloadUrl: url
          });
        }
      }

      return result;
    })()`);

    verbose(`Found ${resumes.length} resumes`);

    return resumes;
  },
});
