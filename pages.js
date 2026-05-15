// ============================================================
// PAGES.JS – All page rendering & route registration
// ============================================================

/* ─── helpers ─── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const esc = (s) => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };

const renderTo = (html) => {
  const c = document.getElementById('pageContainer');
  if (c) c.innerHTML = html;
};

/* ─── package data ─── */
const PACKAGES = [
  { id: 'kickstart', icon: '🚀', titleKey: 'packages.kickstart_title', descKey: 'packages.kickstart_desc', priceKey: 'packages.kickstart_price', color: 'from-cyan-500 to-blue-600' },
  { id: 'sidehustle', icon: '💼', titleKey: 'packages.sidehustle_title', descKey: 'packages.sidehustle_desc', priceKey: 'packages.sidehustle_price', color: 'from-amber-500 to-orange-600' },
  { id: 'standalone', icon: '📝', titleKey: 'packages.standalone_title', descKey: 'packages.standalone_desc', priceKey: 'packages.standalone_price', color: 'from-sky-500 to-indigo-600' },
  { id: 'systems', icon: '⚙️', titleKey: 'packages.systems_title', descKey: 'packages.systems_desc', priceKey: 'packages.systems_price', color: 'from-emerald-500 to-teal-600' },
  { id: 'bookkeeping', icon: '📊', titleKey: 'packages.bookkeeping_title', descKey: 'packages.bookkeeping_desc', priceKey: 'packages.bookkeeping_price', color: 'from-violet-500 to-purple-600' },
  { id: 'ceo', icon: '👑', titleKey: 'packages.ceo_title', descKey: 'packages.ceo_desc', priceKey: 'packages.ceo_price', color: 'from-rose-500 to-pink-600' },
  { id: 'orgreset', icon: '🔄', titleKey: 'packages.orgreset_title', descKey: 'packages.orgreset_desc', priceKey: 'packages.orgreset_price', color: 'from-red-500 to-rose-600' },
];

const QUAL_OPTIONS = [
  { id: 'startup', icon: '🌱', titleKey: 'qualification.opt_startup', descKey: 'qualification.opt_startup_desc' },
  { id: 'operating', icon: '🏢', titleKey: 'qualification.opt_operating', descKey: 'qualification.opt_operating_desc' },
  { id: 'systems', icon: '🔧', titleKey: 'qualification.opt_systems', descKey: 'qualification.opt_systems_desc' },
  { id: 'compliance', icon: '📋', titleKey: 'qualification.opt_compliance', descKey: 'qualification.opt_compliance_desc' },
];

/* ─── i18n shortcut ─── */
const T = (key, vals) => {
  if (typeof t === 'function') return t(key, vals);
  return key;
};

/* ─── Recommendation map: qualId → ordered package ids ─── */
const RECOMMENDATIONS = {
  startup:    ['kickstart', 'standalone', 'sidehustle'],
  operating:  ['sidehustle', 'bookkeeping', 'ceo'],
  systems:    ['systems', 'orgreset', 'ceo'],
  compliance: ['standalone', 'kickstart', 'sidehustle'],
};

/* ─── Currently selected qualification (persists during session) ─── */
let _selectedQual = null;

