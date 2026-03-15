/**
 * Data Connector — Mock Implementations
 * Simulates fetching data from external APIs (DigiLocker, ABHA, AA, LinkedIn)
 * Returns realistic fake data matching real API response shapes.
 * Each function adds a simulated delay for realism.
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch education certificates from DigiLocker
 */
async function fetchDigiLockerData(userId) {
  await delay(800);
  return {
    source: 'DigiLocker',
    fetchedAt: new Date().toISOString(),
    documents: [
      { type: 'degree', title: 'B.Tech Computer Science', institution: 'MIT Pune', year: 2020, verified: true, docId: 'DL-EDU-001' },
      { type: 'certificate', title: '12th Standard (CBSE)', institution: 'DPS School', year: 2016, percentage: 91.2, verified: true, docId: 'DL-EDU-002' },
      { type: 'certificate', title: 'AWS Solutions Architect', institution: 'Amazon', year: 2023, verified: true, docId: 'DL-CERT-001' },
    ],
    governmentDocs: [
      { type: 'aadhaar', lastFour: '1234', verified: true },
      { type: 'pan', number: 'ABCDE1234F', verified: true },
    ],
  };
}

/**
 * Fetch health records from ABHA (Ayushman Bharat Health Account)
 */
async function fetchABHAData(userId) {
  await delay(600);
  return {
    source: 'ABHA',
    fetchedAt: new Date().toISOString(),
    healthId: 'ABHA-12345678',
    bloodGroup: 'B+',
    allergies: ['Penicillin'],
    conditions: [],
    insurance: { provider: 'Star Health', policyNo: 'SH-9876543', active: true, expiresAt: '2025-12-31' },
    recentVisits: [
      { date: '2025-01-15', hospital: 'Apollo Hospital', type: 'Annual Checkup', doctor: 'Dr. Sharma' },
      { date: '2024-08-20', hospital: 'Fortis', type: 'Dental', doctor: 'Dr. Mehta' },
    ],
  };
}

/**
 * Fetch financial summary from Account Aggregator
 */
async function fetchAAData(userId) {
  await delay(700);
  return {
    source: 'Account Aggregator',
    fetchedAt: new Date().toISOString(),
    accounts: [
      { bank: 'SBI', type: 'savings', balance: 245000, accountNo: '****6789' },
      { bank: 'HDFC', type: 'salary', balance: 180000, accountNo: '****3456' },
    ],
    creditScore: 742,
    monthlyIncome: 85000,
    loans: [
      { type: 'home_loan', bank: 'SBI', amount: 3500000, remaining: 2800000, emi: 28000, status: 'active' },
    ],
    investments: [
      { type: 'mutual_fund', platform: 'Zerodha', value: 320000 },
      { type: 'ppf', value: 150000 },
    ],
  };
}

/**
 * Fetch employment history from LinkedIn/HRMS
 */
async function fetchLinkedInData(userId) {
  await delay(500);
  return {
    source: 'LinkedIn/HRMS',
    fetchedAt: new Date().toISOString(),
    currentPosition: { title: 'Senior Software Engineer', company: 'Infosys', startDate: '2023-04-01', location: 'Pune' },
    experience: [
      { title: 'Senior Software Engineer', company: 'Infosys', startDate: '2023-04-01', endDate: null, current: true },
      { title: 'Software Engineer', company: 'TCS', startDate: '2021-01-15', endDate: '2023-03-31', current: false },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    certifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon', year: 2023 },
    ],
  };
}

module.exports = { fetchDigiLockerData, fetchABHAData, fetchAAData, fetchLinkedInData };
