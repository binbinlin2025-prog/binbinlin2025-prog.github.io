let siteData = null;
let lang = localStorage.getItem('lang') || 'en';
const $ = (id) => document.getElementById(id);
const esc = (s='') => String(s);
function t(obj){ return obj?.[lang] || obj?.en || ''; }
function text(key){
  const dict = {
    en:{nav_about:'Profile',nav_research:'Research',nav_publications:'Publications',nav_projects:'Projects',nav_teaching:'Teaching',nav_awards:'Awards',nav_students:'Students',nav_service:'Service',footer_note:'Built with GitHub Pages'},
    zh:{nav_about:'教师简介',nav_research:'研究方向',nav_publications:'论文论著',nav_projects:'科研项目',nav_teaching:'教学工作',nav_awards:'获奖情况',nav_students:'研究生培养',nav_service:'学术服务',footer_note:'基于 GitHub Pages 构建'}
  };
  return dict[lang][key];
}
function setLang(next){
  lang = next;
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  localStorage.setItem('lang', lang);
  $('langToggle').textContent = lang === 'en' ? '中文' : 'EN';
  render();
}
function highlightMe(text=''){
  return esc(text)
    .replace(/Lin,\s*B\./g, '<strong>Lin, B.</strong>')
    .replace(/Binbin Lin/g, '<strong>Binbin Lin</strong>');
}

function itemMarkup(x){
  if (typeof x === 'string') return `<li>${highlightMe(x)}</li>`;

  // New structured publication format
  if (x.authors || x.title || x.journal) {
    const authors = highlightMe(x.authors || '');
    const title = x.title ? ` ${esc(x.title)}.` : '';
    const journal = x.journal ? ` <em>${esc(x.journal)}</em>` : '';
    const volume = x.volume ? `, ${esc(x.volume)}` : '';
    const pages = x.pages ? `, ${esc(x.pages)}` : '';
    const year = x.year ? ` ${esc(x.year)}.` : '';
    const status =
      x.status && x.status !== "Published"
        ? ` <span class="pub-status">(${esc(x.status)})</span>`
        : '';
    const link = x.link
      ? ` <a class="pub-link" href="${x.link}" target="_blank" rel="noopener">[Link]</a>`
      : '';

    return `<li>${authors}${year}${title}${journal}${volume}${pages}.${status}${link}</li>`;
  }

  // Old citation format, kept for compatibility
  const citation = highlightMe(x.citation || '');
  const status =
    x.status && x.status !== "Published"
      ? ` <span class="pub-status">(${esc(x.status)})</span>`
      : '';
  const link = x.link
    ? ` <a class="pub-link" href="${x.link}" target="_blank" rel="noopener">[Link]</a>`
    : '';

  return `<li>${citation}${status}${link}</li>`;
}
function listMarkup(items=[]){
  return `<ul class="simple-list">${items.map(itemMarkup).join('')}</ul>`;
}
function groupsMarkup(groups=[]){
  return `<div class="group-list">${groups.map(g=>`<section class="subsection"><h3>${esc(g.title)}</h3>${listMarkup(g.items||[])}</section>`).join('')}</div>`;
}
function renderProfile(){
  const p = t(siteData.profile);
  const photo = siteData.profile.photo || 'img/profile-placeholder.svg';
  $('profileCard').innerHTML = `
    <img class="portrait" src="${photo}" alt="${p.name} profile photo">
    <h1 class="profile-name">${p.name}</h1>
    <p class="profile-sub">${p.name_sub}</p>
    <div class="profile-meta">
      <p><strong>${p.title}</strong></p>
      <p>${p.affiliation}</p>
      <p>${p.address}</p>
      <p>${p.research_keywords}</p>
      <p><a href="mailto:${p.email}">${p.email}</a></p>
    </div>
    <div class="profile-links">${siteData.profile.links.map(l=>`<a href="${l.url}">${l.label}</a>`).join('')}</div>`;
}
function renderAbout(){
  const s = siteData.sections.about;
  $('about').innerHTML = `<h2>${t(s).title}</h2><div class="intro-block"><p>${t(s).body}</p><img class="module-img" src="${s.image}" alt="Research image"></div>`;
}
function renderEducation(){
  const s = siteData.sections.education;
  $('education').innerHTML = `<h2>${t(s).title}</h2>${groupsMarkup(t(s).groups || [])}`;
}
function renderResearch(){
  const s = siteData.sections.research;
  $('research').innerHTML = `<h2>${t(s).title}</h2><div class="research-grid">${s.items.map(it=>`<article class="research-item"><img src="${it.image}" alt=""><div><h3>${t(it).title}</h3><p>${t(it).text}</p></div></article>`).join('')}</div>`;
}
function renderPublications(){
  const s = siteData.sections.publications;
  const title = t(s).title || 'Publications';
  const note = t(s).note ? `<p class="section-note">${t(s).note}</p>` : '';
  $('publications').innerHTML = `<h2>${title}</h2>${note}${groupsMarkup(s.groups || [])}`;
}
function renderListSection(id){
  const s = siteData.sections[id];
  const content = t(s);
  const img = s.image ? `<img class="module-img" src="${s.image}" alt="">` : '';
  let inner = '';
  if(content.groups) inner = groupsMarkup(content.groups);
  else if(content.items) inner = listMarkup(content.items);
  else if(content.body) inner = `<p>${content.body}</p>`;
  else if(s.items) inner = listMarkup(s.items);
  $(id).innerHTML = `<h2>${content.title}</h2>${img ? `<div class="list-block">${img}<div>${inner}</div></div>` : inner}`;
}
function render(){
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = text(el.dataset.i18n));
  renderProfile(); renderAbout(); renderEducation(); renderResearch(); renderPublications();
  ['projects','teaching','awards','students','patents','talks','service'].forEach(renderListSection);
}
fetch('data/site.json').then(r=>r.json()).then(d=>{
  siteData = d;
  $('year').textContent = new Date().getFullYear();
  $('langToggle').addEventListener('click', () => setLang(lang === 'en' ? 'zh' : 'en'));
  setLang(lang);
});