/* ─── Page: Home ─── */
const renderHome = () => {
  const html = `
    <!-- Hero -->
    <section class="hero-gradient rounded-2xl p-8 md:p-16 mb-12 text-center card-accent-top">
      <h1 class="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-amber-300 bg-clip-text text-transparent heading-glow">
        ${esc(T('app.hero_title'))}
      </h1>
      <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">${esc(T('app.hero_subtitle'))}</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#/packages" class="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all text-center">
          ${esc(T('app.cta_primary'))}
        </a>
        <a href="#/packages" class="px-8 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all text-center">
          ${esc(T('app.cta_secondary'))}
        </a>
      </div>
    </section>

    <!-- Qualification -->
    <section class="mb-12">
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">${esc(T('qualification.title'))}</h2>
        <p class="text-slate-400">${esc(T('qualification.subtitle'))}</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="qualGrid">
        ${QUAL_OPTIONS.map(q => `
          <div class="qualification-option rounded-xl border border-white/10 p-5 text-center ${_selectedQual === q.id ? 'selected' : ''}" data-qual="${q.id}" onclick="selectQualification('${q.id}')">
            <div class="text-3xl mb-3">${q.icon}</div>
            <h3 class="font-semibold text-white mb-1">${esc(T(q.titleKey))}</h3>
            <p class="text-sm text-slate-400">${esc(T(q.descKey))}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Recommended Packages (appears after qualification selection) -->
    <section id="recommendedSection" class="mb-12" style="${_selectedQual ? '' : 'display:none'}">
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-2 heading-glow">${esc(T('qualification.recommended_title'))}</h2>
        <p class="text-slate-400">${esc(T('qualification.recommended_subtitle'))}</p>
      </div>
      <div id="recommendedGrid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${_selectedQual ? renderRecommendedCards(_selectedQual) : ''}
      </div>
      <div class="text-center mt-6">
        <a href="#/packages" class="text-sm text-slate-400 hover:text-white underline underline-offset-4 transition-colors">${esc(T('qualification.view_all'))}</a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/10 pt-8 pb-4 text-center text-sm text-slate-500">
      <p>${esc(T('footer.copyright'))}</p>
    </footer>
  `;
  renderTo(html);
};

/* ─── Render recommended package cards for a qualification ─── */
const renderRecommendedCards = (qualId) => {
  const recIds = RECOMMENDATIONS[qualId] || [];
  const recPkgs = recIds.map(id => PACKAGES.find(p => p.id === id)).filter(Boolean);
  const tagKeys = {
    startup:    'qualification.best_startup',
    operating:  'qualification.best_operating',
    systems:    'qualification.best_systems',
    compliance: 'qualification.best_compliance',
  };
  const tagline = T(tagKeys[qualId] || 'qualification.recommended_subtitle');

  return recPkgs.map((p, i) => `
    <div class="package-card card-hover rounded-xl border border-white/10 bg-white/5 p-6 relative overflow-hidden">
      ${i === 0 ? '<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-amber-400 rounded-t-xl"></div>' : ''}
      ${i === 0 ? `<span class="inline-block mb-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">⭐ ${esc(T('qualification.top_pick'))}</span>` : `<span class="inline-block mb-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-slate-400 border border-white/10">${esc(tagline)}</span>`}
      <div class="text-3xl mb-3">${p.icon}</div>
      <h3 class="text-lg font-bold text-white mb-2">${esc(T(p.titleKey))}</h3>
      <p class="text-sm text-slate-400 mb-3">${esc(T(p.descKey))}</p>
      <span class="text-sm font-semibold text-cyan-400">${esc(T(p.priceKey))}</span>
      <div class="mt-4">
        <button onclick="startApplication('${p.id}','${qualId}')" class="w-full px-4 py-2.5 rounded-lg ${i === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/25' : 'border border-white/20 text-white hover:bg-white/5'} text-sm font-semibold transition-all">
          ${esc(T('app.cta_primary'))}
        </button>
      </div>
    </div>
  `).join('');
};

/* ─── Qualification selection → start application ─── */
window.selectQualification = (qualId) => {
  _selectedQual = qualId;

  // Highlight selected card
  document.querySelectorAll('.qualification-option').forEach(el => {
    el.classList.toggle('selected', el.getAttribute('data-qual') === qualId);
  });

  // Show & populate recommended section
  const section = document.getElementById('recommendedSection');
  const grid = document.getElementById('recommendedGrid');
  if (section && grid) {
    grid.innerHTML = renderRecommendedCards(qualId);
    section.style.display = '';
    // Smooth scroll to recommendations
    setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
};

window.startApplication = (pkgId, qualId) => {
  Modal.close();
  Store.createNewApp(pkgId, qualId);
  renderApplicationForm();
};

/* ─── Page: Packages ─── */
const renderPackages = () => {
  const html = `
    <section class="mb-12">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 text-center heading-glow">${esc(T('app.cta_secondary'))}</h1>
      <p class="text-slate-400 text-center mb-8">Choose a package that fits your business stage.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${PACKAGES.map(p => `
          <div class="package-card card-hover rounded-xl border border-white/10 bg-white/5 p-6">
            <div class="text-3xl mb-3">${p.icon}</div>
            <h3 class="text-lg font-bold text-white mb-2">${esc(T(p.titleKey))}</h3>
            <p class="text-sm text-slate-400 mb-3">${esc(T(p.descKey))}</p>
            <span class="text-sm font-semibold text-cyan-400">${esc(T(p.priceKey))}</span>
            <div class="mt-4">
              <button onclick="Router.navigate('/')" class="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                ${esc(T('app.cta_primary'))}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
  renderTo(html);
};

/* ═══════════════════════════════════════════════════════════
   APPLICATION FORM (Multi-step wizard)
   ═══════════════════════════════════════════════════════════ */

const FORM_STEPS = [
  { key: 'profile', labelKey: 'form.step_profile' },
  { key: 'business', labelKey: 'form.step_business' },
  { key: 'service', labelKey: 'form.step_service' },
  { key: 'upload', labelKey: 'form.step_upload' },
  { key: 'review', labelKey: 'form.step_review' },
];

const renderApplicationForm = () => {
  setTimeout(() => {
    const app = Store.getCurrentApp();
    if (app && app.currentStep === 3) window.initUpload();
  }, 50);
  const app = Store.getCurrentApp();
  if (!app) { Router.navigate('/'); return; }

  const step = app.currentStep || 0;
  const total = FORM_STEPS.length;
  const pct = ((step) / (total - 1)) * 100;

  const html = `
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-slate-400">${T('form.progress_label', { current: step + 1, total })}</span>
          <span class="text-xs text-slate-500">${esc(T(FORM_STEPS[step].labelKey))}</span>
        </div>
        <div class="h-2 bg-white/10 rounded-full overflow-hidden">
          <div class="progress-fill h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style="width:${pct}%"></div>
        </div>
      </div>

      <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
        ${FORM_STEPS.map((s, i) => `
          <div class="step-indicator flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${i < step ? 'completed' : i === step ? 'active' : 'bg-white/10 text-slate-500'}">
            ${esc(T(s.labelKey))}
          </div>
        `).join('')}
      </div>

      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        ${renderStepContent(step, app)}
      </div>
    </div>
  `;
  renderTo(html);
};

const renderStepContent = (step, app) => {
  switch (step) {
    case 0: return renderProfileStep(app);
    case 1: return renderBusinessStep(app);
    case 2: return renderServiceStep(app);
    case 3: return renderUploadStep(app);
    case 4: return renderReviewStep(app);
    default: return '<p>Unknown step.</p>';
  }
};

/* ─── Step 0: Client Profile ─── */
const renderProfileStep = (app) => {
  const p = app.clientProfile || {};
  const PROVINCES = ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'];
  return `
    <h2 class="text-xl font-bold text-white mb-6">${esc(T('form.step_profile'))}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <label class="block text-sm text-slate-300 mb-1">Full Name *</label>
        <input class="form-input" id="pf_name" value="${esc(p.fullName || '')}" placeholder="e.g. John Doe">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">ID / Passport Number *</label>
        <input class="form-input" id="pf_id" value="${esc(p.idNumber || '')}" placeholder="e.g. 9001015800088">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Phone Number *</label>
        <input class="form-input" id="pf_phone" value="${esc(p.phone || '')}" placeholder="e.g. 0821234567">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Email Address *</label>
        <input class="form-input" id="pf_email" type="email" value="${esc(p.email || '')}" placeholder="e.g. john@example.com">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Province *</label>
        <select class="form-input" id="pf_province">
          <option value="">Select province</option>
          ${PROVINCES.map(pr => `<option value="${pr}" ${p.province === pr ? 'selected' : ''}>${pr}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Preferred Contact Method</label>
        <select class="form-input" id="pf_comm">
          <option value="WhatsApp" ${p.communication === 'WhatsApp' ? 'selected' : ''}>WhatsApp</option>
          <option value="Call" ${p.communication === 'Call' ? 'selected' : ''}>Phone Call</option>
          <option value="Email" ${p.communication === 'Email' ? 'selected' : ''}>Email</option>
        </select>
      </div>
    </div>
    <div class="mt-8 flex justify-end">
      <button onclick="saveProfileStep()" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all">
        ${esc(T('form.next'))}
      </button>
    </div>
  `;
};

window.saveProfileStep = () => {
  const app = Store.getCurrentApp();
  if (!app) return;
  const data = {
    fullName: $('#pf_name')?.value?.trim(),
    idNumber: $('#pf_id')?.value?.trim(),
    phone: $('#pf_phone')?.value?.trim(),
    email: $('#pf_email')?.value?.trim(),
    province: $('#pf_province')?.value,
    communication: $('#pf_comm')?.value,
  };
  if (!data.fullName || !data.idNumber || !data.phone || !data.email || !data.province) {
    Toast.show('Please fill in all required fields.', 'error');
    return;
  }
  app.clientProfile = data;
  app.currentStep = 1;
  Store.setCurrentApp(app);
  renderApplicationForm();
};

/* ─── Step 1: Business Overview ─── */
const renderBusinessStep = (app) => {
  const b = app.businessOverview || {};
  const REVENUE_OPTIONS = ['0-5000', '5000-20000', '20000-50000', '50000-200000', '200000+'];
  const EMPLOYEE_OPTIONS = ['0', '1-5', '6-10', '10-50', '50+'];
  return `
    <h2 class="text-xl font-bold text-white mb-6">${esc(T('form.step_business'))}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <label class="block text-sm text-slate-300 mb-1">Business Name *</label>
        <input class="form-input" id="biz_name" value="${esc(b.name || '')}" placeholder="e.g. My Business Pty Ltd">
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm text-slate-300 mb-1">Business Activity *</label>
        <input class="form-input" id="biz_activity" value="${esc(b.activity || '')}" placeholder="e.g. Retail, Consulting, Construction">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Industry</label>
        <input class="form-input" id="biz_industry" value="${esc(b.industry || '')}" placeholder="e.g. Technology, Healthcare">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Start Date (if operating)</label>
        <input class="form-input" id="biz_start" type="month" value="${b.startDate || ''}">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Monthly Revenue (ZAR)</label>
        <select class="form-input" id="biz_revenue">
          <option value="">Select range</option>
          ${REVENUE_OPTIONS.map(r => `<option value="${r}" ${b.revenue === r ? 'selected' : ''}>R${r}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Number of Employees</label>
        <select class="form-input" id="biz_employees">
          <option value="">Select</option>
          ${EMPLOYEE_OPTIONS.map(e => `<option value="${e}" ${b.employees === e ? 'selected' : ''}>${e}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="mt-8 flex justify-between">
      <button onclick="goToStep(0)" class="px-6 py-2.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
        ${esc(T('form.back'))}
      </button>
      <button onclick="saveBusinessStep()" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all">
        ${esc(T('form.next'))}
      </button>
    </div>
  `;
};

window.saveBusinessStep = () => {
  const app = Store.getCurrentApp();
  if (!app) return;
  const data = {
    name: $('#biz_name')?.value?.trim(),
    activity: $('#biz_activity')?.value?.trim(),
    industry: $('#biz_industry')?.value?.trim(),
    startDate: $('#biz_start')?.value,
    revenue: $('#biz_revenue')?.value,
    employees: $('#biz_employees')?.value,
  };
  if (!data.name || !data.activity) {
    Toast.show('Please enter the business name and activity.', 'error');
    return;
  }
  app.businessOverview = data;
  app.currentStep = 2;
  Store.setCurrentApp(app);
  renderApplicationForm();
};

/* ═══════════════════════════════════════════════════════════
   Step 2: Service Details — Section-based composition
   ═══════════════════════════════════════════════════════════ */

const getPackageSections = (pkgId) => {
  const map = {
    kickstart: ['cipc', 'bank'],
    sidehustle: ['cipc', 'sars', 'bank', 'bookkeeping'],
    standalone: ['cipc'],
    systems: ['systems'],
    bookkeeping: ['bookkeeping'],
    ceo: ['ceo'],
    orgreset: ['systems'],
  };
  return map[pkgId] || [];
};

const renderServiceStep = (app) => {
  const pkg = app.selectedPackage;
  const s = app.serviceData || {};
  const sections = getPackageSections(pkg);

  return `
    <h2 class="text-xl font-bold text-white mb-6">${esc(T('form.step_service'))}</h2>
    ${sections.map(sectionId => renderServiceSection(sectionId, s)).join('\n')}
    <div class="mt-8 flex justify-between">
      <button onclick="goToStep(1)" class="px-6 py-2.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
        ${esc(T('form.back'))}
      </button>
      <button onclick="saveServiceStep()" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all">
        ${esc(T('form.next'))}
      </button>
    </div>
  `;
};

const renderServiceSection = (sectionId, s) => {
  switch (sectionId) {
    case 'cipc': return renderCipcSection(s);
    case 'sars': return renderSarsSection(s);
    case 'bank': return renderBankSection(s);
    case 'bookkeeping': return renderBookkeepingSection(s);
    case 'systems': return renderSystemsSection(s);
    case 'ceo': return renderCeoSection(s);
    default: return '';
  }
};

/* ─── Section A: CIPC Registration ─── */
const renderCipcSection = (s) => {
  const dirs = s.directors || [{ fullName: '', idNumber: '', address: '', phone: '', email: '', shares: 100 }];
  return `
    <div class="service-section">
      <h3 class="text-base font-semibold text-cyan-400 mb-1">${esc(T('services.cipc_title'))}</h3>
      <p class="text-xs text-slate-400 mb-4">${esc(T('services.cipc_subtitle'))}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm text-slate-300 mb-1">${esc(T('services.cipc_company_type'))}</label>
          <select class="form-input" id="sv_companyType">
            <option value="pty" ${s.companyType === 'pty' ? 'selected' : ''}>Private Company (Pty) Ltd</option>
            <option value="sole" ${s.companyType === 'sole' ? 'selected' : ''}>Sole Proprietorship</option>
            <option value="npc" ${s.companyType === 'npc' ? 'selected' : ''}>Non-Profit Company (NPC)</option>
            <option value="coop" ${s.companyType === 'coop' ? 'selected' : ''}>Co-operative</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-slate-300 mb-1">${esc(T('services.cipc_proposed_names'))} *</label>
          <textarea class="form-input" id="sv_names" rows="3" placeholder="${esc(T('services.cipc_proposed_names_hint'))}">${(s.proposedNames || []).join('\n')}</textarea>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm text-slate-300 mb-1">${esc(T('services.cipc_address'))} *</label>
          <textarea class="form-input" id="sv_address" rows="2" placeholder="Physical address">${esc(s.businessAddress || '')}</textarea>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm text-slate-300 font-medium">${esc(T('services.cipc_directors'))}</label>
          <button onclick="addDirector()" class="text-xs text-cyan-400 hover:text-cyan-300">${esc(T('services.cipc_add_director'))}</button>
        </div>
        <div id="directorsContainer">
          ${dirs.map((d, i) => `
            <div class="director-row" data-dir="${i}">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-slate-400 mb-1">Full Name *</label>
                  <input class="form-input text-sm" data-dir-field="fullName" value="${esc(d.fullName)}" placeholder="Full name">
                </div>
                <div>
                  <label class="block text-xs text-slate-400 mb-1">ID Number *</label>
                  <input class="form-input text-sm" data-dir-field="idNumber" value="${esc(d.idNumber)}" placeholder="ID / Passport">
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs text-slate-400 mb-1">Residential Address</label>
                  <input class="form-input text-sm" data-dir-field="address" value="${esc(d.address)}" placeholder="Address">
                </div>
                <div>
                  <label class="block text-xs text-slate-400 mb-1">Phone</label>
                  <input class="form-input text-sm" data-dir-field="phone" value="${esc(d.phone)}" placeholder="Phone">
                </div>
                <div>
                  <label class="block text-xs text-slate-400 mb-1">Email</label>
                  <input class="form-input text-sm" data-dir-field="email" value="${esc(d.email)}" placeholder="Email">
                </div>
                <div>
                  <label class="block text-xs text-slate-400 mb-1">Share %</label>
                  <input class="form-input text-sm" data-dir-field="shares" type="number" value="${d.shares}" min="0" max="100">
                </div>
                <div class="flex items-end pb-2">
                  ${dirs.length > 1 ? `<button onclick="removeDirector(${i})" class="text-xs text-red-400 hover:text-red-300">${esc(T('services.cipc_remove'))}</button>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <p class="text-xs text-slate-500 mt-3 italic">${esc(T('services.cipc_output'))}</p>
    </div>
  `;
};

/* ─── Section B: SARS Registration ─── */
const renderSarsSection = (s) => `
  <div class="service-section">
    <h3 class="text-base font-semibold text-amber-400 mb-1">${esc(T('services.sars_title'))}</h3>
    <p class="text-xs text-slate-400 mb-4">${esc(T('services.sars_subtitle'))}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm text-slate-300 mb-1">${esc(T('services.sars_income_tax'))}</label>
        <select class="form-input" id="sv_incomeTax">
          <option value="">Select</option>
          <option value="yes" ${s.incomeTax === 'yes' ? 'selected' : ''}>Yes</option>
          <option value="no" ${s.incomeTax === 'no' ? 'selected' : ''}>No</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">${esc(T('services.sars_vat'))}</label>
        <select class="form-input" id="sv_vat">
          <option value="">Select</option>
          <option value="yes" ${s.vat === 'yes' ? 'selected' : ''}>Yes</option>
          <option value="no" ${s.vat === 'no' ? 'selected' : ''}>No</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">${esc(T('services.sars_turnover'))}</label>
        <input class="form-input" id="sv_turnover" value="${s.annualTurnover || ''}" placeholder="e.g. 500000">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">${esc(T('services.sars_bank_name'))}</label>
        <input class="form-input" id="sv_bank" value="${s.bankName || ''}" placeholder="e.g. FNB, Standard Bank">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">${esc(T('services.activity_code'))}</label>
        <input class="form-input" id="sv_activityCode" value="${s.activityCode || ''}" placeholder="e.g. 14100">
        <p class="text-xs text-slate-500 mt-1">${esc(T('services.activity_code_help'))}</p>
      </div>
    </div>

    <p class="text-xs text-slate-500 mt-3 italic">${esc(T('services.sars_output'))}</p>
  </div>
`;

/* ─── Section C: Bank Account Setup ─── */
const renderBankSection = (s) => `
  <div class="service-section">
    <h3 class="text-base font-semibold text-cyan-400 mb-1">${esc(T('services.bank_section_title'))}</h3>
    <p class="text-xs text-slate-400 mb-4">${esc(T('services.bank_section_subtitle'))}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm text-slate-300 mb-1">${esc(T('services.bank_registered_name'))} *</label>
        <input class="form-input" id="sv_bankCompanyName" value="${s.bankCompanyName || ''}" placeholder="e.g. My Business Pty Ltd">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">${esc(T('services.bank_reg_number'))}</label>
        <input class="form-input" id="sv_bankRegNumber" value="${s.registrationNumber || ''}" placeholder="e.g. 2024/123456/07">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">${esc(T('services.bank_monthly_txns'))}</label>
        <input class="form-input" id="sv_bankMonthlyTxns" type="number" value="${s.monthlyTransactions || ''}" placeholder="e.g. 50">
      </div>
    </div>

    <p class="text-xs text-slate-500 mt-2">${esc(T('services.bank_note'))}</p>
    <p class="text-xs text-slate-500 mt-3 italic">${esc(T('services.bank_output'))}</p>
  </div>
`;

/* ─── Section D: Bookkeeping Setup ─── */
const renderBookkeepingSection = (s) => `
  <div class="service-section">
    <h3 class="text-base font-semibold text-violet-400 mb-1">${esc(T('services.bk_section_title'))}</h3>
    <p class="text-xs text-slate-400 mb-4">${esc(T('services.bk_section_subtitle'))}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm text-slate-300 mb-1">Income Sources</label>
        <textarea class="form-input" id="sv_income" rows="2" placeholder="List your income sources">${(s.incomeSources || []).join(', ')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Expense Categories</label>
        <textarea class="form-input" id="sv_expenses" rows="2" placeholder="List your expense categories">${(s.expenseCategories || []).join(', ')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Payment Methods Accepted</label>
        <textarea class="form-input" id="sv_payments" rows="2" placeholder="e.g. EFT, Cash, Card">${(s.paymentMethods || []).join(', ')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Current Tracking Method</label>
        <select class="form-input" id="sv_tracking">
          <option value="">Select</option>
          <option value="Spreadsheet" ${s.trackingMethod === 'Spreadsheet' ? 'selected' : ''}>Spreadsheet</option>
          <option value="Software" ${s.trackingMethod === 'Software' ? 'selected' : ''}>Accounting Software</option>
          <option value="Manual" ${s.trackingMethod === 'Manual' ? 'selected' : ''}>Manual / Notebook</option>
          <option value="Nothing" ${s.trackingMethod === 'Nothing' ? 'selected' : ''}>Not tracking</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Monthly Transactions (est.)</label>
        <input class="form-input" id="sv_bkTxnCount" type="number" value="${s.monthlyTransactions || ''}" placeholder="e.g. 50">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Annual Turnover (ZAR)</label>
        <input class="form-input" id="sv_bkTurnover" value="${s.annualTurnover || ''}" placeholder="e.g. 500000">
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Registered for Income Tax?</label>
        <select class="form-input" id="sv_bkIncomeTax">
          <option value="">Select</option>
          <option value="yes" ${s.incomeTax === 'yes' ? 'selected' : ''}>Yes</option>
          <option value="no" ${s.incomeTax === 'no' ? 'selected' : ''}>No</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Registered for VAT?</label>
        <select class="form-input" id="sv_bkVat">
          <option value="">Select</option>
          <option value="yes" ${s.vat === 'yes' ? 'selected' : ''}>Yes</option>
          <option value="no" ${s.vat === 'no' ? 'selected' : ''}>No</option>
        </select>
      </div>
    </div>

    <p class="text-xs text-slate-500 mt-3 italic">${esc(T('services.bk_section_output'))}</p>
  </div>
`;

/* ─── Section E: Systems & Operations ─── */
const renderSystemsSection = (s) => `
  <div class="service-section">
    <h3 class="text-base font-semibold text-emerald-400 mb-1">${esc(T('services.systems_title'))}</h3>
    <p class="text-xs text-slate-400 mb-4">${esc(T('services.systems_subtitle'))}</p>

    <h4 class="text-sm font-medium text-slate-200 mb-3">${esc(T('services.operations_audit'))}</h4>
    <div class="grid grid-cols-1 gap-4 mb-6">
      <div>
        <label class="block text-sm text-slate-300 mb-1">How do you receive orders / requests?</label>
        <textarea class="form-input" id="sv_orders" rows="2" placeholder="e.g. Phone, WhatsApp, Email">${esc(s.receiveOrders || '')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">How do you track sales / clients?</label>
        <textarea class="form-input" id="sv_sales" rows="2" placeholder="e.g. Manual spreadsheet, CRM">${esc(s.trackSales || '')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">How do you manage stock / inventory?</label>
        <textarea class="form-input" id="sv_stock" rows="2" placeholder="e.g. None, Spreadsheet, Software">${esc(s.manageStock || '')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">What are your biggest operational challenges?</label>
        <textarea class="form-input" id="sv_challenges" rows="3" placeholder="Describe your pain points">${esc(s.biggestChallenges || '')}</textarea>
      </div>
    </div>

    <h4 class="text-sm font-medium text-slate-200 mb-3">${esc(T('services.process_mapping'))}</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <label class="block text-sm text-slate-300 mb-1">Describe a typical day's activities</label>
        <textarea class="form-input" id="sv_daily" rows="3" placeholder="What do you and your team do daily?">${esc(s.dailyActivities || '')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">What tools / software do you currently use?</label>
        <textarea class="form-input" id="sv_tools" rows="2" placeholder="e.g. Excel, WhatsApp, QuickBooks">${esc(s.toolsUsed || '')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">Hours per week spent on admin?</label>
        <select class="form-input" id="sv_adminTime">
          <option value="">Select</option>
          <option value="0-2" ${s.timeOnAdmin === '0-2' ? 'selected' : ''}>0-2 hours</option>
          <option value="2-5" ${s.timeOnAdmin === '2-5' ? 'selected' : ''}>2-5 hours</option>
          <option value="5-8" ${s.timeOnAdmin === '5-8' ? 'selected' : ''}>5-8 hours</option>
          <option value="8+" ${s.timeOnAdmin === '8+' ? 'selected' : ''}>8+ hours</option>
        </select>
      </div>
    </div>

    <p class="text-xs text-slate-500 mt-3 italic">${esc(T('services.systems_output'))}</p>
  </div>
`;

/* ─── Section F: CEO Support ─── */
const renderCeoSection = (s) => `
  <div class="service-section">
    <h3 class="text-base font-semibold text-rose-400 mb-1">${esc(T('packages.ceo_title'))}</h3>
    <p class="text-xs text-slate-400 mb-4">Tell us about your business so we can tailor our CEO support package.</p>

    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class="block text-sm text-slate-300 mb-1">What are your biggest business challenges right now?</label>
        <textarea class="form-input" id="sv_ceoChallenges" rows="3" placeholder="Describe your challenges">${esc(s.biggestChallenges || '')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">What areas do you need the most support with?</label>
        <textarea class="form-input" id="sv_ceoSupport" rows="3" placeholder="e.g. Strategy, Operations, Compliance, Marketing">${esc(s.supportAreas || '')}</textarea>
      </div>
      <div>
        <label class="block text-sm text-slate-300 mb-1">What tools/systems do you currently use?</label>
        <textarea class="form-input" id="sv_ceoTools" rows="2" placeholder="e.g. Excel, CRM, Accounting software">${esc(s.toolsUsed || '')}</textarea>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-slate-300 mb-1">Monthly Revenue (ZAR)</label>
          <input class="form-input" id="sv_ceoRevenue" value="${s.annualTurnover || ''}" placeholder="e.g. 100000">
        </div>
        <div>
          <label class="block text-sm text-slate-300 mb-1">Number of Employees</label>
          <input class="form-input" id="sv_ceoEmployees" type="number" value="${s.employees || ''}" placeholder="e.g. 5">
        </div>
      </div>
    </div>
  </div>
`;

/* Director helpers */
window.addDirector = () => {
  const app = Store.getCurrentApp();
  if (!app) return;
  const dirs = app.serviceData.directors || [];
  dirs.push({ fullName: '', idNumber: '', address: '', phone: '', email: '', shares: 0 });
  app.serviceData.directors = dirs;
  Store.setCurrentApp(app);
  renderApplicationForm();
};

window.removeDirector = (idx) => {
  const app = Store.getCurrentApp();
  if (!app) return;
  app.serviceData.directors = (app.serviceData.directors || []).filter((_, i) => i !== idx);
  Store.setCurrentApp(app);
  renderApplicationForm();
};

/* ─── Save service step ─── */
window.saveServiceStep = () => {
  const app = Store.getCurrentApp();
  if (!app) return;
  const pkg = app.selectedPackage;
  const s = app.serviceData || {};
  const sections = getPackageSections(pkg);

  sections.forEach(sectionId => {
    switch (sectionId) {
      case 'cipc': collectCipcData(s); break;
      case 'sars': collectSarsData(s); break;
      case 'bank': collectBankData(s); break;
      case 'bookkeeping': collectBookkeepingData(s); break;
      case 'systems': collectSystemsData(s); break;
      case 'ceo': collectCeoData(s); break;
    }
  });

  if (sections.includes('cipc')) {
    if (!s.proposedNames || s.proposedNames.length === 0 || !s.businessAddress) {
      Toast.show('Please enter at least one proposed name and address.', 'error');
      return;
    }
    if (!s.directors || !s.directors[0]?.fullName || !s.directors[0]?.idNumber) {
      Toast.show("Please fill in the first director's name and ID.", 'error');
      return;
    }
  }

  app.serviceData = s;
  app.currentStep = 3;
  Store.setCurrentApp(app);
  renderApplicationForm();
};

const collectCipcData = (s) => {
  const names = $('#sv_names')?.value?.split('\n').map(s => s.trim()).filter(Boolean) || [];
  const address = $('#sv_address')?.value?.trim();
  const companyType = $('#sv_companyType')?.value;
  const dirEls = $$('[data-dir]');
  const directors = dirEls.map(el => ({
    fullName: el.querySelector('[data-dir-field="fullName"]')?.value?.trim() || '',
    idNumber: el.querySelector('[data-dir-field="idNumber"]')?.value?.trim() || '',
    address: el.querySelector('[data-dir-field="address"]')?.value?.trim() || '',
    phone: el.querySelector('[data-dir-field="phone"]')?.value?.trim() || '',
    email: el.querySelector('[data-dir-field="email"]')?.value?.trim() || '',
    shares: parseInt(el.querySelector('[data-dir-field="shares"]')?.value) || 0,
  }));
  s.companyType = companyType;
  s.proposedNames = names;
  s.businessAddress = address;
  s.directors = directors;
};

const collectSarsData = (s) => {
  s.incomeTax = $('#sv_incomeTax')?.value || '';
  s.vat = $('#sv_vat')?.value || '';
  s.annualTurnover = $('#sv_turnover')?.value?.trim() || '';
  s.bankName = $('#sv_bank')?.value?.trim() || '';
  s.activityCode = $('#sv_activityCode')?.value?.trim() || '';
};

const collectBankData = (s) => {
  s.bankCompanyName = $('#sv_bankCompanyName')?.value?.trim() || '';
  s.registrationNumber = $('#sv_bankRegNumber')?.value?.trim() || '';
  s.monthlyTransactions = $('#sv_bankMonthlyTxns')?.value?.trim() || '';
};

const collectBookkeepingData = (s) => {
  s.incomeSources = ($('#sv_income')?.value || '').split(',').map(x => x.trim()).filter(Boolean);
  s.expenseCategories = ($('#sv_expenses')?.value || '').split(',').map(x => x.trim()).filter(Boolean);
  s.paymentMethods = ($('#sv_payments')?.value || '').split(',').map(x => x.trim()).filter(Boolean);
  s.trackingMethod = $('#sv_tracking')?.value || '';
  s.monthlyTransactions = $('#sv_bkTxnCount')?.value?.trim() || '';
  s.annualTurnover = $('#sv_bkTurnover')?.value?.trim() || '';
  s.incomeTax = $('#sv_bkIncomeTax')?.value || '';
  s.vat = $('#sv_bkVat')?.value || '';
};

const collectSystemsData = (s) => {
  s.receiveOrders = $('#sv_orders')?.value?.trim() || '';
  s.trackSales = $('#sv_sales')?.value?.trim() || '';
  s.manageStock = $('#sv_stock')?.value?.trim() || '';
  s.biggestChallenges = $('#sv_challenges')?.value?.trim() || '';
  s.dailyActivities = $('#sv_daily')?.value?.trim() || '';
  s.toolsUsed = $('#sv_tools')?.value?.trim() || '';
  s.timeOnAdmin = $('#sv_adminTime')?.value || '';
};

const collectCeoData = (s) => {
  s.biggestChallenges = $('#sv_ceoChallenges')?.value?.trim() || '';
  s.supportAreas = $('#sv_ceoSupport')?.value?.trim() || '';
  s.toolsUsed = $('#sv_ceoTools')?.value?.trim() || '';
  s.annualTurnover = $('#sv_ceoRevenue')?.value?.trim() || '';
  s.employees = $('#sv_ceoEmployees')?.value?.trim() || '';
};

/* ─── Step 3: Document Upload ─── */
const renderUploadStep = (app) => {
  const docs = app.documents || { files: [] };
  const fileList = docs.files || [];

  return `
    <h2 class="text-xl font-bold text-white mb-6">${esc(T('form.step_upload'))}</h2>
    <p class="text-sm text-slate-400 mb-6">Upload relevant documents to help us process your application faster.</p>

    <div class="space-y-6">
      <div class="upload-zone" id="uploadZone">
        <div class="text-4xl mb-2">📄</div>
        <p class="text-slate-300 font-medium">${esc(T('form.upload_drag'))}</p>
        <p class="text-xs text-slate-500 mt-1">PDF, JPG, PNG, DOCX — Max 10MB each</p>
        <input type="file" id="fileInput" class="hidden" multiple accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx">
      </div>

      <div id="fileList" class="space-y-2">
        ${fileList.map((f, i) => `
          <div class="file-item">
            <span class="text-lg">${f.type?.startsWith('image/') ? '🖼️' : '📄'}</span>
            <span class="text-sm text-slate-300 flex-1 truncate">${esc(f.name)}</span>
            <span class="text-xs text-slate-500">${(f.size / 1024).toFixed(0)} KB</span>
            <span class="remove-file" onclick="removeFile(${i})">✕</span>
          </div>
        `).join('')}
        ${fileList.length === 0 ? '<p class="text-xs text-slate-500 text-center py-4">No files uploaded yet.</p>' : ''}
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <button onclick="goToStep(2)" class="px-6 py-2.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
        ${esc(T('form.back'))}
      </button>
      <button onclick="goToStep(4)" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all">
        ${esc(T('form.next'))}
      </button>
    </div>
  `;
};

window.initUpload = () => {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('fileInput');
  if (!zone || !input) return;

  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', (e) => {
    handleFiles([...e.target.files]);
    input.value = '';
  });
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    handleFiles([...e.dataTransfer.files]);
  });
};

const handleFiles = (newFiles) => {
  const app = Store.getCurrentApp();
  if (!app) return;
  const docs = app.documents || { files: [] };
  const MAX_SIZE = 10 * 1024 * 1024;
  newFiles.forEach(f => {
    if (f.size > MAX_SIZE) {
      Toast.show(`${f.name} is too large (max 10MB).`, 'error');
      return;
    }
    docs.files.push({
      id: Store.uid(),
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
    });
  });
  app.documents = docs;
  Store.setCurrentApp(app);
  renderApplicationForm();
  setTimeout(window.initUpload, 50);
};

window.removeFile = (idx) => {
  const app = Store.getCurrentApp();
  if (!app) return;
  const docs = app.documents || { files: [] };
  docs.files = docs.files.filter((_, i) => i !== idx);
  app.documents = docs;
  Store.setCurrentApp(app);
  renderApplicationForm();
  setTimeout(window.initUpload, 50);
};

/* ─── Step 4: Review & Submit ─── */
const renderReviewStep = (app) => {
  const p = app.clientProfile || {};
  const b = app.businessOverview || {};
  const s = app.serviceData || {};
  const docs = app.documents || { files: [] };
  const pkg = PACKAGES.find(pk => pk.id === app.selectedPackage);

  return `
    <h2 class="text-xl font-bold text-white mb-2">${esc(T('form.review_title'))}</h2>
    <p class="text-sm text-slate-400 mb-6">${esc(T('form.review_subtitle'))}</p>

    <div class="review-section">
      <h3>${esc(T('form.step_service'))} <button onclick="editStep(2)" class="text-xs text-cyan-400 hover:text-cyan-300">${esc(T('form.edit_step'))}</button></h3>
      <div class="review-row"><span class="review-label">Package</span><span class="review-value">${pkg ? esc(T(pkg.titleKey)) : app.selectedPackage}</span></div>
    </div>

    <div class="review-section">
      <h3>${esc(T('form.step_profile'))} <button onclick="editStep(0)" class="text-xs text-cyan-400 hover:text-cyan-300">${esc(T('form.edit_step'))}</button></h3>
      ${p.fullName ? `<div class="review-row"><span class="review-label">Name</span><span class="review-value">${esc(p.fullName)}</span></div>` : ''}
      ${p.idNumber ? `<div class="review-row"><span class="review-label">ID Number</span><span class="review-value">${esc(p.idNumber)}</span></div>` : ''}
      ${p.phone ? `<div class="review-row"><span class="review-label">Phone</span><span class="review-value">${esc(p.phone)}</span></div>` : ''}
      ${p.email ? `<div class="review-row"><span class="review-label">Email</span><span class="review-value">${esc(p.email)}</span></div>` : ''}
      ${p.province ? `<div class="review-row"><span class="review-label">Province</span><span class="review-value">${esc(p.province)}</span></div>` : ''}
    </div>

    <div class="review-section">
      <h3>${esc(T('form.step_business'))} <button onclick="editStep(1)" class="text-xs text-cyan-400 hover:text-cyan-300">${esc(T('form.edit_step'))}</button></h3>
      ${b.name ? `<div class="review-row"><span class="review-label">Business Name</span><span class="review-value">${esc(b.name)}</span></div>` : ''}
      ${b.activity ? `<div class="review-row"><span class="review-label">Activity</span><span class="review-value">${esc(b.activity)}</span></div>` : ''}
      ${b.industry ? `<div class="review-row"><span class="review-label">Industry</span><span class="review-value">${esc(b.industry)}</span></div>` : ''}
    </div>

    <div class="review-section">
      <h3>${esc(T('form.step_upload'))} <button onclick="editStep(3)" class="text-xs text-cyan-400 hover:text-cyan-300">${esc(T('form.edit_step'))}</button></h3>
      <div class="review-row"><span class="review-label">Files</span><span class="review-value">${docs.files.length} file(s)</span></div>
    </div>

    <div class="mt-8 flex justify-between">
      <button onclick="goToStep(3)" class="px-6 py-2.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
        ${esc(T('form.back'))}
      </button>
      <button onclick="submitApplication()" class="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
        ${esc(T('form.submit'))}
      </button>
    </div>
  `;
};

window.editStep = (step) => {
  const app = Store.getCurrentApp();
  if (!app) return;
  app.currentStep = step;
  Store.setCurrentApp(app);
  renderApplicationForm();
};

window.submitApplication = () => {
  const app = Store.getCurrentApp();
  if (!app) return;
  app.status = 'new';
  app.submittedAt = Date.now();
  Store.saveSubmission(app);
  Store.clearCurrentApp();
  renderConfirmation();
};

/* ─── Confirmation Page ─── */
const renderConfirmation = () => {
  const html = `
    <div class="max-w-2xl mx-auto text-center">
      <div class="check-circle mb-6">
        <div class="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto">
          <svg class="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>
      <h1 class="text-3xl font-bold text-white mb-2">${esc(T('confirmation.title'))}</h1>
      <p class="text-slate-400 mb-8">${esc(T('confirmation.subtitle'))}</p>

      <div class="text-left max-w-md mx-auto mb-8">
        <h3 class="text-sm font-semibold text-cyan-400 mb-4">${esc(T('confirmation.timeline_title'))}</h3>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <p class="text-sm text-slate-300">${esc(T('confirmation.step_1'))}</p>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <p class="text-sm text-slate-300">${esc(T('confirmation.step_2'))}</p>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <p class="text-sm text-slate-300">${esc(T('confirmation.step_3'))}</p>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <p class="text-sm text-slate-300">${esc(T('confirmation.step_4'))}</p>
        </div>
      </div>

      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h3 class="font-semibold text-white mb-2">${esc(T('confirmation.contact_title'))}</h3>
        <p class="text-sm text-slate-400">${esc(T('confirmation.contact_desc'))}</p>
        <div class="flex gap-4 justify-center mt-4">
          <a href="https://wa.me/27123456789" target="_blank" class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-all">WhatsApp</a>
          <a href="mailto:info@khanyisaconsulting.co.za" class="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition-all">Email</a>
        </div>
      </div>

      <button onclick="Router.navigate('/')" class="px-6 py-2.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
        ${esc(T('confirmation.back_home'))}
      </button>
    </div>
  `;
  renderTo(html);
};

window.goToStep = (step) => {
  const app = Store.getCurrentApp();
  if (!app) return;
  app.currentStep = step;
  Store.setCurrentApp(app);
  renderApplicationForm();
};

/* ═══════════════════════════════════════════════════════════
   WAITLIST PAGE
   ═══════════════════════════════════════════════════════════ */

const renderWaitlist = () => {
  const html = `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-2 text-center">${esc(T('waitlist.title'))}</h1>
      <p class="text-slate-400 text-center mb-8">${esc(T('waitlist.subtitle'))}</p>

      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm text-slate-300 mb-1">${esc(T('waitlist.field_name'))} *</label>
            <input class="form-input" id="wl_name" placeholder="e.g. John Doe">
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">${esc(T('waitlist.field_email'))} *</label>
            <input class="form-input" id="wl_email" type="email" placeholder="e.g. john@example.com">
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">${esc(T('waitlist.field_phone'))} *</label>
            <input class="form-input" id="wl_phone" placeholder="e.g. 0821234567">
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">${esc(T('waitlist.field_package'))}</label>
            <select class="form-input" id="wl_package">
              <option value="">${esc(T('waitlist.select_placeholder'))}</option>
              ${PACKAGES.map(p => `<option value="${p.id}">${esc(T(p.titleKey))}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">${esc(T('waitlist.field_stage'))}</label>
            <select class="form-input" id="wl_stage">
              <option value="">${esc(T('waitlist.select_placeholder'))}</option>
              ${QUAL_OPTIONS.map(q => `<option value="${q.id}">${esc(T(q.titleKey))}</option>`).join('')}
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm text-slate-300 mb-1">${esc(T('waitlist.field_urgency'))}</label>
            <div class="flex gap-3">
              <label class="custom-check flex-1"><input type="radio" name="wl_urgency" value="ASAP"> <span>${esc(T('waitlist.urgency_asap'))}</span></label>
              <label class="custom-check flex-1"><input type="radio" name="wl_urgency" value="This month"> <span>${esc(T('waitlist.urgency_month'))}</span></label>
              <label class="custom-check flex-1"><input type="radio" name="wl_urgency" value="Exploring"> <span>${esc(T('waitlist.urgency_exploring'))}</span></label>
            </div>
          </div>
        </div>
        <button onclick="submitWaitlist()" class="mt-6 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all">
          ${esc(T('waitlist.submit'))}
        </button>
      </div>
    </div>
  `;
  renderTo(html);
};

window.submitWaitlist = () => {
  const name = $('#wl_name')?.value?.trim();
  const email = $('#wl_email')?.value?.trim();
  const phone = $('#wl_phone')?.value?.trim();
  const pkg = $('#wl_package')?.value;
  const stage = $('#wl_stage')?.value;
  const urgency = $$('input[name="wl_urgency"]:checked')[0]?.value || '';

  if (!name || !email || !phone) {
    Toast.show('Please fill in your name, email and phone.', 'error');
    return;
  }

  Store.addToWaitlist({ name, email, phone, package: pkg, stage, urgency });
  Toast.show(T('waitlist.success'));
  ['wl_name', 'wl_email', 'wl_phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['wl_package', 'wl_stage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  $$('input[name="wl_urgency"]:checked').forEach(el => el.checked = false);
};

/* ═══════════════════════════════════════════════════════════
   ADMIN PAGE
   ═══════════════════════════════════════════════════════════ */

const renderAdmin = () => {
  if (!Store.isAdminLoggedIn()) {
    renderAdminLogin();
    return;
  }
  renderAdminDashboard();
};

const renderAdminLogin = () => {
  const html = `
    <div class="max-w-sm mx-auto mt-12">
      <div class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <div class="text-4xl mb-4">🔐</div>
        <h2 class="text-xl font-bold text-white mb-2">Admin Access</h2>
        <p class="text-sm text-slate-400 mb-6">Enter your PIN to access the dashboard.</p>
        <input class="form-input text-center text-2xl tracking-widest mb-4" id="adminPin" type="password" maxlength="4" placeholder="****" inputmode="numeric">
        <button onclick="adminLogin()" class="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all">
          Sign In
        </button>
      </div>
    </div>
  `;
  renderTo(html);
  setTimeout(() => document.getElementById('adminPin')?.focus(), 100);
};

window.adminLogin = () => {
  const pin = document.getElementById('adminPin')?.value;
  if (!pin) { Toast.show('Please enter your PIN.', 'error'); return; }
  if (Store.adminLogin(pin)) {
    Toast.show('Welcome, admin!');
    renderAdminDashboard();
  } else {
    Toast.show('Invalid PIN. Try 1234.', 'error');
  }
};

const renderAdminDashboard = () => {
  const submissions = Store.getSubmissions();
  const total = submissions.length;
  const statusCounts = { new: 0, progress: 0, waiting: 0, completed: 0 };
  submissions.forEach(s => { if (statusCounts[s.status] !== undefined) statusCounts[s.status]++; });

  const html = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">${esc(T('admin.title'))}</h1>
        <p class="text-sm text-slate-400">${esc(T('admin.subtitle'))}</p>
      </div>
      <div class="flex gap-2">
        <button onclick="exportCSV()" class="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5">${esc(T('admin.export_csv'))}</button>
        <button onclick="adminLogout()" class="px-3 py-1.5 rounded-lg border border-red-500/30 text-xs text-red-400 hover:bg-red-500/10">Sign Out</button>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div class="stat-card"><p class="text-2xl font-bold text-white">${total}</p><p class="text-xs text-slate-400">${esc(T('admin.total_label'))}</p></div>
      <div class="stat-card"><p class="text-2xl font-bold text-cyan-400">${statusCounts.new}</p><p class="text-xs text-slate-400">New</p></div>
      <div class="stat-card"><p class="text-2xl font-bold text-amber-400">${statusCounts.progress}</p><p class="text-xs text-slate-400">In Progress</p></div>
      <div class="stat-card"><p class="text-2xl font-bold text-orange-400">${statusCounts.waiting}</p><p class="text-xs text-slate-400">${esc(T('admin.status_waiting'))}</p></div>
      <div class="stat-card"><p class="text-2xl font-bold text-emerald-400">${statusCounts.completed}</p><p class="text-xs text-slate-400">Completed</p></div>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 mb-4 flex-wrap items-center">
      <button class="filter-pill active" data-filter="all" onclick="filterAdmin('all', this)">${esc(T('admin.filter_all'))}</button>
      <button class="filter-pill" data-filter="new" onclick="filterAdmin('new', this)">${esc(T('admin.filter_new'))}</button>
      <button class="filter-pill" data-filter="progress" onclick="filterAdmin('progress', this)">${esc(T('admin.filter_progress'))}</button>
      <button class="filter-pill" data-filter="waiting" onclick="filterAdmin('waiting', this)">${esc(T('admin.filter_waiting'))}</button>
      <button class="filter-pill" data-filter="completed" onclick="filterAdmin('completed', this)">${esc(T('admin.filter_completed'))}</button>
      <span class="text-xs text-slate-500 mx-1">|</span>
      <select class="form-input !w-auto !py-1.5 !px-3 !text-xs" id="adminPackageFilter" onchange="filterAdminByPackage()">
        <option value="all">${esc(T('admin.filter_package_all'))}</option>
        ${PACKAGES.map(p => `<option value="${p.id}">${esc(T(p.titleKey))}</option>`).join('')}
      </select>
    </div>

    <div class="table-wrapper bg-white/5 border border-white/10 rounded-2xl">
      ${total === 0 ? `
        <p class="text-center text-slate-500 py-12">${esc(T('admin.no_clients'))}</p>
      ` : `
        <table class="admin-table" id="adminTable">
          <thead>
            <tr>
              <th>${esc(T('admin.col_name'))}</th>
              <th>${esc(T('admin.col_package'))}</th>
              <th>${esc(T('admin.col_date'))}</th>
              <th>${esc(T('admin.col_status'))}</th>
              <th>${esc(T('admin.col_actions'))}</th>
            </tr>
          </thead>
          <tbody id="adminTableBody">
            ${submissions.map(s => renderAdminRow(s)).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
  renderTo(html);
};

const renderAdminRow = (s) => {
  const name = s.clientProfile?.fullName || 'Unknown';
  const pkg = PACKAGES.find(p => p.id === s.selectedPackage);
  const pkgName = pkg ? T(pkg.titleKey) : s.selectedPackage;
  const date = new Date(s.createdAt).toLocaleDateString();
  const statusKey = `admin.status_${s.status}`;
  const badgeClass = s.status === 'new' ? 'badge-new' : s.status === 'progress' ? 'badge-progress' : s.status === 'waiting' ? 'badge-waiting' : 'badge-completed';

  return `
    <tr>
      <td class="font-medium text-white">${esc(name)}</td>
      <td class="text-slate-300">${esc(pkgName)}</td>
      <td class="text-slate-400 text-sm">${date}</td>
      <td><span class="badge ${badgeClass}">${esc(T(statusKey))}</span></td>
      <td>
        <button onclick="viewClient('${s.id}')" class="text-xs text-cyan-400 hover:text-cyan-300 mr-3">View</button>
        <button onclick="deleteClient('${s.id}')" class="text-xs text-red-400 hover:text-red-300">Delete</button>
      </td>
    </tr>
  `;
};

/* ─── Admin filter functions ─── */

window.filterAdmin = (filter, btn) => {
  $$('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  const pkgFilter = document.getElementById('adminPackageFilter')?.value || 'all';
  applyAdminFilters(filter, pkgFilter);
};

window.filterAdminByPackage = () => {
  const activeFilter = $$('.filter-pill.active')[0]?.getAttribute('data-filter') || 'all';
  const pkgFilter = document.getElementById('adminPackageFilter')?.value || 'all';
  applyAdminFilters(activeFilter, pkgFilter);
};

const applyAdminFilters = (statusFilter, pkgFilter) => {
  const submissions = Store.getSubmissions();
  let filtered = statusFilter === 'all' ? submissions : submissions.filter(s => s.status === statusFilter);
  if (pkgFilter !== 'all') {
    filtered = filtered.filter(s => s.selectedPackage === pkgFilter);
  }
  const tbody = document.getElementById('adminTableBody');
  if (tbody) {
    tbody.innerHTML = filtered.map(s => renderAdminRow(s)).join('');
  }
};

window.viewClient = (id) => {
  const submissions = Store.getSubmissions();
  const app = submissions.find(s => s.id === id);
  if (!app) { Toast.show('Client not found.', 'error'); return; }

  const p = app.clientProfile || {};
  const b = app.businessOverview || {};
  const s = app.serviceData || {};
  const docs = app.documents || { files: [] };
  const pkg = PACKAGES.find(pk => pk.id === app.selectedPackage);
  const pkgName = pkg ? T(pkg.titleKey) : app.selectedPackage;
  const date = new Date(app.createdAt).toLocaleString();

  const statusOptions = ['new', 'progress', 'waiting', 'completed'];

  Modal.open(`
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-white">${esc(T('admin.details_title'))}</h2>
      <button onclick="Modal.close()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
    </div>

    <div class="flex gap-2 mb-6">
      ${statusOptions.map(st => `
        <button onclick="updateClientStatus('${id}', '${st}')" class="px-3 py-1.5 rounded-lg text-xs font-medium ${app.status === st ? 'bg-cyan-600 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}">
          ${esc(T('admin.status_' + st))}
        </button>
      `).join('')}
    </div>

    <div class="review-section">
      <h3>Application Info</h3>
      <div class="review-row"><span class="review-label">Date</span><span class="review-value">${date}</span></div>
      <div class="review-row"><span class="review-label">Package</span><span class="review-value">${esc(pkgName)}</span></div>
      <div class="review-row"><span class="review-label">Stage</span><span class="review-value">${esc(app.qualificationStage || '-')}</span></div>
    </div>

    <div class="review-section">
      <h3>Client Profile</h3>
      ${p.fullName ? `<div class="review-row"><span class="review-label">Name</span><span class="review-value">${esc(p.fullName)}</span></div>` : ''}
      ${p.phone ? `<div class="review-row"><span class="review-label">Phone</span><span class="review-value">${esc(p.phone)}</span></div>` : ''}
      ${p.email ? `<div class="review-row"><span class="review-label">Email</span><span class="review-value">${esc(p.email)}</span></div>` : ''}
      ${p.province ? `<div class="review-row"><span class="review-label">Province</span><span class="review-value">${esc(p.province)}</span></div>` : ''}
    </div>

    <div class="review-section">
      <h3>Business</h3>
      ${b.name ? `<div class="review-row"><span class="review-label">Name</span><span class="review-value">${esc(b.name)}</span></div>` : ''}
      ${b.activity ? `<div class="review-row"><span class="review-label">Activity</span><span class="review-value">${esc(b.activity)}</span></div>` : ''}
    </div>

    <div class="review-section">
      <h3>Documents</h3>
      <div class="review-row"><span class="review-label">Files</span><span class="review-value">${docs.files.length} uploaded</span></div>
    </div>

    <button onclick="Modal.close()" class="w-full mt-4 px-4 py-2 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
      ${esc(T('admin.close'))}
    </button>
  `);
};

window.updateClientStatus = (id, status) => {
  Store.updateSubmissionStatus(id, status);
  Toast.show('Status updated!');
  Modal.close();
  renderAdminDashboard();
};

window.deleteClient = (id) => {
  if (!confirm('Delete this application?')) return;
  Store.deleteSubmission(id);
  Toast.show('Application deleted.');
  renderAdminDashboard();
};

window.adminLogout = () => {
  Store.adminLogout();
  renderAdminLogin();
};

window.exportCSV = () => {
  const submissions = Store.getSubmissions();
  if (submissions.length === 0) { Toast.show('No data to export.', 'error'); return; }

  const headers = ['Name', 'Email', 'Phone', 'Package', 'Status', 'Date', 'Business Name', 'Activity'];
  const rows = submissions.map(s => [
    s.clientProfile?.fullName || '',
    s.clientProfile?.email || '',
    s.clientProfile?.phone || '',
    s.selectedPackage || '',
    s.status || '',
    new Date(s.createdAt).toISOString(),
    s.businessOverview?.name || '',
    s.businessOverview?.activity || '',
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'khanyisa_applications.csv';
  link.click();
  URL.revokeObjectURL(link.href);
  Toast.show('CSV exported!');
};

/* ═══════════════════════════════════════════════════════════
   ROUTE REGISTRATION
   ═══════════════════════════════════════════════════════════ */

const initRoutes = () => {
  Router.register('/', renderHome);
  Router.register('/packages', renderPackages);
  Router.register('/waitlist', renderWaitlist);
  Router.register('/admin', renderAdmin);

  Router.register('/apply', () => {
    const app = Store.getCurrentApp();
    if (app) {
      renderApplicationForm();
    } else {
      Router.navigate('/');
    }
  });
};
