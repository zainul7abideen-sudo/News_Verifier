const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'store.json');

const INITIAL_DATA = {
  news: [
    {
      id: 'news-1',
      title: 'Major Infrastructure Project Announced for Highway Expansion in Uttar Pradesh',
      source: 'NDTV India',
      type: 'News Channels',
      category: 'National',
      timestamp: '30 mins ago',
      content: 'The Ministry of Road Transport and Highways has cleared a major budget for phase 3 of the corridor expansion.',
      factChecked: true,
      verdict: 'True',
      confidence: 96,
      explanation: 'Verified directly with Ministry of Road Transport and Highways official press release #MoRTH-2026-09.',
      image: 'https://images.unsplash.com/photo-1545143333-11cb50c33b9c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'news-2',
      title: 'Claims of New Currency Notes Starting from Next Month Found to be Fabricated',
      source: 'PIB Fact Check',
      type: 'Social Media',
      category: 'Trending',
      timestamp: '2 hours ago',
      content: 'Viral messages on WhatsApp claiming the RBI is issuing new ₹5000 notes are completely false.',
      factChecked: true,
      verdict: 'False',
      confidence: 99,
      explanation: 'Debunked by Reserve Bank of India and Press Information Bureau official release. No such currency exists.',
      image: 'https://images.unsplash.com/photo-1627000086207-77e8fd117bcf?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'news-3',
      title: 'Tech Innovation Hub Setup Planned in Bengaluru by Global Tech Giant',
      source: 'The Hindu',
      type: 'Newspapers',
      category: 'Technology',
      timestamp: '4 hours ago',
      content: 'A leading Silicon Valley company is in final stages of signing an MOU for a 50-acre R&D campus.',
      factChecked: true,
      verdict: 'True',
      confidence: 92,
      explanation: 'Confirmed through State IT Ministry statements and corporate investor relations disclosures.',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'news-4',
      title: 'Controversial Video Clip from Recent Rally Shared Out of Context',
      source: 'Republic World',
      type: 'News Channels',
      category: 'Politics',
      timestamp: '1 hour ago',
      content: 'A video clip circulating widely shows a leader making a statement; however, the full video reveals a different context.',
      factChecked: true,
      verdict: 'Misleading',
      confidence: 88,
      explanation: 'Video editing omitted the preceding 45 seconds of qualifying speech, altering the contextual meaning.',
      image: 'https://images.unsplash.com/photo-1540910419892-f7ef71693045?auto=format&fit=crop&w=800&q=80'
    }
  ],
  tickets: [
    {
      id: 'tkt-101',
      claimText: 'Viral video claiming government announces free laptops for all university students.',
      method: 'video',
      submittedBy: 'student_99',
      status: 'Resolved',
      verdict: 'False',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  verifications: [],
  users: [
    {
      id: 'usr-admin',
      username: 'admin',
      email: 'admin@sra-factcheck.org',
      role: 'admin',
      password: 'Admin@SecurePass2026'
    }
  ],
  analytics: {
    totalClaimsVerified: 1420,
    trueClaims: 852,
    falseClaims: 418,
    misleadingClaims: 150,
    accuracyRate: 98.4
  }
};

class Database {
  constructor() {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
    }
  }

  read() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_DATA;
    }
  }

  write(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  getNews(category = 'All', search = '') {
    const data = this.read();
    let news = data.news || [];
    if (category && category !== 'All') {
      news = news.filter(item => item.type === category || item.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      news = news.filter(item => 
        item.title.toLowerCase().includes(s) || 
        item.content.toLowerCase().includes(s) || 
        item.source.toLowerCase().includes(s)
      );
    }
    return news;
  }

  addNews(newsItem) {
    const data = this.read();
    const item = {
      id: `news-${Date.now()}`,
      timestamp: 'Just now',
      factChecked: true,
      ...newsItem
    };
    data.news.unshift(item);
    this.write(data);
    return item;
  }

  addVerification(claim) {
    const data = this.read();
    data.verifications.unshift(claim);
    data.analytics.totalClaimsVerified += 1;
    if (claim.verdict === 'True') data.analytics.trueClaims += 1;
    else if (claim.verdict === 'False') data.analytics.falseClaims += 1;
    else data.analytics.misleadingClaims += 1;
    this.write(data);
    return claim;
  }

  addTicket(ticket) {
    const data = this.read();
    const newTicket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...ticket
    };
    data.tickets.unshift(newTicket);
    this.write(data);
    return newTicket;
  }

  getTickets() {
    return this.read().tickets || [];
  }

  getAnalytics() {
    return this.read().analytics || INITIAL_DATA.analytics;
  }

  // Student Fact-Checkers Data Store
  getStudents() {
    const data = this.read();
    if (!data.students) {
      data.students = [
        {
          id: 'stu-fact-001',
          student_id: 'STU-JOURN-2026-01',
          fullName: 'Tanvi Agarwal',
          email: 'tanvi.agarwal@journalism-inst.edu.in',
          university: 'Indian Institute of Mass Communication (IIMC)',
          course: 'Digital Media & Investigative Journalism',
          semester: 4,
          verifiedClaimsCount: 32,
          flaggedMisinfoCount: 19,
          accuracyRating: 98.2,
          badgeLevel: 'Senior Fact-Checker',
          createdAt: '2026-01-12T10:00:00.000Z'
        },
        {
          id: 'stu-fact-002',
          student_id: 'STU-JOURN-2026-02',
          fullName: 'Kabir Singhal',
          email: 'kabir.singhal@journalism-inst.edu.in',
          university: 'Asian College of Journalism (ACJ)',
          course: 'Data Journalism & AI Media Auditing',
          semester: 4,
          verifiedClaimsCount: 24,
          flaggedMisinfoCount: 15,
          accuracyRating: 96.5,
          badgeLevel: 'Certified Analyst',
          createdAt: '2026-01-15T14:30:00.000Z'
        }
      ];
      this.write(data);
    }
    return data.students;
  }

  getStudentById(id) {
    const students = this.getStudents();
    return students.find(s => s.id === id || s.student_id === id) || null;
  }

  addStudent(studentData) {
    const data = this.read();
    if (!data.students) data.students = [];
    const item = {
      id: `stu-fact-${Date.now()}`,
      student_id: studentData.student_id || `STU-JOURN-2026-${Math.floor(100 + Math.random() * 900)}`,
      verifiedClaimsCount: 0,
      flaggedMisinfoCount: 0,
      accuracyRating: 100.0,
      badgeLevel: 'Junior Fact-Checker',
      createdAt: new Date().toISOString(),
      ...studentData
    };
    data.students.unshift(item);
    this.write(data);
    return item;
  }
}

module.exports = new Database();

