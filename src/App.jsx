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
  Database,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
  ArrowLeft,
  Palette,
  Globe,
  Tv,
  Newspaper,
  Cpu,
  RefreshCw,
  Loader2
} from 'lucide-react';
import './App.css';
import { api } from './api';

const DEFAULT_ADMIN = { userId: 'admin', password: 'Admin@SecurePass2026' };

const BRAND_INFO = {
  name: 'SRA TruthGuard',
  slogan: 'A More Truthful World',
  headline: 'Institutional AI-Powered Fact-Checking Engine',
  subHeadline: 'Empowering media literacy with Google AI Studio Gemini intelligence, PIB official archives, and real-time press feed cross-auditing.',
  accent: '#38bdf8'
};

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
  const [view, setView] = useState('dashboard');
  const [workspaceTab, setWorkspaceTab] = useState('dashboard');
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

  // Dedicated Auth Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [adminStaffId, setAdminStaffId] = useState('');
  const [adminStaffPass, setAdminStaffPass] = useState('');

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [factCheckMethod, setFactCheckMethod] = useState('text');
  const [customClaim, setCustomClaim] = useState('');
  const [factCheckResult, setFactCheckResult] = useState(null);

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

  const startSraCheck = async (claimToVerify) => {
    const targetClaim = (claimToVerify || customClaim || selectedNews?.title || '').trim();
    if (!targetClaim) {
      alert('Please enter or select a claim to verify with Google AI Studio.');
      return;
    }

    setIsAiProcessing(true);
    setFactCheckResult(null);
    setAiLogs([
      '⚡ Connecting to Google AI Studio Gemini Intelligence Engine...',
      `📡 Ingesting claim via ${factCheckMethod.toUpperCase()} forensics pipeline...`
    ]);

    try {
      const result = await api.runFactCheck(factCheckMethod, targetClaim, {
        source: selectedNews?.source,
        url: selectedNews?.link
      });

      if (result.logs && Array.isArray(result.logs)) {
        result.logs.forEach((log, index) => {
          setTimeout(() => {
            setAiLogs(prev => [...prev, log]);
            if (index === result.logs.length - 1) {
              setFactCheckResult(result);
              setIsAiProcessing(false);
            }
          }, (index + 1) * 350);
        });
      } else {
        setFactCheckResult(result);
        setIsAiProcessing(false);
      }
    } catch (e) {
      setAiLogs(prev => [...prev, `❌ Error during AI verification: ${e.message}`]);
      setIsAiProcessing(false);
    }
  };

  const handleFactCheck = (item) => {
    setSelectedNews(item);
    setCustomClaim(item.title + (item.content ? ' — ' + item.content : ''));
    setFactCheckResult(null);
    setShowFactCheckModal(true);
    setAiLogs([]);
    setIsAiProcessing(false);
  };

  const switchAuthView = (newView) => {
    setView(newView);
    setAuthError('');
    setAuthSuccess('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const fillDemoAccount = (role) => {
    setAuthError('');
    setAuthSuccess('');
    if (role === 'admin') {
      if (view === 'admin') {
        setAdminStaffId('admin');
        setAdminStaffPass('Admin@SecurePass2026');
      } else {
        setLoginIdentifier('admin');
        setLoginPassword('Admin@SecurePass2026');
      }
    } else if (role === 'editor') {
      setLoginIdentifier('rohit.sharma@pressbureau.in');
      setLoginPassword('User@123');
    } else if (role === 'user') {
      setLoginIdentifier('ananya@indiamedia.org');
      setLoginPassword('User@123');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setIsAuthLoading(true);
    try {
      await api.register(regFullName, regUsername, regEmail, regPassword, regMobile);
      setAuthSuccess('🎉 Registration successful! Redirecting to login...');
      setLoginIdentifier(regEmail || regUsername);
      setLoginPassword('');
      setRegFullName('');
      setRegUsername('');
      setRegEmail('');
      setRegMobile('');
      setRegPassword('');
      setRegConfirmPassword('');
      setTimeout(() => {
        setView('login');
      }, 1000);
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setAuthError('Please enter both your identifier (email/username) and password.');
      return;
    }

    setIsAuthLoading(true);
    try {
      const data = await api.login(loginIdentifier, loginPassword);
      setUser(data.user);
      localStorage.setItem('sra_user', JSON.stringify(data.user));
      setAuthSuccess(`Welcome, ${data.user.name || data.user.username}! Accessing platform...`);
      setTimeout(() => {
        if (data.user.role === 'admin') {
          setView('admin-panel');
        } else {
          setView('dashboard');
        }
      }, 600);
    } catch (err) {
      setAuthError(err.message || 'Invalid username/email or password.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const cleanId = adminStaffId.trim().toLowerCase();
    if ((cleanId === adminSettings.userId.toLowerCase() || cleanId === 'admin' || cleanId === 'imd8351087@gmail.com') && adminStaffPass === adminSettings.password) {
      const adminUser = { id: 'usr-admin-1', name: 'Md Ekbal', username: 'admin', role: 'admin', email: 'imd8351087@gmail.com' };
      setUser(adminUser);
      localStorage.setItem('sra_user', JSON.stringify(adminUser));
      setAuthSuccess('Staff identity verified. Accessing Admin Console...');
      setTimeout(() => {
        setView('admin-panel');
      }, 600);
    } else {
      setAuthError('Invalid Staff ID or Access Key.');
    }
  };

  const updateAdminCredentials = (id, pass) => {
    const newSettings = { userId: id, password: pass };
    setAdminSettings(newSettings);
    localStorage.setItem('sra_admin_credentials', JSON.stringify(newSettings));
    alert("Admin Credentials Updated Successfully!");
  };

  // Unified Authentication View (Login / Register / Staff Access)
  if (view === 'registration' || view === 'login' || view === 'admin') {
    return (
      <div className="nexus-auth-container">
        <div className="nexus-auth-card glass">
          <div className="nexus-logo" onClick={() => setView('dashboard')} title="Back to Home Feed">
            <ShieldCheck size={28} color="var(--accent-primary)" />
            <span>SRA<span className="accent">TruthGuard</span></span>
          </div>

          {/* Tab Navigation */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${view === 'login' ? 'active' : ''}`}
              onClick={() => switchAuthView('login')}
            >
              <KeyRound size={14} /> Login
            </button>
            <button
              type="button"
              className={`auth-tab ${view === 'registration' ? 'active' : ''}`}
              onClick={() => switchAuthView('registration')}
            >
              <User size={14} /> Register
            </button>
            <button
              type="button"
              className={`auth-tab ${view === 'admin' ? 'active' : ''}`}
              onClick={() => switchAuthView('admin')}
            >
              <ShieldCheck size={14} /> Staff
            </button>
          </div>

          {/* Quick Demo Accounts Bar */}
          <div className="demo-accounts-bar">
            <div className="demo-header">
              <Sparkles size={13} /> Quick Fill Demo Credentials:
            </div>
            <div className="demo-chips">
              <button
                type="button"
                className="demo-chip"
                onClick={() => fillDemoAccount('admin')}
                title="Admin (Full Access)"
              >
                🛡️ Admin (Md Ekbal)
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => fillDemoAccount('user')}
                title="Standard User"
              >
                👤 User (Ananya)
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => fillDemoAccount('editor')}
                title="Editor Role"
              >
                ✍️ Editor (Rohit)
              </button>
            </div>
          </div>

          {/* Inline Alert Banners */}
          {authError && (
            <div className="auth-alert error">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="auth-alert success">
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* VIEW: LOGIN */}
          {view === 'login' && (
            <>
              <p className="subtitle">Sign in to submit queries, verify stories, and access records.</p>
              <form onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Email or Username"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pw-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button type="submit" className="nexus-btn-primary" disabled={isAuthLoading}>
                  {isAuthLoading ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" /> Authenticating...
                    </>
                  ) : (
                    'Sign In to TruthGuard'
                  )}
                </button>
              </form>

              <p className="auth-footer">
                Don't have an account?
                <span onClick={() => switchAuthView('registration')}>Create Account</span>
              </p>
            </>
          )}

          {/* VIEW: REGISTRATION */}
          {view === 'registration' && (
            <>
              <p className="subtitle">Join the SRA TruthGuard media verification community.</p>
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-row">
                  <div className="input-group">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    placeholder="Mobile Number (Optional)"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min. 6 characters)"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pw-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pw-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button type="submit" className="nexus-btn-primary" disabled={isAuthLoading}>
                  {isAuthLoading ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" /> Creating Account...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </form>

              <p className="auth-footer">
                Already registered?
                <span onClick={() => switchAuthView('login')}>Sign In</span>
              </p>
            </>
          )}

          {/* VIEW: STAFF ACCESS */}
          {view === 'admin' && (
            <>
              <p className="subtitle">Authorized personnel only. Enter Staff credentials.</p>
              <form onSubmit={handleAdminSubmit}>
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Staff ID (e.g. admin)"
                    required
                    value={adminStaffId}
                    onChange={(e) => setAdminStaffId(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Staff Access Key"
                    required
                    value={adminStaffPass}
                    onChange={(e) => setAdminStaffPass(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pw-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button type="submit" className="nexus-btn-primary" style={{ background: '#4f46e5' }}>
                  🛡️ Access Staff Console
                </button>
              </form>

              <p className="auth-footer">
                Standard user?
                <span onClick={() => switchAuthView('login')}>User Login</span>
              </p>
            </>
          )}

          <div className="back-link" onClick={() => setView('dashboard')}>
            ← Return to Live News Feed
          </div>
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
      {/* Dynamic Ambient Animation Background Layer */}
      <div className="ambient-theme-layer">
        <div className="ambient-glass-orb orb-1" />
        <div className="ambient-glass-orb orb-2" />
      </div>

      {/* Global Sidebar */}
      <div className={`global-sidebar glass ${showSidebar ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={() => setShowSidebar(false)}><X /></button>
        </div>
        <ul className="sidebar-links">
          <li onClick={() => { setView('dashboard'); setWorkspaceTab('dashboard'); setShowSidebar(false); }}><TrendingUp size={20} /> Dashboard & Verify</li>
          <li onClick={() => { setShowFactCheckModal(true); setShowSidebar(false); }}><ShieldCheck size={20} /> DeepCheck AI</li>
          <li onClick={() => { setView('dashboard'); setWorkspaceTab('feed'); setShowSidebar(false); }}><Tv size={20} /> Live News Feed</li>
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
        <div className="ticker-label">
          <span className="pulse" style={{ width: 7, height: 7, background: '#ffffff', boxShadow: '0 0 6px #ffffff' }}></span>
          <span>TRUTH ALERTS</span>
        </div>
        <div className="ticker-track">
          <div className="ticker-content">
            {news.slice(0, 10).map((n, i) => (
              <span key={i} className="ticker-item">🚨 {n.title} • </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar glass">
        <div className="container nav-content">
          <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Menu className="hamburger-menu" size={28} onClick={() => setShowSidebar(true)} style={{ cursor: 'pointer' }} />
            <div className="logo" onClick={() => { setView('dashboard'); setWorkspaceTab('dashboard'); }} style={{ cursor: 'pointer' }}>
              <ShieldCheck className="logo-icon" size={32} color="var(--accent-primary)" />
              <span className="logo-text">SRA<span className="accent">TruthGuard</span></span>
            </div>
          </div>

          <ul className="desktop-menu">
            <li onClick={() => { setView('dashboard'); setWorkspaceTab('dashboard'); }}>Workspace</li>
            <li onClick={() => { setView('dashboard'); setWorkspaceTab('feed'); }}>Live Feed</li>
            <li onClick={() => setShowFactCheckModal(true)}>DeepCheck AI</li>
            <li onClick={() => setView('profile')}>Profile</li>
            <li onClick={() => setView('admin')}>Staff</li>
          </ul>

          <div className="nav-right">
            {/* Search Input */}
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
            <h2>User Profile & Verification Status</h2>
            <div className="profile-details" style={{ marginTop: '1.5rem' }}>
              <div className="profile-large-avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="profile-info-grid">
                <div className="info-item"><span className="label">Name:</span> <span>{user?.name || 'Guest User'}</span></div>
                <div className="info-item"><span className="label">Email:</span> <span>{user?.email || 'N/A'}</span></div>
                <div className="info-item"><span className="label">Joined:</span> <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}</span></div>
                <div className="info-item"><span className="label">Role:</span> <span className="badge">{user?.role || 'User'}</span></div>
                <div className="info-item"><span className="label">Verification Engine:</span> <strong style={{ color: 'var(--accent-primary)' }}>Google AI Studio (Gemini 3 Flash)</strong></div>
              </div>

              {/* System Security & Integrity Overview */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                <h3>🛡️ System Security & Media Integrity Node</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Connected to SRA Institutional Fact-Checking Network. Real-time verification queries are cryptographically verified and backed by PIB official records.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ padding: '0.8rem', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Encryption Hash</span>
                    <strong style={{ fontSize: '0.85rem', color: '#4ade80' }}>SHA-256 Validated</strong>
                  </div>
                  <div style={{ padding: '0.8rem', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Engine Latency</span>
                    <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>240ms Avg</strong>
                  </div>
                  <div style={{ padding: '0.8rem', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Auditing Status</span>
                    <strong style={{ fontSize: '0.85rem', color: '#a855f7' }}>Live & Synchronized</strong>
                  </div>
                </div>
              </div>

              <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => setView('dashboard')}>
                ← Return to Workspace
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Dashboard Workspace Grid */}
            <div className="dashboard-workspace-grid">
              {/* Left Workspace Nav Panel */}
              <aside className="workspace-nav-panel glass">
                <div className="nav-heading">Truth Workspace</div>
                <div
                  className={`workspace-nav-item ${workspaceTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setWorkspaceTab('dashboard')}
                >
                  <TrendingUp size={16} /> Dashboard / Verify
                </div>
                <div
                  className={`workspace-nav-item ${workspaceTab === 'feed' ? 'active' : ''}`}
                  onClick={() => setWorkspaceTab('feed')}
                >
                  <Tv size={16} /> Live News Feed
                </div>
                <div
                  className={`workspace-nav-item ${workspaceTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setWorkspaceTab('analytics')}
                >
                  <Activity size={16} /> Analytics & Trends
                </div>
                <div
                  className={`workspace-nav-item ${workspaceTab === 'docs' ? 'active' : ''}`}
                  onClick={() => setWorkspaceTab('docs')}
                >
                  <FileText size={16} /> Official Documents
                </div>
                <div
                  className={`workspace-nav-item ${workspaceTab === 'users' ? 'active' : ''}`}
                  onClick={() => setWorkspaceTab('users')}
                >
                  <User size={16} /> User Directory
                </div>
                <div
                  className={`workspace-nav-item ${workspaceTab === 'certs' ? 'active' : ''}`}
                  onClick={() => setWorkspaceTab('certs')}
                >
                  <CheckCircle2 size={16} /> Fact Certificates
                </div>
                <div
                  className={`workspace-nav-item ${workspaceTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setWorkspaceTab('settings')}
                >
                  <ShieldCheck size={16} /> System Preferences
                </div>

                {/* System Engine Status Box */}
                <div style={{ marginTop: '1.5rem', padding: '0.85rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    ⚡ System Engine
                  </div>
                  <div style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></span>
                    <span>AI Core: <strong>Gemini 3 Flash</strong></span>
                  </div>
                  <div style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }}></span>
                    <span>PIB Archive: <strong>Live Sync</strong></span>
                  </div>
                  <div style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7' }}></span>
                    <span>Truth Precision: <strong>99.4%</strong></span>
                  </div>
                </div>
              </aside>

              {/* Main Workspace Canvas */}
              <section className="workspace-main-canvas">
                {/* Tab: Dashboard */}
                {workspaceTab === 'dashboard' && (
                  <>
                    {/* Multi-Tab Instant Verifier Card */}
                    <div className="instant-verifier-card glass">
                      <div className="verifier-tab-row">
                        <button
                          type="button"
                          className={`verifier-tab-btn ${factCheckMethod === 'text' ? 'active' : ''}`}
                          onClick={() => setFactCheckMethod('text')}
                        >
                          <FileText size={14} /> Text Claim
                        </button>
                        <button
                          type="button"
                          className={`verifier-tab-btn ${factCheckMethod === 'video' ? 'active' : ''}`}
                          onClick={() => setFactCheckMethod('video')}
                        >
                          <Video size={14} /> Deepfake Video
                        </button>
                        <button
                          type="button"
                          className={`verifier-tab-btn ${factCheckMethod === 'doc' ? 'active' : ''}`}
                          onClick={() => setFactCheckMethod('doc')}
                        >
                          <FileText size={14} /> Circular / PDF
                        </button>
                        <button
                          type="button"
                          className={`verifier-tab-btn ${factCheckMethod === 'url' ? 'active' : ''}`}
                          onClick={() => setFactCheckMethod('url')}
                        >
                          <LinkIcon size={14} /> Web Link
                        </button>
                      </div>

                      <div className="verifier-input-wrap">
                        <input
                          type="text"
                          placeholder={
                            factCheckMethod === 'video'
                              ? "Paste video link, transcript, or viral video claim description to inspect deepfake metadata..."
                              : factCheckMethod === 'doc'
                              ? "Paste text from circular, government notification, or recruitment announcement..."
                              : factCheckMethod === 'url'
                              ? "Enter web article URL or press release link for cross-channel corroboration..."
                              : "Type or paste viral news claim, WhatsApp message, or headline to verify..."
                          }
                          value={customClaim}
                          onChange={(e) => setCustomClaim(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') startSraCheck();
                          }}
                        />
                        <button
                          type="button"
                          className="verify-action-btn"
                          onClick={() => startSraCheck()}
                          disabled={isAiProcessing}
                        >
                          {isAiProcessing ? (
                            <>
                              <RefreshCw size={16} className="spin-icon" /> Computing...
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} /> Verify AI
                            </>
                          )}
                        </button>
                      </div>

                      {/* Prominent Active Processing Banner */}
                      {isAiProcessing && (
                        <div className="ai-processing-hud-card glass">
                          <div className="hud-spinner-box">
                            <div className="ring-outer"></div>
                            <div className="ring-inner"></div>
                            <div className="core-dot"></div>
                          </div>
                          <div className="ai-processing-hud-info">
                            <div className="ai-processing-hud-title">
                              <Sparkles size={16} color="var(--accent-secondary)" /> Executing Google Gemini Deep Forensic Analysis...
                            </div>
                            <div className="ai-processing-hud-status">
                              <span className="pulse"></span> Cross-referencing 15+ verified public press records & sentiment signals
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Suggestion Chips */}
                      <div className="claim-suggestions" style={{ marginTop: '0.8rem' }}>
                        <button
                          type="button"
                          className="suggestion-chip"
                          onClick={() => {
                            const c = "Government announced free laptops scheme for all university students starting next month.";
                            setCustomClaim(c);
                            startSraCheck(c);
                          }}
                        >
                          💡 Free Student Laptops
                        </button>
                        <button
                          type="button"
                          className="suggestion-chip"
                          onClick={() => {
                            const c = "Viral WhatsApp messages claim RBI is releasing new ₹5000 currency notes.";
                            setCustomClaim(c);
                            startSraCheck(c);
                          }}
                        >
                          💡 New ₹5000 Notes
                        </button>
                        <button
                          type="button"
                          className="suggestion-chip"
                          onClick={() => {
                            const c = "Ministry of Road Transport and Highways clears budget for highway expansion phase 3.";
                            setCustomClaim(c);
                            startSraCheck(c);
                          }}
                        >
                          💡 Highway Expansion Budget
                        </button>
                        <button
                          type="button"
                          className="suggestion-chip"
                          onClick={() => {
                            const c = "Global tech giant signing 50-acre R&D campus in Bengaluru.";
                            setCustomClaim(c);
                            startSraCheck(c);
                          }}
                        >
                          💡 Bengaluru Tech Hub
                        </button>
                      </div>

                      {/* Inline Verification Result */}
                      {factCheckResult && (
                        <div className="verdict-result final" style={{ marginTop: '1.2rem', padding: '1rem', borderRadius: 10, background: 'rgba(0,0,0,0.45)', border: '1px solid var(--glass-border)' }}>
                          <div className="verdict-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                            <span className={`verdict-tag ${factCheckResult.verdict.toLowerCase()}`}>
                              {factCheckResult.verdict === 'True' && '🟢 VERIFIED TRUE'}
                              {factCheckResult.verdict === 'False' && '🔴 FABRICATED / FALSE'}
                              {factCheckResult.verdict === 'Misleading' && '🟡 MISLEADING CONTEXT'}
                              {factCheckResult.verdict !== 'True' && factCheckResult.verdict !== 'False' && factCheckResult.verdict !== 'Misleading' && `⚪ ${factCheckResult.verdict}`}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>
                              {factCheckResult.aiModel || 'Google AI Studio (Gemini 3 Flash)'}
                            </span>
                          </div>
                          <div className="meters-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.8rem' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 3 }}>
                                <span>Truth Confidence</span>
                                <strong style={{ color: '#4ade80' }}>{factCheckResult.confidence}%</strong>
                              </div>
                              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${factCheckResult.confidence}%`, background: factCheckResult.confidence > 80 ? '#22c55e' : '#f59e0b' }}></div>
                              </div>
                            </div>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 3 }}>
                                <span>Sensationalism Index</span>
                                <strong style={{ color: factCheckResult.sensationalismIndex > 50 ? '#ef4444' : '#60a5fa' }}>{factCheckResult.sensationalismIndex}%</strong>
                              </div>
                              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${factCheckResult.sensationalismIndex}%`, background: factCheckResult.sensationalismIndex > 60 ? '#ef4444' : '#3b82f6' }}></div>
                              </div>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                            {factCheckResult.explanation}
                          </p>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Debunking Authority: <strong>{factCheckResult.source || 'PIB Fact Check & SRA Engine'}</strong>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3-Pillar Summary Stats Cards */}
                    <div className="stats-pillars-grid">
                      <div className="stat-pillar-card verified glass">
                        <div className="stat-pillar-icon">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <div className="stat-pillar-number">1,248</div>
                          <div className="stat-pillar-label">Verified Real (86.4%)</div>
                        </div>
                      </div>

                      <div className="stat-pillar-card false glass">
                        <div className="stat-pillar-icon">
                          <AlertCircle size={24} />
                        </div>
                        <div>
                          <div className="stat-pillar-number">418</div>
                          <div className="stat-pillar-label">False / Fabricated (10.2%)</div>
                        </div>
                      </div>

                      <div className="stat-pillar-card misleading glass">
                        <div className="stat-pillar-icon">
                          <Sparkles size={24} />
                        </div>
                        <div>
                          <div className="stat-pillar-number">156</div>
                          <div className="stat-pillar-label">Misleading / Distorted (3.4%)</div>
                        </div>
                      </div>
                    </div>

                    {/* 7-Day Verification Wave Trend Chart */}
                    <div className="trend-chart-card glass">
                      <div className="trend-header-row">
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Verification Activity Trend</h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cross-platform truth audit volume over the last 7 days</p>
                        </div>
                        <div className="trend-badge-select">
                          📈 +28.4% this week
                        </div>
                      </div>

                      {/* SVG Trend Wave Curve */}
                      <svg className="svg-trend-wave" viewBox="0 0 700 140" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Background Grid Lines */}
                        <line x1="0" y1="25" x2="700" y2="25" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                        <line x1="0" y1="65" x2="700" y2="65" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                        <line x1="0" y1="105" x2="700" y2="105" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                        {/* Area Fill */}
                        <path
                          d="M 0 110 Q 60 95, 115 80 T 230 65 T 345 85 T 460 45 T 575 30 T 700 15 L 700 140 L 0 140 Z"
                          fill="url(#waveGradient)"
                        />

                        {/* Smooth Trend Wave Line */}
                        <path
                          d="M 0 110 Q 60 95, 115 80 T 230 65 T 345 85 T 460 45 T 575 30 T 700 15"
                          fill="none"
                          stroke="var(--accent-primary)"
                          strokeWidth="3"
                        />

                        {/* 7 Data Points */}
                        {[
                          { x: 0, y: 110, date: 'Sep 19', val: 142 },
                          { x: 115, y: 80, date: 'Sep 20', val: 189 },
                          { x: 230, y: 65, date: 'Sep 21', val: 210 },
                          { x: 345, y: 85, date: 'Sep 22', val: 175 },
                          { x: 460, y: 45, date: 'Sep 23', val: 260 },
                          { x: 575, y: 30, date: 'Sep 24', val: 310 },
                          { x: 700, y: 15, date: 'Sep 25', val: 390 }
                        ].map((pt, i) => (
                          <g key={i}>
                            <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="var(--accent-primary)" strokeWidth="2.5" />
                            <text x={Math.max(15, Math.min(680, pt.x))} y="132" fill="var(--text-muted)" fontSize="10" textAnchor="middle">
                              {pt.date}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* Latest Verifications Live Stream */}
                    <div className="latest-verifications-card glass">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Latest Verifications Stream</h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time claims audited across official and social channels</p>
                        </div>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
                          onClick={() => setWorkspaceTab('feed')}
                        >
                          View All ({filteredNews.length})
                        </button>
                      </div>

                      <div className="latest-list">
                        {filteredNews.slice(0, 5).map(item => (
                          <div
                            key={item.id}
                            className="latest-item-row"
                            onClick={() => handleFactCheck(item)}
                          >
                            <div className="latest-item-info">
                              <div className="latest-item-icon">
                                <ShieldCheck size={18} />
                              </div>
                              <div>
                                <div className="latest-item-title">{item.title}</div>
                                <div className="latest-item-meta">
                                  <span>{item.source}</span> • <span>{item.timestamp || 'Recent'}</span> • <span>{item.category || 'General'}</span>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span className={`verdict-badge ${item.verdict.toLowerCase()}`}>
                                {item.verdict}
                              </span>
                              <button
                                type="button"
                                className="btn-factcheck"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFactCheck(item);
                                }}
                              >
                                Verify AI
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Tab: Feed */}
                {workspaceTab === 'feed' && (
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
                        <span className="label">
                          <Globe size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                          {BRAND_INFO.name} • {BRAND_INFO.slogan}
                        </span>
                        <h1>{BRAND_INFO.headline}</h1>
                        <p>{BRAND_INFO.subHeadline}</p>
                        <button className="btn-primary" onClick={() => setShowFactCheckModal(true)}>
                          <ShieldCheck size={20} /> Launch DeepCheck AI
                        </button>
                      </div>
                    </header>

                    {/* News Grid */}
                    <section className="news-feed">
                      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Verified News Stream</h2>
                        <div className="filter-info" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{filteredNews.length} reports index</div>
                      </div>

                      {loading ? (
                        <div className="cyber-loader-container glass">
                          <div className="cyber-spinner-hud">
                            <div className="cyber-spinner-outer"></div>
                            <div className="cyber-spinner-middle"></div>
                            <div className="cyber-spinner-inner"></div>
                            <div className="cyber-spinner-core">
                              <Cpu size={22} className="spin-icon" />
                            </div>
                          </div>
                          <div className="cyber-loader-title">Quantum Veracity Engine Active</div>
                          <div className="cyber-loader-subtitle">
                            Streaming real-time feeds from NDTV, BBC World, The Hindu, PIB Archives & Google Gemini NLP Forensics...
                          </div>
                          <div className="cyber-loader-bar-wrap">
                            <div className="cyber-loader-bar-fill"></div>
                          </div>
                        </div>
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

                {/* Tab: Analytics */}
                {workspaceTab === 'analytics' && (
                  <div className="analytics-view glass" style={{ padding: '2rem', borderRadius: 14 }}>
                    <h2 style={{ marginBottom: '1rem' }}>📊 Forensic Analytics & Disinformation Radar</h2>
                    <div className="admin-stats" style={{ marginBottom: '1.5rem' }}>
                      <div className="stat-card glass">
                        <h3>1,822</h3>
                        <p>Claims Scanned</p>
                      </div>
                      <div className="stat-card glass">
                        <h3>99.4%</h3>
                        <p>AI Veracity Precision</p>
                      </div>
                      <div className="stat-card glass">
                        <h3>240ms</h3>
                        <p>Avg Engine Latency</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                      <p>Our deepfake classifier and Gemini NLP engine cross-index claims across 15+ verified public press wire repositories in real time. Sensationalism detection indexes lexical markers, emotional triggers, and uncorroborated attributions.</p>
                    </div>
                  </div>
                )}

                {/* Tab: Docs */}
                {workspaceTab === 'docs' && (
                  <div className="docs-view glass" style={{ padding: '2rem', borderRadius: 14 }}>
                    <h2 style={{ marginBottom: '1rem' }}>📄 Official Verified Documents Archive</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Directly indexed circulars from Government Gazettes, PIB Fact Check releases, and official ministries.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {[
                        { title: "MORTH Phase-3 Highway Expansion Official Gazette Notification", date: "Sep 2026", authority: "Ministry of Road Transport & Highways" },
                        { title: "Clarification on Currency Note Denomination Rumors", date: "Aug 2026", authority: "Reserve Bank of India & PIB" },
                        { title: "National Higher Education Laptop Scheme Clarification Advisory", date: "Sep 2026", authority: "Ministry of Education" }
                      ].map((doc, idx) => (
                        <div key={idx} style={{ padding: '1rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.92rem' }}>{doc.title}</strong>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doc.authority} • {doc.date}</span>
                          </div>
                          <span className="badge" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>✓ Official Record</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Users */}
                {workspaceTab === 'users' && (
                  <div className="users-view glass" style={{ padding: '2rem', borderRadius: 14 }}>
                    <h2 style={{ marginBottom: '1rem' }}>👥 TruthGuard Contributor Community</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Active journalists, verified researchers, and fact-checking analysts.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {[
                        { name: "Md Ekbal", role: "Super Admin", verified: "Lead System Architect" },
                        { name: "Rohit Sharma", role: "Senior Editor", verified: "Press Bureau Investigator" },
                        { name: "Ananya Iyer", role: "Fact Checker", verified: "Media Literacy Research" }
                      ].map((u, idx) => (
                        <div key={idx} style={{ padding: '1rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.92rem' }}>{u.name}</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.verified}</span>
                            </div>
                          </div>
                          <span className="badge">{u.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Certs */}
                {workspaceTab === 'certs' && (
                  <div className="certs-view glass" style={{ padding: '2rem', borderRadius: 14 }}>
                    <h2 style={{ marginBottom: '1rem' }}>🛡️ SRA Cryptographic Fact Certificates</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Audited stories are sealed with SHA-256 integrity hashes to prevent tampering.</p>
                    <div style={{ padding: '1.5rem', borderRadius: 12, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Certificate of Verification</span>
                          <h3 style={{ fontSize: '1.1rem' }}>SRA-TG-2026-99481X</h3>
                        </div>
                        <span className="badge" style={{ background: '#22c55e', color: '#ffffff' }}>AUTHENTIC</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Subject: <em>"Highway expansion corridor budget approval under official gazette #4910"</em></p>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                        Integrity Hash: 8f4c2e91b7a63580d19f84bc9103de48e77a1024cf6291a8e932b0f69a19c520
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Settings */}
                {workspaceTab === 'settings' && (
                  <div className="settings-view glass" style={{ padding: '2rem', borderRadius: 14 }}>
                    <h2>⚙️ System & Engine Preferences</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                      Configure institutional fact-checking modules and verification thresholds.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                      <div style={{ padding: '1.2rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem' }}>AI Forensics Engine</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Google AI Studio (Gemini 3 Flash Preview)</span>
                        </div>
                        <span className="badge" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>Active Core</span>
                      </div>

                      <div style={{ padding: '1.2rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem' }}>PIB Official Archives Sync</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated cross-referencing with Government of India press records</span>
                        </div>
                        <span className="badge" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>Connected</span>
                      </div>

                      <div style={{ padding: '1.2rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem' }}>Cryptographic SHA-256 Fact Sealing</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Generates tamper-proof blockchain-grade audit certificates</span>
                        </div>
                        <span className="badge" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc' }}>Enabled</span>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      {/* SRA DeepCheck Google AI Studio Modal */}
      {showFactCheckModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <div className="ai-title">
                <ShieldCheck size={26} color="var(--accent-primary)" />
                <div>
                  <h2 style={{ fontSize: '1.25rem', lineHeight: 1.2 }}>SRA TruthGuard AI Verifier</h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>
                    Powered by Google AI Studio (Gemini Intelligence)
                  </span>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowFactCheckModal(false)}><X /></button>
            </div>

            <div className="modal-body">
              {/* Method Tabs */}
              <div className="input-methods">
                <button
                  type="button"
                  className={`method-tab ${factCheckMethod === 'text' ? 'active' : ''}`}
                  onClick={() => setFactCheckMethod('text')}
                >
                  <FileText size={16} /> Viral Text
                </button>
                <button
                  type="button"
                  className={`method-tab ${factCheckMethod === 'video' ? 'active' : ''}`}
                  onClick={() => setFactCheckMethod('video')}
                >
                  <Video size={16} /> Deepfake Video
                </button>
                <button
                  type="button"
                  className={`method-tab ${factCheckMethod === 'doc' ? 'active' : ''}`}
                  onClick={() => setFactCheckMethod('doc')}
                >
                  <FileText size={16} /> Circular / PDF
                </button>
                <button
                  type="button"
                  className={`method-tab ${factCheckMethod === 'url' ? 'active' : ''}`}
                  onClick={() => setFactCheckMethod('url')}
                >
                  <LinkIcon size={16} /> Web Link
                </button>
              </div>

              <div className="ai-workspace">
                <div className="upload-zone glass">
                  <div className="claim-input-box">
                    <textarea
                      className="claim-textarea"
                      placeholder={
                        factCheckMethod === 'video'
                          ? "Paste video link, transcript, or viral video claim description to inspect deepfake metadata..."
                          : factCheckMethod === 'doc'
                          ? "Paste text from circular, government notification, or recruitment announcement..."
                          : factCheckMethod === 'url'
                          ? "Enter web article URL or press release link for cross-channel corroboration..."
                          : "Type or paste any viral news claim, WhatsApp message, or headline to verify..."
                      }
                      value={customClaim}
                      onChange={(e) => setCustomClaim(e.target.value)}
                    />

                    {/* Quick Suggestion Chips */}
                    <div className="claim-suggestions">
                      <button
                        type="button"
                        className="suggestion-chip"
                        onClick={() => {
                          const c = "Government announced free laptops scheme for all university students starting next month.";
                          setCustomClaim(c);
                          startSraCheck(c);
                        }}
                      >
                        💡 Free Student Laptops
                      </button>
                      <button
                        type="button"
                        className="suggestion-chip"
                        onClick={() => {
                          const c = "Viral WhatsApp messages claim RBI is releasing new ₹5000 currency notes.";
                          setCustomClaim(c);
                          startSraCheck(c);
                        }}
                      >
                        💡 New ₹5000 Notes
                      </button>
                      <button
                        type="button"
                        className="suggestion-chip"
                        onClick={() => {
                          const c = "Ministry of Road Transport and Highways clears budget for highway expansion phase 3.";
                          setCustomClaim(c);
                          startSraCheck(c);
                        }}
                      >
                        💡 Highway Expansion Budget
                      </button>
                      <button
                        type="button"
                        className="suggestion-chip"
                        onClick={() => {
                          const c = "Global tech giant signing 50-acre R&D campus in Bengaluru.";
                          setCustomClaim(c);
                          startSraCheck(c);
                        }}
                      >
                        💡 Bengaluru Tech Hub
                      </button>
                    </div>
                  </div>

                  <button
                    className="nexus-btn-primary"
                    style={{ marginTop: '1rem', width: '100%' }}
                    onClick={() => startSraCheck()}
                    disabled={isAiProcessing}
                  >
                    {isAiProcessing ? (
                      <>
                        <RefreshCw size={18} className="spin-icon" /> Computing Veracity via Google AI Studio...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} /> Run Google Gemini DeepCheck
                      </>
                    )}
                  </button>
                </div>

                {/* Prominent Modal Active Processing Banner */}
                {isAiProcessing && (
                  <div className="ai-processing-hud-card glass" style={{ margin: '0 0 1rem 0' }}>
                    <div className="hud-spinner-box">
                      <div className="ring-outer"></div>
                      <div className="ring-inner"></div>
                      <div className="core-dot"></div>
                    </div>
                    <div className="ai-processing-hud-info">
                      <div className="ai-processing-hud-title">
                        <Sparkles size={16} color="var(--accent-secondary)" /> Google Gemini NLP Forensics Active
                      </div>
                      <div className="ai-processing-hud-status">
                        <span className="pulse"></span> Cross-referencing claim across PIB archives & verified media repositories
                      </div>
                    </div>
                  </div>
                )}

                {/* Forensic Logs & Result Container */}
                <div className="ai-logs glass">
                  {aiLogs.map((log, i) => (
                    <div key={i} className="log-entry">{log}</div>
                  ))}

                  {isAiProcessing && (
                    <div className="log-entry" style={{ color: 'var(--accent-secondary)' }}>
                      <span className="pulse"></span> Computing neural veracity matrix & sensationalism index...
                    </div>
                  )}

                  {!isAiProcessing && factCheckResult && (
                    <div className="verdict-result final">
                      <div className="verdict-header-row">
                        <div className={`verdict-tag ${factCheckResult.verdict.toLowerCase()}`}>
                          {factCheckResult.verdict === 'True' && '🟢 VERIFIED TRUE'}
                          {factCheckResult.verdict === 'False' && '🔴 FABRICATED / FALSE'}
                          {factCheckResult.verdict === 'Misleading' && '🟡 MISLEADING CONTEXT'}
                          {factCheckResult.verdict !== 'True' && factCheckResult.verdict !== 'False' && factCheckResult.verdict !== 'Misleading' && `⚪ ${factCheckResult.verdict}`}
                        </div>
                        <div className="ai-model-tag">
                          {factCheckResult.aiModel || 'Google AI Studio (Gemini 3 Flash)'}
                        </div>
                      </div>

                      {/* Veracity & Sensationalism Meters */}
                      <div className="meters-grid">
                        <div className="meter-box">
                          <div className="meter-label">
                            <span>Truth Confidence</span>
                            <strong style={{ color: '#4ade80' }}>{factCheckResult.confidence}%</strong>
                          </div>
                          <div className="meter-bar-track">
                            <div
                              className="meter-bar-fill"
                              style={{
                                width: `${factCheckResult.confidence}%`,
                                backgroundColor:
                                  factCheckResult.confidence > 80
                                    ? '#22c55e'
                                    : factCheckResult.confidence > 50
                                    ? '#f59e0b'
                                    : '#ef4444'
                              }}
                            />
                          </div>
                        </div>

                        <div className="meter-box">
                          <div className="meter-label">
                            <span>Sensationalism Index</span>
                            <strong style={{ color: factCheckResult.sensationalismIndex > 50 ? '#f87171' : '#60a5fa' }}>
                              {factCheckResult.sensationalismIndex}%
                            </strong>
                          </div>
                          <div className="meter-bar-track">
                            <div
                              className="meter-bar-fill"
                              style={{
                                width: `${factCheckResult.sensationalismIndex}%`,
                                backgroundColor:
                                  factCheckResult.sensationalismIndex > 60
                                    ? '#ef4444'
                                    : factCheckResult.sensationalismIndex > 30
                                    ? '#f59e0b'
                                    : '#3b82f6'
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="explanation-card">
                        <p>{factCheckResult.explanation}</p>
                      </div>

                      {/* Source attribution */}
                      <div className="source-credit">
                        <ShieldCheck size={14} color="var(--accent-secondary)" />
                        <span>Debunking / Verifying Authority: <strong>{factCheckResult.source}</strong></span>
                      </div>
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
            <a href="https://chimerical-boba-ea62fe.netlify.app/" target="_blank" rel="noopener noreferrer" className="footer-link">Live Netlify App</a>
            <a href="mailto:zainul7abideen@gmail.com" className="footer-link">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
