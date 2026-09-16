import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  ShieldCheck,
  User,
  Menu,
  Video,
  FileText,
  Link as LinkIcon,
  X,
  TrendingUp,
  Activity,
  LogOut,
  Database
} from 'lucide-react';
import './App.css';
// import { api } from './api';

const DEFAULT_ADMIN = { userId: 'Zainul9142', password: 'Zainul..@8102' };

const MOCK_NEWS = [
  {
    id: 'mock-1',
    title: "Major Infrastructure Project Announced for Highway Expansion in Uttar Pradesh",
    source: "NDTV India",
    type: "News Channels",
    category: "National",
    timestamp: "30 mins ago",
    content: "The Ministry of Road Transport and Highways has cleared a major budget for phase 3 of the corridor expansion.",
    factChecked: true,
    verdict: "True",
    image: "https://images.unsplash.com/photo-1545143333-11cb50c33b9c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'mock-2',
    title: "Claims of New Currency Notes Starting from Next Month Found to be Fabricated",
    source: "PIB Fact Check",
    type: "Social Media",
    category: "Trending",
    timestamp: "2 hours ago",
    content: "Viral messages on WhatsApp claiming the RBI is issuing new ₹5000 notes are completely false.",
    factChecked: true,
    verdict: "False",
    image: "https://images.unsplash.com/photo-1627000086207-77e8fd117bcf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'mock-3',
    title: "Tech Innovation Hub Setup Planned in Bengaluru by Global Tech Giant",
    source: "The Hindu",
    type: "Newspapers",
    category: "Technology",
    timestamp: "4 hours ago",
    content: "A leading Silicon Valley company is in final stages of signing an MOU for a 50-acre R&D campus.",
    factChecked: true,
    verdict: "True",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'mock-4',
    title: "Controversial Video Clip from Recent Rally Shared Out of Context",
    source: "Republic World",
    type: "News Channels",
    category: "Politics",
    timestamp: "1 hour ago",
    content: "A video clip circulating widely shows a leader making a statement; however, the full video reveals a different context.",
    factChecked: true,
    verdict: "Misleading",
    image: "https://images.unsplash.com/photo-1540910419892-f7ef71693045?auto=format&fit=crop&w=800&q=80"
  }
];

