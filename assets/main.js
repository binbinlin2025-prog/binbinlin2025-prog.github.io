let siteData = null;
let lang = localStorage.getItem('lang') || 'en';

const $ = (id) => document.getElementById(id);
const esc = (s = '') => String(s);

function t(obj) {
  return obj?.[lang] || obj?.en || '';
}

function text(key) {
  const dict = {
    en: {
      nav_about: 'Profile',
      nav_research: 'Research',
      nav_publications: 'Publications',
      nav_projects: 'Projects',
      nav_teaching: 'Teaching',
      nav_awards: 'Awards',
      nav_students: 'Students',
      nav_service: 'Service',
      footer_note: 'Built with GitHub Pages'
    },
    zh: {
      nav_about: '教师简介',
      nav_research: '研究方向',
      nav_publications: '论文论著',
      nav_projects: '科研项目',
      nav_teaching: '教学工作',
      nav_awards: '获奖情况',
      nav_students: '研究生培养',
      nav_service: '学术服务',
      footer_note: '基于 GitHub Pages 构建'
    }
  };
  return dict[lang][key] || '';
}

function setLang(next) {
  lang = next;
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  localStorage.setItem('lang', lang);
  $('langToggle').textContent = lang === 'en' ? '中文' : 'EN';
  render();
}

function highlightMe(text = '') {
  return esc(text)
    .replace(/Lin,\s*B\./g, '<strong>Lin, B.</strong>')
    .replace(/Binbin Lin/g, '<strong>Binbin Lin</strong>');
}

function itemMarkup(x) {
  if (typeof x === 'string') {
    return `<li>${highlightMe(x)}</li>`;
  }

  const authors = highlightMe(x.authors || '');
  const year = x.year ? ` ${esc(x.year)}.` : '';
  const title = x.title ? ` ${esc(x.title)}.` : '';
  const venueName = x.venue || x.journal || '';
  const venue = venueName ? ` <em>${esc(venueName)}</em>` : '';
  const volume = x.volume ? `, ${esc(x.volume)}` : '';
  const pages = x.pages ? `, ${esc(x.pages)}` : '';

  const status =
    x.status && x.status !== 'Published'
      ? ` <span class="pub-status">(${esc(x.status)})</span>`
      : '';

  const linkText = lang === 'zh' ? '【链接】' : '[Link]';

  const link = x.link
    ? ` <a class="pub-link" href="${x.link}" target="_blank" rel="noopener">${linkText}</a>`
    : '';

  return `<li>${authors}${year}${title}${venue}${volume}${pages}.${status}${link}</li>`;
}

function listMarkup(items = []) {
  return `<ul class="simple-list">${items.map(itemMarkup).join('')}</ul>`;
}

function groupsMarkup(groups = []) {
  return `<div class="group-list">${
    groups.map(g => {
      const groupTitle =
        typeof g.title === 'object'
          ? (g.title[lang] || g.title.en || '')
          : (g.title || '');

      return `
        <section class="subsection">
          <h3>${esc(groupTitle)}</h3>
          ${listMarkup(g.items || [])}
        </section>
      `;
    }).join('')
  }</div>`;
}

function renderKeywords(keywords) {
  if (Array.isArray(keywords)) {
    return `<ul class="keyword-list">${keywords.map(k => `<li>${esc(k)}</li>`).join('')}</ul>`;
  }
  return `<p>${esc(keywords || '')}</p>`;
}

function renderProfile() {
  const p = t(siteData.profile);
  const photo = siteData.profile.photo || 'img/profile-placeholder.svg';

  $('profileCard').innerHTML = `
    <img class="portrait" src="${photo}" alt="${esc(p.name)} profile photo">
    <h1 class="profile-name">${esc(p.name)}</h1>
    <p class="profile-sub">${esc(p.name_sub)}</p>
    <div class="profile-meta">
      <p><strong>${esc(p.title).replace(/\n/g, '<br>')}</strong></p>
      <p>${esc(p.affiliation).replace(/\n/g, '<br>')}</p>
      <p>${esc(p.address).replace(/\n/g, '<br>')}</p>
      ${renderKeywords(p.research_keywords)}
      <p>${esc(p.email).replace(/\n/g, '<br>')}</p>
    </div>
    <div class="profile-links">
      ${siteData.profile.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}
    </div>
  `;
}

function renderAbout() {
  const s = siteData.sections.about;
  $('about').innerHTML = `
    <h2>${esc(t(s).title)}</h2>
    <div class="intro-block">
      <p>${esc(t(s).body).replace(/\n/g, '<br>')}</p>
      <img class="module-img" src="${s.image}" alt="Research image">
    </div>
  `;
}

function renderEducation() {
  const s = siteData.sections.education;
  $('education').innerHTML = `<h2>${esc(t(s).title)}</h2>${groupsMarkup(t(s).groups || [])}`;
}

