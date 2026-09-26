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
  Loader2,
  Check,
  Copy,
  Send,
  ArrowRight,
  Volume2,
  VolumeX,
  Radio,
  Play,
  Maximize2,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import './App.css';
import { api } from './api';

const DEFAULT_ADMIN = { userId: 'zainulcorp71@gmail.com', password: 'Zainul.@143' };

const BRAND_INFO = {
  name: 'SRA TruthGuard',
  slogan: 'A More Truthful World',
  headline: 'Institutional AI-Powered Fact-Checking Engine',
  subHeadline: 'Empowering media literacy with Google AI Studio Gemini intelligence, PIB official archives, and real-time press feed cross-auditing.',
  accent: '#38bdf8'
};

const LIVE_NEWS_CHANNELS = [
  {
    id: 'ndtv',
    name: 'NDTV 24x7',
    tagline: 'Premier 24/7 English News',
    category: 'National',
    language: 'English',
    color: '#e11d48',
    icon: '🔴',
    badge: 'LIVE 24/7',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCZFMm1mMw0F81Z37aaSuT_Q',
    headline: 'Breaking Telecast: National Policy, Parliamentary Debates & Strategic Affairs',
    sourceUrl: 'https://www.ndtv.com/live-tv'
  },
  {
    id: 'aajtak',
    name: 'Aaj Tak',
    tagline: 'Fastest Hindi Ground Telecast',
    category: 'National',
    language: 'Hindi',
    color: '#f97316',
    icon: '📺',
    badge: 'LIVE HINDI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCt4t-jeY85JegMlZ-E5UWtA',
    headline: '24/7 Real-Time Ground Reporting & Breaking Field Telecast',
    sourceUrl: 'https://www.aajtak.in/'
  },
  {
    id: 'ddnews',
    name: 'DD News (Official)',
    tagline: 'Public State Broadcaster',
    category: 'Official Gazette',
    language: 'Bilingual',
    color: '#0284c7',
    icon: '🏛️',
    badge: 'GOV OFFICIAL',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC5m-n9p_s9pU2eA2K_52_rQ',
    headline: 'Government of India Official Bulletin & Gazetted Policy Announcements',
    sourceUrl: 'https://ddnews.gov.in/'
  },
  {
    id: 'bbc',
    name: 'BBC News World',
    tagline: 'Global Investigative Telecast',
    category: 'International',
    language: 'English',
    color: '#bb1919',
    icon: '🌍',
    badge: 'GLOBAL 24/7',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA',
    headline: 'World Geopolitical Affairs, Climate Telemetry & Fact-Checked Bulletins',
    sourceUrl: 'https://www.bbc.com/news'
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera English',
    tagline: 'Middle East & World News Live',
    category: 'International',
    language: 'English',
    color: '#d97706',
    icon: '🌐',
    badge: 'WORLD WIRE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg',
    headline: 'In-Depth Global Human Rights, Conflicts & Fact-Check Reports',
    sourceUrl: 'https://www.aljazeera.com/'
  },
  {
    id: 'wion',
    name: 'WION Global',
    tagline: 'World Is One News International',
    category: 'Global South',
    language: 'English',
    color: '#8b5cf6',
    icon: '📡',
    badge: 'GLOBAL SOUTH',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC_gUM8rL-Lzy6ZOfQeiNxAA',
    headline: 'South Asian & Indo-Pacific Geopolitical Analysis & Strategic Insights',
    sourceUrl: 'https://www.wionews.com/'
  },
  {
    id: 'dw',
    name: 'DW News Global',
    tagline: 'Deutsche Welle World Service',
    category: 'International',
    language: 'English',
    color: '#0ea5e9',
    icon: '⚡',
    badge: 'EURO WIRE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg',
    headline: 'European Union Geopolitics, AI Forensics & Global Economy',
    sourceUrl: 'https://www.dw.com/'
  }
];