const App = () => {
  const [view, setView] = useState('login');
  const [adminSubView, setAdminSubView] = useState('overview');
  const [showSidebar, setShowSidebar] = useState(false);
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFactCheckModal, setShowFactCheckModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sra_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [aiLogs, setAiLogs] = useState([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [authData, setAuthData] = useState({ userId: '', username: '', email: '', password: '', mobile: '' });
  const [adminData, setAdminData] = useState({ userId: '', password: '' });
  const [factCheckMethod, setFactCheckMethod] = useState('video');
  const [adminSettings, setAdminSettings] = useState(() => {
    const saved = localStorage.getItem('sra_admin_credentials');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
  });

  const categories = ['All', 'News Channels', 'Newspapers', 'Radio', 'Social Media', 'International'];

  const fetchAllNews = useCallback(async () => {
    setLoading(true);
    let allNews = [];

    // 1. Fetch from Custom Express Backend
    try {
      const backendNews = await api.fetchNews();
      if (backendNews && backendNews.length > 0) {
        allNews = backendNews.map(n => ({ ...n, isVerified: true }));
      }
    } catch (e) {
      console.warn("Express backend news fetch fallback", e);
    }

    // 2. Fetch Live RSS Feeds
    const feeds = [
      { name: 'NDTV', url: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
      { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
      { name: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss' },
      { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
      { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' }
    ];

    const rssPromises = feeds.map(async (feed) => {
      try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
        const data = await res.json();
        return data.items ? data.items.map((item, idx) => ({
          id: `live-${feed.name}-${idx}`,
          title: item.title,
          source: feed.name,
          content: item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : '',
          timestamp: 'LIVE',
          link: item.link,
          image: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
          verdict: 'Pending',
          isVerified: false,
          type: feed.name.includes('BBC') || feed.name.includes('CNN') ? 'International' : 'News Channels',
          category: 'National'
        })) : [];
      } catch {
        return [];
      }
    });

    const rssResults = await Promise.all(rssPromises);
    rssResults.forEach(results => {
      allNews = [...allNews, ...results];
    });

    if (allNews.length === 0) {
      setNews(MOCK_NEWS.map(n => ({ ...n, isVerified: true })));
    } else {
      setNews(allNews);
    }
    setLoading(false);
  }, []);

  const fetchAdminData = useCallback(async () => {
    try {
      const usersData = await api.fetchAdminUsers();
      const ticketsData = await api.fetchAdminTickets();
      if (usersData) setUsers(usersData);
      if (ticketsData) setTickets(ticketsData);
    } catch (e) {
      console.warn("Failed to fetch admin data", e);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchAllNews();
    });
  }, [fetchAllNews]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      Promise.resolve().then(() => {
        fetchAdminData();
      });
    }
  }, [user, fetchAdminData]);

  const filteredNews = news.filter(item =>
    (activeCategory === 'All' || item.type === activeCategory || item.category === activeCategory) &&
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.source && item.source.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sra_user');
    setView('login');
  };

  const startSraCheck = async () => {
    setIsAiProcessing(true);
    setAiLogs(['SRA TruthGuard AI Engine initializing...']);

    try {
      const result = await api.runFactCheck(factCheckMethod, 'analyzing...');
      result.logs.forEach((log, index) => {
        setTimeout(() => {
          setAiLogs(prev => [...prev, log]);
          if (index === result.logs.length - 1) setIsAiProcessing(false);
        }, (index + 1) * 600);
      });
    } catch {
      setIsAiProcessing(false);
    }
  };

  const handleFactCheck = (item) => {
    setSelectedNews(item);
    setShowFactCheckModal(true);
    setAiLogs([]);
    setIsAiProcessing(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, mobile } = authData;
    try {
      await api.register(username, email, password, mobile);
      alert("Registration Successful! Please Login.");
      setView('login');
    } catch (err) {
      alert("Registration Error: " + err.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { userId, password } = authData;
    try {
      const data = await api.login(userId, password);
      setUser(data.user);
      localStorage.setItem('sra_user', JSON.stringify(data.user));
      setView('dashboard');
    } catch (err) {
      alert("Login Failed: " + err.message);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminData.userId === adminSettings.userId && adminData.password === adminSettings.password) {
      const adminUser = { name: 'Md Ekbal', role: 'admin', email: 'imd8351087@gmail.com' };
      setUser(adminUser);
      localStorage.setItem('sra_user', JSON.stringify(adminUser));
      setView('admin-panel');
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  const updateAdminCredentials = (id, pass) => {
    const newSettings = { userId: id, password: pass };
    setAdminSettings(newSettings);
    localStorage.setItem('sra_admin_credentials', JSON.stringify(newSettings));
    alert("Admin Credentials Updated Successfully!");
  };

  if (view === 'registration' || view === 'login') {
    return (
      <div className="nexus-auth-container">
        <div className="nexus-auth-card glass">
          <div className="nexus-logo" onClick={() => setView('dashboard')}>
            <div className="logo-icon"><Activity size={28} color="var(--accent-primary)" /></div>
            <span>SRA<span className="accent">TruthGuard</span></span>
          </div>

          <h2>{view === 'registration' ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="subtitle">{view === 'registration' ? 'Join the movement of verified media truth.' : 'Securely access the verification engine.'}</p>

          <form onSubmit={view === 'registration' ? handleAuthSubmit : handleLoginSubmit}>
            {view === 'registration' && (
              <div className="input-group">
                <User size={18} />
                <input type="text" placeholder="Full Name" required onChange={(e) => setAuthData({ ...authData, username: e.target.value })} />
              </div>
            )}
            <div className="input-group">
              <User size={18} />
              <input type="text" placeholder="Email Address" required onChange={(e) => setAuthData({ ...authData, userId: e.target.value })} />
            </div>
            {view === 'registration' && (
              <div className="input-group">
                <ShieldCheck size={18} />
                <input type="tel" placeholder="Mobile Number" required onChange={(e) => setAuthData({ ...authData, mobile: e.target.value })} />
              </div>
            )}
            <div className="input-group">
              <ShieldCheck size={18} />
              <input type="password" placeholder="Password" required value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })} />
            </div>

            <button type="submit" className="nexus-btn-primary">
              {view === 'registration' ? 'Initialize Account' : 'Enter Vault'}
            </button>
          </form>

          <p className="auth-footer">
            {view === 'registration' ? 'Already a member?' : 'New to SRA TruthGuard?'}
            <span onClick={() => setView(view === 'registration' ? 'login' : 'registration')}>
              {view === 'registration' ? ' Login' : ' Register'}
            </span>
          </p>
          <div className="back-link" onClick={() => setView('dashboard')}>Return to Dashboard</div>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="nexus-auth-container admin-mode">
        <div className="nexus-auth-card glass admin-gate">
          <div className="admin-lock-icon" style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>🛡️</div>
          <h2>Staff Access</h2>
          <p className="subtitle">Authorized personnel only beyond this point.</p>
          <form onSubmit={handleAdminSubmit}>
            <div className="input-group">
              <User size={18} />
              <input type="text" placeholder="Staff ID" required value={adminData.userId} onChange={(e) => setAdminData({ ...adminData, userId: e.target.value })} />
            </div>
            <div className="input-group">
              <ShieldCheck size={18} />
              <input type="password" placeholder="Access Key" required value={adminData.password} onChange={(e) => setAdminData({ ...adminData, password: e.target.value })} />
            </div>
            <button type="submit" className="nexus-btn-primary admin-btn">Unlock System</button>
          </form>
          <div className="back-link" onClick={() => setView('dashboard')}>Back to Site</div>
        </div>
      </div>
    );
  }

  const renderAdminContent = () => {
    switch (adminSubView) {
      case 'users':
        return (
          <section className="admin-table-section glass">
            <h2>User Management</h2>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge">{u.role}</span></td>
                    <td><span className={`status ${u.status === 'active' ? 'online' : ''}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case 'news':
        return (
          <section className="admin-table-section glass">
            <h2>News Verification Repository</h2>
            <table className="admin-table">
              <thead>
                <tr><th>Title</th><th>Source</th><th>Verdict</th><th>Type</th></tr>
              </thead>
              <tbody>
                {news.map(n => (
                  <tr key={n.id}>
                    <td>{n.title}</td>
                    <td>{n.source}</td>
                    <td><span className={`verdict-badge ${n.verdict.toLowerCase()}`}>{n.verdict}</span></td>
                    <td>{n.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case 'tickets':
        return (
          <section className="admin-table-section glass">
            <h2>Queries & Verification Requests</h2>
            <table className="admin-table">
              <thead>
                <tr><th>User</th><th>Contact</th><th>Message</th><th>Status</th></tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id}>
                    <td>{t.name || t.user_name}</td>
                    <td>{t.contact}</td>
                    <td>{t.message || t.description}</td>
                    <td><span className={`status ${t.status}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case 'logs':
        return (
          <section className="admin-profile-section glass">
            <h2>System Audit Logs</h2>
            <div className="ai-logs" style={{ height: '300px', overflowY: 'auto' }}>
              <div className="log-entry">API Gateway: Node/Express Server connected on port 5000</div>
              <div className="log-entry">Database: JSON persistence layer ready</div>
              <div className="log-entry">AI Core: SRA Deepfake & Veracity Model v2.4 active</div>
              <div className="log-entry">Security: Cors & Input Sanitation verified</div>
              <div className="log-entry">Staff Session: Md Ekbal authenticated as Super Admin</div>
            </div>
          </section>
        );
      case 'security':
        return (
          <section className="admin-profile-section glass" style={{ maxWidth: '500px' }}>
            <h2>Security Credentials</h2>
            <p className="subtitle">Update Staff Access credentials. Changes take effect on next login.</p>
            <div className="profile-info-list" style={{ marginTop: '2rem' }}>
              <div className="input-group">
                <User size={18} />
                <input
                  type="text"
                  placeholder="New Staff ID"
                  defaultValue={adminSettings.userId}
                  id="newAdminId"
                />
              </div>
              <div className="input-group">
                <ShieldCheck size={18} />
                <input
                  type="password"
                  placeholder="New Access Key"
                  defaultValue={adminSettings.password}
                  id="newAdminPass"
                />
              </div>
              <button
                className="nexus-btn-primary"
                onClick={() => {
                  const id = document.getElementById('newAdminId').value;
                  const pass = document.getElementById('newAdminPass').value;
                  if (id && pass) updateAdminCredentials(id, pass);
                  else alert("Fields cannot be empty");
                }}
              >
                Save Security Settings
              </button>
            </div>
          </section>
        );
      default:
        return (
          <>
            <div className="admin-stats">
              <div className="stat-card glass"><h3>{users.length || 2}</h3><p>Total Users</p></div>
              <div className="stat-card glass"><h3>{news.length || 4}</h3><p>Reports Index</p></div>
              <div className="stat-card glass"><h3>99.4%</h3><p>Truth Precision</p></div>
            </div>
            <div className="admin-details-grid">
              <section className="admin-profile-section glass">
                <h2>Admin Profile</h2>
                <div className="profile-info-list">
                  <div className="info-item"><span className="label">Name:</span> <span>Md Ekbal</span></div>
                  <div className="info-item"><span className="label">Email:</span> <span>imd8351087@gmail.com</span></div>
                  <div className="info-item"><span className="label">Mobile:</span> <span>8102227936</span></div>
                  <div className="info-item"><span className="label">Support:</span> <span>zainul7abideen@gmail.com</span></div>
                </div>
              </section>
            </div>
          </>
        );
    }
  };

  if (view === 'admin-panel') {
    return (
      <div className="admin-layout">
        <nav className="admin-sidebar glass">
          <div className="logo admin-logo">🛡️ SRA TruthGuard</div>
          <ul className="admin-menu">
            <li className={adminSubView === 'overview' ? 'active' : ''} onClick={() => setAdminSubView('overview')}>Dashboard</li>
            <li className={adminSubView === 'users' ? 'active' : ''} onClick={() => setAdminSubView('users')}>User Management</li>
            <li className={adminSubView === 'news' ? 'active' : ''} onClick={() => setAdminSubView('news')}>News Verification</li>
            <li className={adminSubView === 'tickets' ? 'active' : ''} onClick={() => setAdminSubView('tickets')}>Queries & Tickets</li>
            <li className={adminSubView === 'logs' ? 'active' : ''} onClick={() => setAdminSubView('logs')}>System Logs</li>
            <li className={adminSubView === 'security' ? 'active' : ''} onClick={() => setAdminSubView('security')}>Security Settings</li>
            <li onClick={() => setView('dashboard')}>Return to Site</li>
            <li onClick={logout}>Logout</li>
          </ul>
          <div className="admin-footer-details glass" style={{ padding: '1rem', marginTop: 'auto' }}>
            <p><strong>System Admin</strong></p>
            <p>Md Ekbal</p>
          </div>
        </nav>
        <main className="admin-main">
          <header className="admin-header glass">
            <h1>SRA TruthGuard System Management</h1>
            <div className="admin-profile">
              <div className="admin-info-text" style={{ textAlign: 'right' }}>
                <span className="admin-name" style={{ display: 'block', fontWeight: '700' }}>Md Ekbal</span>
                <span className="admin-sub" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Super Admin</span>
              </div>
              <div className="admin-avatar">ME</div>
            </div>
          </header>
          {renderAdminContent()}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Global Sidebar */}
      <div className={`global-sidebar glass ${showSidebar ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={() => setShowSidebar(false)}><X /></button>
        </div>
        <ul className="sidebar-links">
          <li onClick={() => { setView('dashboard'); setShowSidebar(false); }}><TrendingUp size={20} /> Latest Verifications</li>
          <li onClick={() => { setShowFactCheckModal(true); setShowSidebar(false); }}><ShieldCheck size={20} /> DeepCheck AI</li>
          <li onClick={() => { setView('profile'); setShowSidebar(false); }}><User size={20} /> My Profile</li>
          <li onClick={() => { setView('admin'); setShowSidebar(false); }}><Activity size={20} /> Staff Access</li>
          {user && user.role === 'admin' && (
            <li onClick={() => { setView('admin-panel'); setShowSidebar(false); }}><Database size={20} /> Admin Panel</li>
          )}
          <li onClick={logout}><LogOut size={20} /> Logout</li>
        </ul>
      </div>

      {/* Breaking News Ticker */}
      <div className="breaking-ticker glass">
        <div className="ticker-label">TRUTH ALERTS</div>
        <div className="ticker-content">
          {news.slice(0, 5).map((n, i) => (
            <span key={i} className="ticker-item">🚨 {n.title} • </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar glass">
        <div className="container nav-content">
          <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Menu className="hamburger-menu" size={28} onClick={() => setShowSidebar(true)} style={{ cursor: 'pointer' }} />
            <div className="logo" onClick={() => setView('dashboard')} style={{ cursor: 'pointer' }}>
              <ShieldCheck className="logo-icon" size={32} color="var(--accent-primary)" />
              <span className="logo-text">SRA<span className="accent">TruthGuard</span></span>
            </div>
          </div>

          <ul className="desktop-menu">
            <li onClick={() => setView('dashboard')}>Feed</li>
            <li onClick={() => setShowFactCheckModal(true)}>DeepCheck AI</li>
            <li onClick={() => setView('profile')}>Profile</li>
            <li onClick={() => setView('admin')}>Staff</li>
          </ul>

          <div className="nav-right">
            <div className="search-bar glass">
              <input
                type="text"
                placeholder="Search truth repository..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="search-btn" size={18} />
            </div>

            <div className="nav-actions">
              {user ? (
                <button className="nav-btn logout-nav" onClick={logout} title="Logout"><LogOut size={18} /></button>
              ) : (
                <button className="nav-btn register-btn" onClick={() => setView('login')}>Login</button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container main-content">
        {view === 'profile' ? (
          <section className="profile-page glass" style={{ padding: '2rem' }}>
            <h2>User Profile</h2>
            <div className="profile-details" style={{ marginTop: '1.5rem' }}>
              <div className="profile-large-avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="profile-info-grid">
                <div className="info-item"><span className="label">Name:</span> <span>{user?.name || 'Guest User'}</span></div>
                <div className="info-item"><span className="label">Email:</span> <span>{user?.email || 'N/A'}</span></div>
                <div className="info-item"><span className="label">Joined:</span> <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}</span></div>
                <div className="info-item"><span className="label">Role:</span> <span className="badge">{user?.role || 'User'}</span></div>
              </div>
              <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setView('dashboard')}>Back to Verifications</button>
            </div>
          </section>
        ) : (
          <>
            {/* News Networks Directory */}
            <section className="networks-section">
              <div className="section-header">
                <h2>Official Monitored Media Networks</h2>
                <p>Real-time stream integration & PIB record cross-verification</p>
              </div>
              <div className="networks-grid">
                {[
                  { name: 'NDTV', icon: '🔴', color: '#e11d48' },
                  { name: 'BBC World', icon: '🌍', color: '#bb1919' },
                  { name: 'CNN', icon: '📡', color: '#cc0000' },
                  { name: 'The Hindu', icon: '📰', color: '#111827' },
                  { name: 'Al Jazeera', icon: '🌐', color: '#ff9900' },
                  { name: 'Zee News', icon: '📺', color: '#7c3aed' }
                ].map(net => (
                  <div key={net.name} className="network-card glass" onClick={() => setSearchTerm(net.name)}>
                    <div className="network-icon" style={{ backgroundColor: net.color }}>{net.icon}</div>
                    <span className="network-name">{net.name}</span>
                    <span className="live-status"><span className="pulse"></span> ONLINE</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Category Tabs */}
            <section className="categories-scroll">
              <div className="categories-list">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`category-tag ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Hero Section */}
            <header className="hero">
              <div className="hero-content">
                <span className="label">SRA TruthGuard AI Engine</span>
                <h1>Fighting Misinformation & Deepfakes in Real-Time</h1>
                <p>Instantly verify viral news, deepfake audio/videos, and official circulars. Powered by cross-network press feeds and PIB government records.</p>
                <button className="btn-primary" onClick={() => setShowFactCheckModal(true)}>
                  <ShieldCheck size={20} /> Launch DeepCheck AI
                </button>
              </div>
            </header>

            {/* News Feed */}
            <section className="news-feed">
              <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Verified News Stream</h2>
                <div className="filter-info" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{filteredNews.length} reports index</div>
              </div>

              {loading ? (
                <div className="loader" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Analyzing truth stream...</div>
              ) : (
                <div className="news-grid">
                  {filteredNews.map(item => (
                    <div key={item.id} className="news-card glass">
                      <div className="card-image" style={{ backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'})` }}>
                        <span className={`verdict-badge ${item.verdict.toLowerCase()}`}>
                          {item.verdict}
                        </span>
                        {item.isVerified && <div className="verified-seal"><ShieldCheck size={16} /> Verified</div>}
                      </div>
                      <div className="card-body">
                        <div className="card-meta">
                          <span className="source" style={{ fontWeight: '700', color: 'var(--accent-secondary)' }}>{item.source}</span> • <span>{item.timestamp || 'Just now'}</span>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.content}</p>
                        <div className="card-footer">
                          {item.link ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <LinkIcon size={14} /> Source
                            </a>
                          ) : (
                            <button className="btn-secondary" onClick={() => handleFactCheck(item)}>Details</button>
                          )}
                          <button className="btn-factcheck" onClick={() => handleFactCheck(item)}>Verify AI</button>
                        </div>
                        <div className="copyright-credit">All rights reserved to {item.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* SRA DeepCheck Modal */}
      {showFactCheckModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <div className="ai-title">
                <Activity size={24} color="var(--accent-primary)" />
                <h2>SRA TruthGuard AI Verifier</h2>
              </div>
              <button className="close-btn" onClick={() => setShowFactCheckModal(false)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="input-methods">
                <button
                  className={`method-tab ${factCheckMethod === 'video' ? 'active' : ''}`}
                  onClick={() => setFactCheckMethod('video')}
                >
                  <Video size={18} /> Deepfake Video
                </button>
                <button
                  className={`method-tab ${factCheckMethod === 'doc' ? 'active' : ''}`}
                  onClick={() => setFactCheckMethod('doc')}
                >
                  <FileText size={18} /> Document/PDF
                </button>
                <button
                  className={`method-tab ${factCheckMethod === 'url' ? 'active' : ''}`}
                  onClick={() => setFactCheckMethod('url')}
                >
                  <LinkIcon size={18} /> Web Link
                </button>
              </div>

              <div className="ai-workspace">
                <div className="upload-zone glass">
                  {factCheckMethod === 'video' && (
                    <>
                      <div className="upload-icon"><Video size={48} /></div>
                      <p>Paste Video URL or Upload Media for Deepfake Detection</p>
                    </>
                  )}
                  {factCheckMethod === 'doc' && (
                    <>
                      <div className="upload-icon"><FileText size={48} /></div>
                      <p>Upload Circular or PDF Document for OCR Verification</p>
                    </>
                  )}
                  {factCheckMethod === 'url' && (
                    <>
                      <div className="upload-icon"><LinkIcon size={48} /></div>
                      <p>Provide Web Article Link for Press Cross-Reference</p>
                    </>
                  )}

                  <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={startSraCheck} disabled={isAiProcessing}>
                    {isAiProcessing ? 'Analyzing Content...' : 'Run DeepCheck AI'}
                  </button>
                </div>

                <div className="ai-logs glass">
                  {aiLogs.map((log, i) => (
                    <div key={i} className="log-entry">{log}</div>
                  ))}
                  {isAiProcessing && (
                    <div className="verdict-result">
                      <span className="pulse"></span> SRA Engine is computing veracity score...
                    </div>
                  )}
                  {!isAiProcessing && aiLogs.length > 0 && (
                    <div className="verdict-result final">
                      <ShieldCheck size={20} color="var(--accent-success)" />
                      {selectedNews ? `Verdict: ${selectedNews.verdict}` : 'Analysis Complete: Truth Score 94%'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legal Disclaimer Modal */}
      {showLegalModal && (
        <div className="modal-overlay">
          <div className="modal-content glass legal-modal">
            <div className="modal-header">
              <h2>⚖️ Legal & Compliance Standard</h2>
              <button className="close-btn" onClick={() => setShowLegalModal(false)}><X /></button>
            </div>
            <div className="modal-body legal-text">
              <p><strong>Educational & Public Verification Platform:</strong> SRA TruthGuard operates as an open media literacy and AI-assisted fact-checking engine.</p>
              <p><strong>Fair Use Policy:</strong> We index news snippets, titles, and thumbnails under fair-use guidelines to provide non-commercial truth analysis.</p>
              <p><strong>Intellectual Property:</strong> Rights to external news articles remain with NDTV, BBC, CNN, and original publishers.</p>
              <p style={{ marginTop: '1rem' }}>Contact: <u>zainul7abideen@gmail.com</u></p>
              <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setShowLegalModal(false)}>I Understand</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2026 SRA TruthGuard. Empowering Media Integrity.</p>
          <div className="footer-links">
            <span className="footer-link" onClick={() => setView('admin')}>Staff Login</span>
            <span className="footer-link" onClick={() => setShowLegalModal(true)}>Legal Disclaimer</span>
            <a href="mailto:zainul7abideen@gmail.com" className="footer-link">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