function renderResearch() {
  const s = siteData.sections.research;
  $('research').innerHTML = `
    <h2>${esc(t(s).title)}</h2>
    <div class="research-grid">
      ${s.items.map(it => `
        <article class="research-item">
          <img src="${it.image}" alt="">
          <div>
            <h3>${esc(t(it).title)}</h3>
            <p>${esc(t(it).text)}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderPublications() {
  const s = siteData.sections.publications;
  const title = t(s).title || 'Publications';
  const note = t(s).note ? `<p class="section-note">${esc(t(s).note)}</p>` : '';
  $('publications').innerHTML = `<h2>${esc(title)}</h2>${note}${groupsMarkup(s.groups || [])}`;
}

function projectItemMarkup(item, isPI = false) {
  if (typeof item === 'string') {
    return `<li>${esc(item)}</li>`;
  }

  const text = esc(item.text || '').replace(/\n/g, '<br>');
  const image = item.image
    ? `<img src="${item.image}" alt="Project image">`
    : `<div class="project-placeholder">${lang === 'zh' ? '项目图片' : 'Project Image'}</div>`;

  if (isPI) {
    return `
      <div class="project-card">
        <div class="project-card-text">${text}</div>
        <div class="project-card-image">${image}</div>
      </div>
    `;
  }

  return `<li>${text}</li>`;
}

function projectGroupsMarkup(groups = []) {
  return `<div class="group-list">${
    groups.map(g => {
      const title =
        typeof g.title === 'object'
          ? (g.title[lang] || g.title.en)
          : g.title;

      const isPI =
        title === 'Projects as PI' ||
        title === 'Principal Investigator' ||
        title === '主持项目';

      const content = isPI
        ? `<div class="project-card-list">${(g.items || []).map(item => projectItemMarkup(item, true)).join('')}</div>`
        : `<ul class="simple-list">${(g.items || []).map(item => projectItemMarkup(item, false)).join('')}</ul>`;

      return `
        <section class="subsection">
          <h3>${esc(title)}</h3>
          ${content}
        </section>
      `;
    }).join('')
  }</div>`;
}

function renderProjects() {
  const s = siteData.sections.projects;
  const content = t(s);

  $('projects').innerHTML = `
    <h2>${esc(content.title || '')}</h2>
    ${projectGroupsMarkup(content.groups || [])}
  `;
}

function studentItemMarkup(item) {
  if (typeof item === 'string') return `<li>${esc(item)}</li>`;

  return `
    <div class="student-card">
      <img class="student-photo" src="${item.photo}" alt="${esc(item.name)}">
      <div>
        <div class="student-name">${esc(item.name)}</div>
        <div class="student-info">${esc(item.degree)}</div>
        <div class="student-info">${esc(item.period)}</div>
      </div>
    </div>
  `;
}

function studentGroupsMarkup(groups = []) {
  return `<div class="group-list">${
    groups.map(g => `
      <section class="subsection">
        <h3>${esc(g.title)}</h3>
        <div class="student-list">
          ${(g.items || []).map(studentItemMarkup).join('')}
        </div>
      </section>
    `).join('')
  }</div>`;
}

function renderStudents() {
  const s = siteData.sections.students;
  const content = t(s);

  $('students').innerHTML = `
    <h2>${esc(content.title || '')}</h2>
    ${studentGroupsMarkup(content.groups || [])}
  `;
}

function renderListSection(id) {
  const s = siteData.sections[id];
  if (!s) return;

  const content = t(s);
  const img = s.image ? `<img class="module-img" src="${s.image}" alt="">` : '';

  let inner = '';
  if (content.groups) inner = groupsMarkup(content.groups);
  else if (content.items) inner = listMarkup(content.items);
  else if (content.body) inner = `<p>${esc(content.body).replace(/\n/g, '<br>')}</p>`;
  else if (s.items) inner = listMarkup(s.items);

  $(id).innerHTML = `<h2>${esc(content.title || '')}</h2>${img ? `<div class="list-block">${img}<div>${inner}</div></div>` : inner}`;
}

function render() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = text(el.dataset.i18n);
  });

  renderProfile();
  renderAbout();
  renderEducation();
  renderResearch();
  renderPublications();
  renderProjects();
  renderStudents();
  ['teaching', 'awards', 'patents', 'talks', 'service'].forEach(renderListSection);
}

fetch('data/site.json')
  .then(r => r.json())
  .then(d => {
    siteData = d;
    $('year').textContent = new Date().getFullYear();
    $('langToggle').addEventListener('click', () => setLang(lang === 'en' ? 'zh' : 'en'));
    setLang(lang);
  })
  .catch(err => {
    console.error('Failed to load site data:', err);
  });