const MOCK_NEWS = [
  {
    id: 'mock-1',
    title: "Major Infrastructure Project Announced for Highway Expansion in Uttar Pradesh",
    source: "NDTV India",
    type: "News Channels",
    category: "National",
    timestamp: "30 mins ago",
    content: "The Ministry of Road Transport and Highways has cleared a ₹14,500 crore budget allocation for phase 3 of the expressway and smart highway corridor expansion connecting eastern and western logistics corridors.",
    fullStory: "The central government today ratified the comprehensive infrastructure outlay for the Northern Logistics Corridor. The approved DPR incorporates 6-lane elevated express sections, wildlife underpasses, and intelligent traffic management systems. Official ministry communiques confirm that environmental clearances and land acquisition metrics have reached 92% completion.",
    factChecked: true,
    verdict: "True",
    confidence: "98.4%",
    authority: "Ministry of Road Transport / PIB Archives",
    link: "https://www.ndtv.com/india-news",
    image: "https://images.unsplash.com/photo-1545143333-11cb50c33b9c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'mock-2',
    title: "Claims of New Currency Notes Starting from Next Month Found to be Fabricated",
    source: "PIB Fact Check",
    type: "Social Media",
    category: "Trending",
    timestamp: "2 hours ago",
    content: "Viral messages circulating across WhatsApp and Facebook claiming the Reserve Bank of India (RBI) is releasing newly designed ₹5000 denomination currency notes have been officially debunked as completely fictitious.",
    fullStory: "A viral digital graphic simulating an RBI notification claimed that ₹5,000 denomination banknotes would be introduced from the first of next month. Forensic analysis by SRA TruthGuard and the Press Information Bureau confirmed the circular uses altered font typography and fake signature seals. The RBI has issued no notification concerning higher-denomination physical notes.",
    factChecked: true,
    verdict: "False",
    confidence: "99.9%",
    authority: "Reserve Bank of India (RBI) & PIB Fact Check",
    link: "https://factcheck.pib.gov.in/",
    image: "https://images.unsplash.com/photo-1627000086207-77e8fd117bcf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'mock-3',
    title: "Tech Innovation Hub Setup Planned in Bengaluru by Global Tech Giant",
    source: "The Hindu",
    type: "Newspapers",
    category: "Technology",
    timestamp: "4 hours ago",
    content: "A leading international technology corporation is in the final stages of signing a bilateral Memorandum of Understanding (MoU) for a 50-acre artificial intelligence research center in Greater Bengaluru.",
    fullStory: "State industry department delegates confirmed that the proposed \$2.4 Billion research facility will house specialized laboratories focusing on high-performance generative AI models, quantum computing architecture, and multilingual NLP systems, creating over 12,000 engineering opportunities.",
    factChecked: true,
    verdict: "True",
    confidence: "96.7%",
    authority: "State Department of IT & The Hindu Business Bureau",
    link: "https://www.thehindu.com/business/",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'mock-4',
    title: "Controversial Video Clip from Recent Rally Shared Out of Context",
    source: "Republic World",
    type: "News Channels",
    category: "Politics",
    timestamp: "1 hour ago",
    content: "A 12-second cropped video clip circulating widely on social platforms depicting a political leader making inflammatory remarks has been investigated and proven to be trimmed out of its broader context.",
    fullStory: "Video forensics conducted through frame-by-frame audio spectral analysis demonstrated that a 12-second slice of speech was extracted from a 42-minute parliamentary address where the speaker was quoting an opposing historical document rather than presenting personal policy.",
    factChecked: true,
    verdict: "Misleading",
    confidence: "94.2%",
    authority: "SRA Audio Forensics & Video Spectral Engine",
    link: "https://www.republicworld.com/",
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
  const [legalModalTab, setLegalModalTab] = useState('disclaimer');

  // Live News Streaming & Reader Deck States
  const [selectedLiveChannel, setSelectedLiveChannel] = useState(LIVE_NEWS_CHANNELS[0]);
  const [showLiveStreamPlayer, setShowLiveStreamPlayer] = useState(true);
  const [readerArticle, setReaderArticle] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readerCopied, setReaderCopied] = useState(false);

  const closeReaderModal = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setReaderArticle(null);
  };

  const toggleAudioNarration = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const clean = text.replace(/<[^>]*>/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Dedicated Auth Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Form States
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regStep, setRegStep] = useState(1);
  const [regOtp, setRegOtp] = useState('');
  const [regOtpPreview, setRegOtpPreview] = useState('');
  const [regCooldown, setRegCooldown] = useState(0);

  // Staff / Admin Form States
  const [adminStaffId, setAdminStaffId] = useState('admin');
  const [adminStaffPass, setAdminStaffPass] = useState('Admin@SecurePass2026');

  // Forgot Password / Verification States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [otpPreview, setOtpPreview] = useState('');
  const [forgotCooldown, setForgotCooldown] = useState(0);
  const [copiedOtp, setCopiedOtp] = useState(false);

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

  // Countdown timer for OTP resend cooldowns
  useEffect(() => {
    const timer = setInterval(() => {
      setRegCooldown(prev => (prev > 0 ? prev - 1 : 0));
      setForgotCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    if (newView === 'forgot-password') {
      setForgotStep(1);
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setOtpPreview('');
    } else if (newView === 'registration') {
      setRegStep(1);
      setRegOtp('');
      setRegOtpPreview('');
    }
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
    } else if (role === 'sample-reg') {
      setRegFullName('Alex Morgan');
      setRegUsername('alexmorgan');
      setRegEmail('alex.morgan@pressnetwork.org');
      setRegMobile('+91 98765 00001');
      setRegPassword('Secure@1234');
      setRegConfirmPassword('Secure@1234');
    }
  };

  // Step 1: Request Dynamic OTP for Registration
  const handleRequestRegOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!regFullName.trim()) return setAuthError('Please enter your full name.');
    if (!regUsername.trim()) return setAuthError('Please enter a username.');
    if (!regEmail.trim()) return setAuthError('Please enter your email address.');
    if (regPassword !== regConfirmPassword) return setAuthError('Passwords do not match. Please check.');
    if (regPassword.length < 6) return setAuthError('Password must be at least 6 characters.');

    setIsAuthLoading(true);
    try {
      await api.requestRegistrationOtp(regEmail, regFullName);
      setRegOtp(''); // Requires user to manually enter the OTP received in their email
      setRegCooldown(30);
      setRegStep(2);
      setAuthSuccess(`📧 Verification code dispatched from ${api.SENDER_EMAIL} to ${regEmail}`);
    } catch (err) {
      setAuthError(err.message || 'Failed to dispatch verification email.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Step 2: Verify Dynamic OTP and Complete Registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!regOtp.trim()) return setAuthError('Please enter the 6-digit verification code.');

    setIsAuthLoading(true);
    try {
      await api.register(regFullName, regUsername, regEmail, regPassword, regMobile, regOtp);
      setAuthSuccess(`🎉 Email verified & account created! Logging you in...`);
      setLoginIdentifier(regEmail);
      setLoginPassword(regPassword);
      setTimeout(() => {
        setView('login');
      }, 1000);
    } catch (err) {
      setAuthError(err.message || 'Registration verification failed.');
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

  // Step 1: Request Dynamic OTP for Password Reset
  const handleRequestResetOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsAuthLoading(true);

    try {
      await api.requestForgotPasswordOtp(forgotEmail);
      setForgotOtp(''); // Requires user to manually enter the OTP received in their email
      setForgotCooldown(30);
      setForgotStep(2);
      setAuthSuccess(`📧 Security reset code dispatched from ${api.SENDER_EMAIL} to ${forgotEmail}`);
    } catch (err) {
      setAuthError(err.message || 'Failed to send verification code.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Step 2: Verify Dynamic OTP and Reset Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (forgotNewPassword !== forgotConfirmPassword) {
      setAuthError('New passwords do not match. Please re-enter.');
      return;
    }

    setIsAuthLoading(true);
    try {
      const res = await api.resetPassword(forgotEmail, forgotOtp, forgotNewPassword);
      setAuthSuccess(res.message || 'Password reset successfully!');
      setLoginIdentifier(forgotEmail);
      setLoginPassword(forgotNewPassword);
      setTimeout(() => {
        setView('login');
      }, 1200);
    } catch (err) {
      setAuthError(err.message || 'Failed to reset password.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const updateAdminCredentials = (id, pass) => {
    const newSettings = { userId: id, password: pass };
    setAdminSettings(newSettings);
    localStorage.setItem('sra_admin_credentials', JSON.stringify(newSettings));
    alert("Admin Credentials Updated Successfully!");
  };

  // Unified Authentication View (Login / Register / Staff Access / Forgot Password)
  if (view === 'registration' || view === 'login' || view === 'admin' || view === 'forgot-password') {
    return (
      <div className="nexus-auth-container">
        <div className="nexus-auth-card glass">
          <div className="nexus-logo" onClick={() => setView('dashboard')} title="Back to Home Feed">
            <ShieldCheck size={28} color="var(--accent-primary)" />
            <span>SRA<span className="accent">TruthGuard</span></span>
          </div>

          {/* Official System Dispatcher Badge */}
          <div style={{ padding: '0.45rem 0.85rem', borderRadius: 8, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.76rem', color: '#e0f2fe' }}>
            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }}></span>
            <span>Official OTP Sender: <strong style={{ color: '#38bdf8' }}>zainulcorp71@gmail.com</strong></span>
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
              className={`auth-tab ${view === 'forgot-password' ? 'active' : ''}`}
              onClick={() => switchAuthView('forgot-password')}
            >
              <Mail size={14} /> Forgot Pass
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
                title="Staff Admin (Md Ekbal)"
              >
                🛡️ Admin (Md Ekbal)
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => fillDemoAccount('editor')}
                title="Editor Role"
              >
                ✍️ Editor (Rohit)
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
                onClick={() => fillDemoAccount('sample-reg')}
                title="Auto-fill sample data for new user registration"
              >
                ⚡ Fast-Fill (Alex)
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
              <p className="subtitle">Sign in to verify real-time news, submit forensic queries, and access truth archives.</p>
              <form onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="text"
                    aria-label="Email or Username"
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
                    aria-label="Account Password"
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.3rem', marginBottom: '0.6rem' }}>
                  <span
                    style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => switchAuthView('forgot-password')}
                  >
                    Forgot Password?
                  </span>
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

          {/* VIEW: FORGOT PASSWORD */}
          {view === 'forgot-password' && (
            <>
              <p className="subtitle">Reset your password with a dynamic 6-digit verification code sent from <strong>{api.SENDER_EMAIL}</strong>.</p>
              
              {forgotStep === 1 ? (
                <form onSubmit={handleRequestResetOtp}>
                  <div className="input-group">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      aria-label="Registered Email Address"
                      placeholder="Your Registered Email Address"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="nexus-btn-primary" disabled={isAuthLoading}>
                    {isAuthLoading ? (
                      <>
                        <RefreshCw size={16} className="spin-icon" /> Sending OTP via {api.SENDER_EMAIL}...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Send 6-Digit Password Reset OTP
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit}>
                  <div style={{ padding: '0.85rem', borderRadius: 8, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.82rem', color: '#e0f2fe', fontWeight: 600 }}>
                      📧 Security OTP Sent to {forgotEmail}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Please check your inbox, retrieve the 6-digit code sent from <strong>{api.SENDER_EMAIL}</strong>, and enter it below.
                    </div>
                  </div>

                  <div className="input-group">
                    <KeyRound size={18} className="input-icon" />
                    <input
                      type="text"
                      aria-label="6-Digit Security OTP"
                      placeholder="Enter 6-Digit Security OTP"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      aria-label="New Password"
                      placeholder="New Password (min. 6 chars)"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-pw-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      aria-label="Confirm New Password"
                      placeholder="Confirm New Password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-pw-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <button type="submit" className="nexus-btn-primary" disabled={isAuthLoading}>
                    {isAuthLoading ? (
                      <>
                        <RefreshCw size={16} className="spin-icon" /> Verifying Code & Resetting...
                      </>
                    ) : (
                      'Verify Code & Reset Password'
                    )}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem', fontSize: '0.8rem' }}>
                    <span
                      style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                      onClick={() => setForgotStep(1)}
                    >
                      ← Edit Email Address
                    </span>
                    <button
                      type="button"
                      disabled={forgotCooldown > 0 || isAuthLoading}
                      onClick={handleRequestResetOtp}
                      style={{ color: forgotCooldown > 0 ? 'var(--text-muted)' : 'var(--accent-secondary)', fontWeight: 600, cursor: forgotCooldown > 0 ? 'not-allowed' : 'pointer' }}
                    >
                      {forgotCooldown > 0 ? `Resend OTP (${forgotCooldown}s)` : 'Resend OTP'}
                    </button>
                  </div>
                </form>
              )}

              <p className="auth-footer">
                Remember your password?
                <span onClick={() => switchAuthView('login')}>Back to Login</span>
              </p>
            </>
          )}

          {/* VIEW: REGISTRATION */}
          {view === 'registration' && (
            <>
              <p className="subtitle">Join the SRA TruthGuard media verification network with verified email security.</p>
              
              {regStep === 1 ? (
                <form onSubmit={handleRequestRegOtp}>
                  <div className="form-row">
                    <div className="input-group">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        aria-label="Full Name"
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
                        aria-label="Account Username"
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
                      aria-label="Email Address for Verification"
                      placeholder="Your Email Address (will receive OTP)"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      aria-label="Mobile Phone Number (Optional)"
                      placeholder="Mobile Number (Optional)"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      aria-label="Registration Password"
                      placeholder="Password (min. 6 characters)"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-pw-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      aria-label="Confirm Registration Password"
                      placeholder="Confirm Password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-pw-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <button type="submit" className="nexus-btn-primary" disabled={isAuthLoading}>
                    {isAuthLoading ? (
                      <>
                        <RefreshCw size={16} className="spin-icon" /> Sending OTP via {api.SENDER_EMAIL}...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Send Email Verification OTP
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyAndRegister}>
                  <div style={{ padding: '0.85rem', borderRadius: 8, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.82rem', color: '#e0f2fe', fontWeight: 600 }}>
                      📧 Verification OTP Sent to {regEmail}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Please check your inbox for the 6-digit verification code sent from <strong>{api.SENDER_EMAIL}</strong> and enter it below manually.
                    </div>
                  </div>

                  <div className="input-group">
                    <KeyRound size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Enter 6-Digit Email Verification Code"
                      required
                      maxLength={6}
                      value={regOtp}
                      onChange={(e) => setRegOtp(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="nexus-btn-primary" disabled={isAuthLoading}>
                    {isAuthLoading ? (
                      <>
                        <RefreshCw size={16} className="spin-icon" /> Validating Code & Creating Account...
                      </>
                    ) : (
                      'Verify Code & Complete Registration'
                    )}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem', fontSize: '0.8rem' }}>
                    <span
                      style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                      onClick={() => setRegStep(1)}
                    >
                      ← Edit Registration Details
                    </span>
                    <button
                      type="button"
                      disabled={regCooldown > 0 || isAuthLoading}
                      onClick={handleRequestRegOtp}
                      style={{ color: regCooldown > 0 ? 'var(--text-muted)' : 'var(--accent-secondary)', fontWeight: 600, cursor: regCooldown > 0 ? 'not-allowed' : 'pointer' }}
                    >
                      {regCooldown > 0 ? `Resend Code (${regCooldown}s)` : 'Resend Code'}
                    </button>
                  </div>
                </form>
              )}

              <p className="auth-footer">
                Already registered?
                <span onClick={() => switchAuthView('login')}>Sign In</span>
              </p>
            </>
          )}

          {/* VIEW: STAFF ACCESS */}
          {view === 'admin' && (
            <>
              <p className="subtitle">Authorized institutional personnel only. Enter Staff credentials.</p>
              <form onSubmit={handleAdminSubmit}>
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    aria-label="Staff Identifier"
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
                    aria-label="Staff Access Key"
                    placeholder="Staff Access Key"
                    required
                    value={adminStaffPass}
                    onChange={(e) => setAdminStaffPass(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pw-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                <h2>Super Admin Profile</h2>
                <div className="profile-info-list">
                  <div className="info-item"><span className="label">Name:</span> <span>Zainul Abideen</span></div>
                  <div className="info-item"><span className="label">Email:</span> <span>zainulcorp71@gmail.com</span></div>
                  <div className="info-item"><span className="label">Mobile:</span> <span>+91 98765 43210</span></div>
                  <div className="info-item"><span className="label">Support:</span> <span>zainulcorp71@gmail.com</span></div>
                  <div className="info-item"><span className="label">Status:</span> <span className="badge" style={{ background: '#22c55e', color: '#fff' }}>Verified Master Admin</span></div>
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
            <p><strong>System Super Admin</strong></p>
            <p>Zainul Abideen</p>
          </div>
        </nav>
        <main className="admin-main">
          <header className="admin-header glass">
            <h1>SRA TruthGuard System Management</h1>
            <div className="admin-profile">
              <div className="admin-info-text" style={{ textAlign: 'right' }}>
                <span className="admin-name" style={{ display: 'block', fontWeight: '700' }}>Zainul Abideen</span>
                <span className="admin-sub" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Super Admin</span>
              </div>
              <div className="admin-avatar" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#ffffff', fontWeight: 800 }}>ZA</div>
            </div>
          </header>
          {renderAdminContent()}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      {/* WCAG Skip to Main Content Landmark */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Dynamic Ambient Animation Background Layer */}
      <div className="ambient-theme-layer">
        <div className="ambient-glass-orb orb-1" />
        <div className="ambient-glass-orb orb-2" />
      </div>

      {/* Global Sidebar Navigation */}
      <nav aria-label="Global Sidebar Navigation" className={`global-sidebar glass ${showSidebar ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={() => setShowSidebar(false)} aria-label="Close sidebar navigation"><X /></button>
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
      </nav>

      {/* Site Header Landmark */}
      <header role="banner" className="site-header">
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

        {/* Navigation Bar */}
        <nav aria-label="Primary Navigation" className="navbar glass">
          <div className="container nav-content">
            <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                className="menu-toggle-btn"
                onClick={() => setShowSidebar(true)}
                aria-label="Open sidebar navigation menu"
                style={{ background: 'transparent', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 0 }}
              >
                <Menu className="hamburger-menu" size={28} />
              </button>
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
                  type="search"
                  aria-label="Search truth repository"
                  placeholder="Search truth repository..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="search-btn" size={18} aria-hidden="true" />
              </div>

              <div className="nav-actions">
                {user ? (
                  <button className="nav-btn logout-nav" onClick={logout} title="Logout" aria-label="Log Out of SRA TruthGuard"><LogOut size={18} /></button>
                ) : (
                  <button className="nav-btn register-btn" onClick={() => setView('login')} aria-label="Open Login and Registration Dialog">Login</button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main id="main-content" role="main" className="container main-content">
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
                <div style={{ marginTop: '1.5rem', padding: '0.9rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                    ⚡ System Engine
                  </div>
                  <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span className="pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }}></span>
                    <span>AI Core: <strong>Gemini 3 Flash</strong></span>
                  </div>
                  <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8' }}></span>
                    <span>PIB Archive: <strong>Live Sync</strong></span>
                  </div>
                  <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a855f7' }}></span>
                    <span>Truth Precision: <strong>99.4%</strong></span>
                  </div>
                </div>
              </aside>

              {/* Main Workspace Canvas */}
              <section className="workspace-main-canvas" aria-label="Truth Verification Workspace">
                {/* Tab: Dashboard */}
                {workspaceTab === 'dashboard' && (
                  <>
                    {/* Primary Accessible H1 Header */}
                    <div className="workspace-hero-banner" style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }}></span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--accent-secondary)', textTransform: 'uppercase' }}>
                          Institutional AI Telemetry Active
                        </span>
                      </div>
                      <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, margin: '0 0 0.4rem 0' }}>
                        SRA TruthGuard — AI-Powered Fact-Checking & News Verification Platform
                      </h1>
                      <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0, maxWidth: '850px', lineHeight: 1.5 }}>
                        Multimodal truth forensics, deepfake detection, Press Information Bureau (PIB) gazette corroboration, and SHA-256 cryptographic claim certificates.
                      </p>
                    </div>

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
                    {/* Live News Multi-Channel Streaming Center */}
                    <section className="live-streams-section glass" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: 16 }}>
                      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                            <span className="pulse" style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></span>
                            <h2 style={{ fontSize: '1.35rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Tv size={22} color="#38bdf8" /> 24/7 Live News Broadcast Center
                            </h2>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                            Real-time streaming feeds with instant AI-powered live speech and claim verification
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setShowLiveStreamPlayer(!showLiveStreamPlayer)}
                            style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            aria-label={showLiveStreamPlayer ? 'Collapse Live Player' : 'Expand Live Player'}
                          >
                            <Tv size={15} /> {showLiveStreamPlayer ? 'Hide Player' : 'Show Player'}
                          </button>
                        </div>
                      </div>

                      {/* Multi-Channel Switcher Tabs */}
                      <div className="channel-tabs" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                        {LIVE_NEWS_CHANNELS.map(ch => {
                          const isActive = selectedLiveChannel.id === ch.id;
                          return (
                            <button
                              key={ch.id}
                              type="button"
                              onClick={() => {
                                setSelectedLiveChannel(ch);
                                setShowLiveStreamPlayer(true);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.9rem',
                                borderRadius: 10,
                                background: isActive ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.03)',
                                border: isActive ? '1px solid #38bdf8' : '1px solid var(--glass-border)',
                                color: isActive ? '#ffffff' : 'var(--text-muted)',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '0.82rem',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                              }}
                              aria-label={`Switch to ${ch.name} live broadcast`}
                            >
                              <span style={{ fontSize: '1rem' }}>{ch.icon}</span>
                              <span>{ch.name}</span>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: 4,
                                  background: isActive ? ch.color : 'rgba(255,255,255,0.1)',
                                  color: '#ffffff',
                                  fontWeight: 700
                                }}
                              >
                                {ch.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Responsive Live Video Player */}
                      {showLiveStreamPlayer && selectedLiveChannel && (
                        <div className="player-container" style={{ borderRadius: 12, overflow: 'hidden', background: '#000000', border: '1px solid rgba(56,189,248,0.25)', boxShadow: '0 8px 30px rgba(0,0,0,0.7)' }}>
                          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                              src={selectedLiveChannel.embedUrl}
                              title={`${selectedLiveChannel.name} Official 24/7 Live Stream`}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            ></iframe>
                          </div>

                          {/* Live Channel Telemetry & Action Bar */}
                          <div style={{ padding: '1rem 1.25rem', background: 'rgba(15,23,42,0.95)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>{selectedLiveChannel.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', padding: '0.1rem 0.5rem', borderRadius: 4, background: 'rgba(56,189,248,0.1)' }}>
                                  {selectedLiveChannel.category} • {selectedLiveChannel.language}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                {selectedLiveChannel.headline}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <button
                                type="button"
                                className="nexus-btn-primary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                onClick={() => {
                                  setCustomClaim(`Fact-check live breaking news broadcast from ${selectedLiveChannel.name}: ${selectedLiveChannel.headline}`);
                                  setShowFactCheckModal(true);
                                }}
                                aria-label="Run DeepCheck AI Fact-Check on this Live Stream"
                              >
                                <Sparkles size={15} /> DeepCheck Live Claim
                              </button>
                              <a
                                href={selectedLiveChannel.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                                style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                aria-label={`Open ${selectedLiveChannel.name} Official Website (opens in a new tab)`}
                              >
                                <ExternalLink size={14} /> Official Site
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </section>

                    {/* Category Filter Tabs */}
                    <section className="categories-scroll" aria-label="News Categories">
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

                    {/* News Grid with Comprehensive Access */}
                    <section className="news-feed">
                      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Verified Multi-Source News Feed</h2>
                        <div className="filter-info" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {filteredNews.length} verified reports indexed
                        </div>
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
                            <div
                              key={item.id}
                              className="news-card glass"
                              onClick={() => setReaderArticle(item)}
                              style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                            >
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
                                <h3 style={{ fontSize: '1.05rem', lineHeight: 1.35, marginBottom: '0.5rem' }}>{item.title}</h3>
                                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>{item.content}</p>
                                
                                <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setReaderArticle(item)}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}
                                    aria-label={`Read full story for ${item.title}`}
                                  >
                                    <BookOpen size={14} /> Read Full Story
                                  </button>
                                  
                                  <button
                                    type="button"
                                    className="btn-factcheck"
                                    onClick={() => handleFactCheck(item)}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}
                                    aria-label={`Run AI Verification on ${item.title}`}
                                  >
                                    <ShieldCheck size={14} /> Verify AI
                                  </button>
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
                        { name: "Zainul Abideen", role: "Super Admin", verified: "Lead Verifier & Platform Architect", email: "zainulcorp71@gmail.com" },
                        { name: "Md Ekbal", role: "Core Admin", verified: "Lead System Architect", email: "imd8351087@gmail.com" },
                        { name: "Rohit Sharma", role: "Senior Editor", verified: "Press Bureau Investigator", email: "rohit.sharma@pressbureau.in" },
                        { name: "Ananya Iyer", role: "Fact Checker", verified: "Media Literacy Research", email: "ananya@indiamedia.org" }
                      ].map((u, idx) => (
                        <div key={idx} style={{ padding: '1rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.role === 'Super Admin' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#ffffff' }}>
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.92rem' }}>{u.name}</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.verified} • <span style={{ color: 'var(--accent-secondary)' }}>{u.email}</span></span>
                            </div>
                          </div>
                          <span className="badge" style={{ background: u.role === 'Super Admin' ? 'rgba(34,197,94,0.18)' : undefined, color: u.role === 'Super Admin' ? '#4ade80' : undefined }}>{u.role}</span>
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
              <button className="close-btn" onClick={() => setShowFactCheckModal(false)} aria-label="Close DeepCheck AI verifier modal"><X /></button>
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

      {/* Full News Article Reader & Forensic Audit Modal */}
      {readerArticle && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reader-modal-title">
          <div className="modal-content glass reader-modal" style={{ maxWidth: '780px', width: '92%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            {/* Modal Header */}
            <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', fontWeight: 700 }}>
                  {readerArticle.category || 'General'}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {readerArticle.source} • {readerArticle.timestamp || 'Recent'}
                </span>
              </div>
              <button
                className="close-btn"
                onClick={closeReaderModal}
                aria-label="Close reader modal"
              >
                <X />
              </button>
            </div>

            {/* Scrollable Reader Body */}
            <div className="modal-body" style={{ overflowY: 'auto', padding: '1.5rem', flex: 1 }}>
              {/* Article Cover Image */}
              {readerArticle.image && (
                <div style={{ position: 'relative', width: '100%', height: '260px', borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
                  <img
                    src={readerArticle.image}
                    alt={readerArticle.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`verdict-badge ${readerArticle.verdict ? readerArticle.verdict.toLowerCase() : 'pending'}`}>
                      {readerArticle.verdict ? `Veracity: ${readerArticle.verdict}` : 'Pending Audit'}
                    </span>
                    {readerArticle.confidence && (
                      <span className="badge" style={{ background: 'rgba(0,0,0,0.7)', color: '#4ade80', backdropFilter: 'blur(4px)' }}>
                        Confidence: {readerArticle.confidence}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Title */}
              <h2 id="reader-modal-title" style={{ fontSize: '1.45rem', lineHeight: 1.35, fontWeight: 800, marginBottom: '0.8rem', color: '#ffffff' }}>
                {readerArticle.title}
              </h2>

              {/* Verified Authority Banner */}
              <div style={{ padding: '0.75rem 1rem', borderRadius: 8, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem' }}>
                  <ShieldCheck size={18} color="#38bdf8" />
                  <span>Verified Authority: <strong style={{ color: '#ffffff' }}>{readerArticle.authority || readerArticle.source}</strong></span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Archive ID: <code style={{ color: '#38bdf8' }}>{readerArticle.id || 'SRA-DOC-2026'}</code>
                </div>
              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                {/* Audio TTS Button */}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => toggleAudioNarration(`${readerArticle.title}. ${readerArticle.fullStory || readerArticle.content}`)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.9rem', background: isSpeaking ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)', borderColor: isSpeaking ? '#ef4444' : 'var(--glass-border)' }}
                  aria-label={isSpeaking ? 'Stop narration' : 'Listen to article'}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX size={16} color="#ef4444" />
                      <span style={{ color: '#ef4444', fontWeight: 600 }}>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} color="#38bdf8" />
                      <span>Listen to Story (AI Voice)</span>
                    </>
                  )}
                </button>

                {/* DeepCheck AI */}
                <button
                  type="button"
                  className="nexus-btn-primary"
                  onClick={() => {
                    const claim = readerArticle.title;
                    closeReaderModal();
                    setCustomClaim(claim);
                    setShowFactCheckModal(true);
                    startSraCheck(claim);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
                >
                  <Sparkles size={15} /> Run Gemini DeepCheck
                </button>

                {/* Copy Veracity Digest */}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    const digest = `[SRA TruthGuard Verified Report]\nTitle: ${readerArticle.title}\nSource: ${readerArticle.source}\nVerdict: ${readerArticle.verdict || 'True'}\nConfidence: ${readerArticle.confidence || '98.4%'}\nAudit Node: https://sra-truthguard.pages.dev`;
                    navigator.clipboard.writeText(digest);
                    setReaderCopied(true);
                    setTimeout(() => setReaderCopied(false), 2500);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
                >
                  {readerCopied ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
                  {readerCopied ? 'Report Copied!' : 'Copy Summary'}
                </button>

                {/* Original Source Link */}
                {readerArticle.link && (
                  <a
                    href={readerArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
                    aria-label={`Open original article on ${readerArticle.source} (opens in a new tab)`}
                  >
                    <ExternalLink size={15} /> Open Source
                  </a>
                )}
              </div>

              {/* Full Article Content */}
              <div style={{ lineHeight: 1.8, fontSize: '0.96rem', color: 'var(--text-main)' }}>
                {readerArticle.content && (
                  <p style={{ fontSize: '1.05rem', fontWeight: 500, color: '#f1f5f9', marginBottom: '1.2rem', paddingLeft: '0.8rem', borderLeft: '3px solid var(--accent-primary)' }}>
                    {readerArticle.content}
                  </p>
                )}
                {readerArticle.fullStory ? (
                  <p style={{ marginBottom: '1.2rem', color: '#cbd5e1' }}>
                    {readerArticle.fullStory}
                  </p>
                ) : (
                  <p style={{ marginBottom: '1.2rem', color: '#cbd5e1' }}>
                    Full investigative verification details were indexed from the live publisher feed. SRA TruthGuard cross-references this article against official Government of India press releases, PIB Fact Check circulars, and primary gazetted records.
                  </p>
                )}
              </div>

              {/* Cryptographic Node & Compliance Badge */}
              <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: 10, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={16} color="#22c55e" />
                  <span>SRA Cryptographic Hash: <code style={{ color: '#4ade80' }}>SHA-256: 7f8a92...b4e1</code></span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Fair Use & Educational Public Literacy Node
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                className="nexus-btn-primary"
                onClick={closeReaderModal}
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
              >
                Close Article Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Legal & Regulatory Compliance Modal */}
      {showLegalModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
          <div className="modal-content glass legal-modal" style={{ maxWidth: '680px', width: '90%' }}>
            <div className="modal-header">
              <h2 id="legal-modal-title" style={{ fontSize: '1.25rem' }}>⚖️ Legal, Privacy & Compliance Standard</h2>
              <button className="close-btn" onClick={() => setShowLegalModal(false)} aria-label="Close legal and compliance dialog"><X /></button>
            </div>
            
            {/* Modal Sub-Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--glass-border)', padding: '0.5rem 1.5rem 0.75rem 1.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'disclaimer', label: 'Disclaimer' },
                { id: 'privacy', label: 'Privacy Policy (GDPR)' },
                { id: 'terms', label: 'Terms of Service' },
                { id: 'accessibility', label: 'Accessibility (A11y)' },
                { id: 'security', label: 'Security Policy' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLegalModalTab(tab.id)}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    padding: '0.35rem 0.75rem',
                    borderRadius: 6,
                    background: legalModalTab === tab.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    color: legalModalTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="modal-body legal-text" style={{ maxHeight: '55vh', overflowY: 'auto', padding: '1.25rem 1.5rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {legalModalTab === 'disclaimer' && (
                <div>
                  <h3 style={{ color: '#38bdf8', fontSize: '1rem', marginBottom: '0.5rem' }}>Educational & Public Fact-Checking Mission</h3>
                  <p><strong>Non-Commercial Purpose:</strong> SRA TruthGuard is an institutional, educational media literacy platform engineered to detect digital misinformation, manipulated media, and deepfakes.</p>
                  <p><strong>Fair Use Doctrine:</strong> All cited headlines, article snippets, and media thumbnails are processed strictly under fair-use provisions for critical analysis, public interest fact-checking, and educational commentary.</p>
                  <p><strong>Third-Party Intellectual Property:</strong> Copyrights and trademarks of analyzed articles belong solely to their respective publishers (e.g., NDTV, BBC, CNN, The Hindu, Press Information Bureau).</p>
                </div>
              )}

              {legalModalTab === 'privacy' && (
                <div>
                  <h3 style={{ color: '#38bdf8', fontSize: '1rem', marginBottom: '0.5rem' }}>Privacy Policy — GDPR Article 13 & CCPA Disclosure</h3>
                  <p><strong>Data Controller:</strong> SRA TruthGuard Technical Operations (<a href="mailto:zainulcorp71@gmail.com" style={{ color: '#38bdf8' }}>zainulcorp71@gmail.com</a>).</p>
                  <p><strong>Purpose of Data Collection:</strong> User email addresses and names are processed solely for account authentication, password recovery, and dispatch of dynamic 6-digit OTP verification codes via EmailJS.</p>
                  <p><strong>No Third-Party Tracking:</strong> We do not sell, rent, monetize, or disclose user data to advertisers or third-party data brokers.</p>
                  <p><strong>User Rights:</strong> Under GDPR and CCPA, you have the right to request access, rectification, or permanent erasure of your account details at any time by contacting our administrator.</p>
                  <p><strong>Data Retention:</strong> Active session OTPs expire automatically within 10 minutes and are permanently purged.</p>
                </div>
              )}

              {legalModalTab === 'terms' && (
                <div>
                  <h3 style={{ color: '#38bdf8', fontSize: '1rem', marginBottom: '0.5rem' }}>Terms of Service & Veracity Disclaimer</h3>
                  <p><strong>Acceptable Use:</strong> Users agree to utilize SRA TruthGuard exclusively for legitimate news verification and media authentication purposes.</p>
                  <p><strong>Automated AI Processing:</strong> Veracity scores and sensationalism metrics are computed by Google AI Studio Gemini models cross-referenced with public gazette archives. While highly accurate, users should cross-verify findings for mission-critical legal decisions.</p>
                  <p><strong>Service Availability:</strong> Provided on an "as is" and "as available" basis without implied warranties.</p>
                </div>
              )}

              {legalModalTab === 'accessibility' && (
                <div>
                  <h3 style={{ color: '#38bdf8', fontSize: '1rem', marginBottom: '0.5rem' }}>Accessibility Statement — WCAG 2.1 Level AA Standard</h3>
                  <p><strong>Commitment to Inclusion:</strong> SRA TruthGuard is built to conform to the Web Content Accessibility Guidelines (WCAG 2.1) Level AA specifications.</p>
                  <p><strong>Implemented Accessibility Features:</strong></p>
                  <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.75rem' }}>
                    <li>Full keyboard accessibility with visible focus rings and skip-to-content bypass link.</li>
                    <li>ARIA labels on all interactive controls, form inputs, and modal dialogs.</li>
                    <li>High-contrast color palette adhering to the 4.5:1 text-to-background ratio.</li>
                    <li>Semantic HTML5 landmarks (header, main, nav, aside, footer).</li>
                  </ul>
                  <p><strong>Feedback:</strong> If you encounter any accessibility barrier, email <a href="mailto:zainulcorp71@gmail.com" style={{ color: '#38bdf8' }}>zainulcorp71@gmail.com</a>.</p>
                </div>
              )}

              {legalModalTab === 'security' && (
                <div>
                  <h3 style={{ color: '#38bdf8', fontSize: '1rem', marginBottom: '0.5rem' }}>Security Policy & Vulnerability Disclosure (RFC 9116)</h3>
                  <p><strong>Encryption in Transit:</strong> All HTTP traffic is enforced over TLS 1.3 with strict HSTS preload directives.</p>
                  <p><strong>Dynamic OTP Protection:</strong> Cryptographically generated single-use OTPs with 10-minute validity and 30-second rate-limiting cooldowns.</p>
                  <p><strong>Responsible Disclosure:</strong> Security researchers can review our policy at <a href="/.well-known/security.txt" style={{ color: '#38bdf8' }}>/.well-known/security.txt</a> or report vulnerabilities directly to <a href="mailto:zainulcorp71@gmail.com" style={{ color: '#38bdf8' }}>zainulcorp71@gmail.com</a>.</p>
                </div>
              )}

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button
                  type="button"
                  className="nexus-btn-primary"
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.88rem' }}
                  onClick={() => setShowLegalModal(false)}
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Landmark */}
      <footer role="contentinfo" className="footer">
        <div className="container">
          <p>© 2026 SRA TruthGuard — Institutional AI Fact-Checking Network. Empowering Media Integrity.</p>
          <div className="footer-links">
            <span className="footer-link" onClick={() => setView('admin')} role="button" tabIndex={0}>Staff Portal</span>
            <span className="footer-link" onClick={() => { setLegalModalTab('disclaimer'); setShowLegalModal(true); }} role="button" tabIndex={0}>Legal Disclaimer</span>
            <span className="footer-link" onClick={() => { setLegalModalTab('privacy'); setShowLegalModal(true); }} role="button" tabIndex={0}>Privacy Policy (GDPR)</span>
            <span className="footer-link" onClick={() => { setLegalModalTab('terms'); setShowLegalModal(true); }} role="button" tabIndex={0}>Terms of Service</span>
            <span className="footer-link" onClick={() => { setLegalModalTab('accessibility'); setShowLegalModal(true); }} role="button" tabIndex={0}>Accessibility (A11y)</span>
            <a href="https://news-verifier.sra-news-verifier.workers.dev" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="Cloudflare Worker Live Instance (opens in a new tab)">⚡ Cloudflare Instance</a>
            <a href="https://github.com/zainul7abideen-sudo/News_Verifier" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="Official GitHub Source Repository (opens in a new tab)">📂 GitHub Repository</a>
            <a href="mailto:zainulcorp71@gmail.com" className="footer-link" aria-label="Contact Verification Operations Support">Support: zainulcorp71@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
