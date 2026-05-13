// ============================================================
// STORE – Central state management & localStorage persistence
// ============================================================

const Store = (() => {
  const KEYS = {
    SUBMISSIONS: 'kc_submissions',
    WAITLIST: 'kc_waitlist',
    CURRENT_APP: 'kc_current_app',
    ADMIN_AUTH: 'kc_admin_auth',
  };

  const ADMIN_PIN = '1234'; // Simple PIN for demo

  // --- Helpers ---
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);

  const read = (key) => {
    try { return JSON.parse(localStorage.getItem(key)) || null; }
    catch { return null; }
  };

  const write = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
  };

  // --- Submissions ---
  const getSubmissions = () => read(KEYS.SUBMISSIONS) || [];
  const saveSubmission = (app) => {
    const all = getSubmissions();
    const idx = all.findIndex(a => a.id === app.id);
    if (idx >= 0) all[idx] = app;
    else all.push(app);
    write(KEYS.SUBMISSIONS, all);
    return app;
  };
  const updateSubmissionStatus = (id, status) => {
    const all = getSubmissions();
    const app = all.find(a => a.id === id);
    if (app) { app.status = status; write(KEYS.SUBMISSIONS, all); }
    return app;
  };
  const deleteSubmission = (id) => {
    const all = getSubmissions().filter(a => a.id !== id);
    write(KEYS.SUBMISSIONS, all);
  };

  // --- Current Application (in-progress form) ---
  const getCurrentApp = () => read(KEYS.CURRENT_APP);
  const setCurrentApp = (app) => write(KEYS.CURRENT_APP, app);
  const clearCurrentApp = () => localStorage.removeItem(KEYS.CURRENT_APP);

  const createNewApp = (pkg, stage) => {
    const app = {
      id: uid(),
      createdAt: Date.now(),
      status: 'new',
      selectedPackage: pkg,
      qualificationStage: stage,
      currentStep: 0,
      clientProfile: {},
      businessOverview: {},
      serviceData: {},
      documents: { files: [] },
    };
    setCurrentApp(app);
    return app;
  };

  // --- Waitlist ---
  const getWaitlist = () => read(KEYS.WAITLIST) || [];
  const addToWaitlist = (entry) => {
    const all = getWaitlist();
    entry.id = uid();
    entry.createdAt = Date.now();
    all.push(entry);
    write(KEYS.WAITLIST, all);
    return entry;
  };

  // --- Admin Auth ---
  const isAdminLoggedIn = () => read(KEYS.ADMIN_AUTH) === true;
  const adminLogin = (pin) => {
    if (pin === ADMIN_PIN) { write(KEYS.ADMIN_AUTH, true); return true; }
    return false;
  };
  const adminLogout = () => localStorage.removeItem(KEYS.ADMIN_AUTH);

  // --- Seed demo data ---
  const seedDemoData = () => {
    if (getSubmissions().length > 0) return;
    const demo = [
      {
        id: uid(), createdAt: Date.now() - 86400000 * 3, status: 'progress',
        selectedPackage: 'kickstart', qualificationStage: 'startup',
        clientProfile: { fullName: 'Thabo Molefe', idNumber: '9001015800088', phone: '0821234567', email: 'thabo@example.co.za', province: 'Gauteng', communication: 'WhatsApp' },
        businessOverview: { name: 'Molefe Trading', activity: 'Retail', industry: 'General Trade', startDate: '2024-01', revenue: '0-5000', employees: '0' },
        serviceData: {
          companyType: 'pty',
          proposedNames: ['Molefe Trading Pty Ltd', 'T.Molefe Enterprises', 'Molefe Ventures'],
          businessAddress: '12 Main Rd, Johannesburg',
          directors: [{ fullName: 'Thabo Molefe', idNumber: '9001015800088', address: '12 Main Rd, JHB', phone: '0821234567', email: 'thabo@example.co.za', shares: 100 }],
          bankCompanyName: 'Molefe Trading Pty Ltd',
          registrationNumber: '',
          monthlyTransactions: '20',
        },
        documents: { files: [] },
      },
      {
        id: uid(), createdAt: Date.now() - 86400000 * 1, status: 'new',
        selectedPackage: 'sidehustle', qualificationStage: 'operating',
        clientProfile: { fullName: 'Naledi Khumalo', idNumber: '8506120200088', phone: '0734567890', email: 'naledi@biz.co.za', province: 'KwaZulu-Natal', communication: 'Email' },
        businessOverview: { name: 'NK Designs', activity: 'Fashion Design', industry: 'Creative', startDate: '2022-06', revenue: '5000-20000', employees: '1-5' },
        serviceData: {
          companyType: 'pty',
          proposedNames: ['NK Designs Pty Ltd', 'Naledi Fashion House', 'NK Creative Co'],
          businessAddress: '45 Beach Rd, Durban',
          directors: [{ fullName: 'Naledi Khumalo', idNumber: '8506120200088', address: '45 Beach Rd', phone: '0734567890', email: 'naledi@biz.co.za', shares: 100 }],
          incomeTax: 'yes', vat: 'no',
          annualTurnover: '120000',
          activityCode: '14100',
          bankName: 'FNB',
          accountNumber: '62401234567',
          branchCode: '250655',
          bankCompanyName: 'NK Designs Pty Ltd',
          registrationNumber: '',
          monthlyTransactions: '50',
          incomeSources: ['Product Sales', 'Custom Orders'],
          expenseCategories: ['Materials', 'Marketing', 'Rent'],
          paymentMethods: ['EFT', 'Cash', 'Card'],
          trackingMethod: 'Spreadsheet',
        },
        documents: { files: [] },
      },
      {
        id: uid(), createdAt: Date.now() - 86400000 * 5, status: 'completed',
        selectedPackage: 'systems', qualificationStage: 'systems',
        clientProfile: { fullName: 'Pieter van der Merwe', idNumber: '7803055100088', phone: '0845678901', email: 'pieter@ops.co.za', province: 'Western Cape', communication: 'Call' },
        businessOverview: { name: 'VanDerMerwe Logistics', activity: 'Logistics', industry: 'Transport', startDate: '2019-03', revenue: '50000-200000', employees: '10-50' },
        serviceData: {
          receiveOrders: 'Phone and WhatsApp',
          trackSales: 'Manual spreadsheet',
          manageStock: 'None',
          biggestChallenges: 'No visibility on deliveries, slow invoicing',
          dailyActivities: 'Dispatching, client calls, admin',
          toolsUsed: 'Excel, WhatsApp',
          timeOnAdmin: '5-8',
        },
        documents: { files: [] },
      },
      {
        id: uid(), createdAt: Date.now() - 86400000 * 2, status: 'new',
        selectedPackage: 'standalone', qualificationStage: 'compliance',
        clientProfile: { fullName: 'Zanele Mokoena', idNumber: '9208150200088', phone: '0723456789', email: 'zanele@example.co.za', province: 'Gauteng', communication: 'WhatsApp' },
        businessOverview: { name: 'Mokoena Enterprises', activity: 'Consulting', industry: 'Business Services', startDate: '', revenue: '0-5000', employees: '0' },
        serviceData: {
          companyType: 'pty',
          proposedNames: ['Mokoena Enterprises Pty Ltd', 'Zanele Consulting', 'Mokoena Business Solutions'],
          businessAddress: '78 Oak Ave, Sandton',
          directors: [{ fullName: 'Zanele Mokoena', idNumber: '9208150200088', address: '78 Oak Ave, Sandton', phone: '0723456789', email: 'zanele@example.co.za', shares: 100 }],
        },
        documents: { files: [] },
      },
      {
        id: uid(), createdAt: Date.now() - 86400000 * 4, status: 'progress',
        selectedPackage: 'orgreset', qualificationStage: 'systems',
        clientProfile: { fullName: 'Sipho Dlamini', idNumber: '8812015400088', phone: '0834567890', email: 'sipho@dlaminigroup.co.za', province: 'KwaZulu-Natal', communication: 'Call' },
        businessOverview: { name: 'Dlamini Group', activity: 'Manufacturing', industry: 'Manufacturing', startDate: '2018-06', revenue: '50000-200000', employees: '10-50' },
        serviceData: {
          receiveOrders: 'Email and Phone',
          trackSales: 'Excel spreadsheet',
          manageStock: 'Manual count',
          biggestChallenges: 'Inventory mismanagement, slow order processing, no CRM',
          dailyActivities: 'Production scheduling, client follow-ups, stock checks',
          toolsUsed: 'Excel, WhatsApp, Sage',
          timeOnAdmin: '8+',
        },
        documents: { files: [] },
      },
    ];
    write(KEYS.SUBMISSIONS, demo);
  };

  return {
    uid, getSubmissions, saveSubmission, updateSubmissionStatus, deleteSubmission,
    getCurrentApp, setCurrentApp, clearCurrentApp, createNewApp,
    getWaitlist, addToWaitlist,
    isAdminLoggedIn, adminLogin, adminLogout,
    seedDemoData,
  };
})();
