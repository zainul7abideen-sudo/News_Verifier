/**
 * SRA TruthGuard Client API Service
 * Handles Authentication, Verification Engine, and Persistence
 * Fully compatible with Netlify static deployments and backend APIs
 */

import { supabase } from './supabase';
import { verifyWithGemini } from './gemini';

const USERS_STORAGE_KEY = 'sra_registered_users';
const TICKETS_STORAGE_KEY = 'sra_tickets';

// Default mock users for platform authentication and admin dashboard
const DEFAULT_USERS = [
  { id: 'usr-1', name: 'Md Ekbal', username: 'admin', email: 'imd8351087@gmail.com', password: 'Admin@SecurePass2026', role: 'admin', status: 'active' },
  { id: 'usr-2', name: 'Rohit Sharma', username: 'rohit', email: 'rohit.sharma@pressbureau.in', password: 'User@123', role: 'editor', status: 'active' },
  { id: 'usr-3', name: 'Ananya Verma', username: 'ananya', email: 'ananya@indiamedia.org', password: 'User@123', role: 'user', status: 'active' },
  { id: 'usr-4', name: 'Priya Nair', username: 'priya', email: 'priya.nair@factcheck.in', password: 'User@123', role: 'analyst', status: 'active' }
];

const DEFAULT_TICKETS = [
  { id: 'tick-101', name: 'Suresh Kumar', contact: '+91 98765 43210', message: 'Viral WhatsApp video regarding new tax deductions from next month.', status: 'resolved' },
  { id: 'tick-102', name: 'Megha Gupta', contact: '+91 91234 56780', message: 'Fake recruitment notice circulating in state police department.', status: 'in-progress' },
  { id: 'tick-103', name: 'Aakash Patel', contact: 'aakash@gmail.com', message: 'Manipulated audio clip of municipal corporation officer.', status: 'pending' }
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Seed default users if empty
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to persist users in localStorage', e);
  }
}

function getStoredTickets() {
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TICKETS;
  } catch {
    return DEFAULT_TICKETS;
  }
}

export const api = {
  /**
   * Register a new user
   */
  async register(fullName, username, email, password, mobile) {
    const cleanName = (fullName || '').trim();
    const cleanUsername = (username || '').trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanMobile = (mobile || '').trim();

    if (!cleanName) {
      throw new Error('Please enter your full name.');
    }
    if (!cleanUsername) {
      throw new Error('Please choose a username.');
    }
    if (!cleanEmail) {
      throw new Error('Please enter your email address.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please provide a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const users = getStoredUsers();
    const existingEmail = users.find(u => u.email?.toLowerCase() === cleanEmail);
    if (existingEmail) {
      throw new Error('An account with this email address already exists.');
    }

    const existingUser = users.find(u => u.username?.toLowerCase() === cleanUsername);
    if (existingUser) {
      throw new Error('This username is already taken. Please choose another.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: password,
      mobile: cleanMobile,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveStoredUsers(users);

    // Try optional Supabase sync if table exists
    try {
      if (supabase) {
        await supabase.from('sra_users').insert([{
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }]);
      }
    } catch {
      // Supabase is optional; local persistence handles auth seamlessly
    }

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt
      },
      token: `sra_jwt_${Date.now()}`
    };
  },

  /**
   * Login existing user
   */
  async login(identifier, password) {
    if (!identifier || !password) {
      throw new Error('Please enter your Username / Email and Password.');
    }

    const cleanId = identifier.trim().toLowerCase();

    // Check custom admin credentials
    const adminSettingsRaw = localStorage.getItem('sra_admin_credentials');
    const adminSettings = adminSettingsRaw ? JSON.parse(adminSettingsRaw) : { userId: 'admin', password: 'Admin@SecurePass2026' };

    if ((cleanId === adminSettings.userId.toLowerCase() || cleanId === 'admin' || cleanId === 'imd8351087@gmail.com') && password === adminSettings.password) {
      const adminUser = {
        id: 'usr-admin-1',
        name: 'Md Ekbal',
        username: 'admin',
        email: 'imd8351087@gmail.com',
        role: 'admin',
        status: 'active'
      };
      return {
        success: true,
        user: adminUser,
        token: `sra_jwt_${Date.now()}`
      };
    }

    const users = getStoredUsers();
    const matchedUser = users.find(u =>
      (u.email?.toLowerCase() === cleanId || u.username?.toLowerCase() === cleanId) &&
      u.password === password
    );

    if (!matchedUser) {
      throw new Error('Invalid email/username or password. Please check your credentials or register.');
    }

    return {
      success: true,
      user: {
        id: matchedUser.id,
        name: matchedUser.name || matchedUser.username,
        username: matchedUser.username,
        email: matchedUser.email,
        role: matchedUser.role || 'user',
        status: matchedUser.status || 'active',
        createdAt: matchedUser.createdAt
      },
      token: `sra_jwt_${Date.now()}`
    };
  },

  /**
   * Run SRA AI Multimodal Fact Check with Google Gemini
   */
  async runFactCheck(method = 'text', query = '', context = {}) {
    return await verifyWithGemini(query, method, context);
  },

  /**
   * Fetch initial news repository
   */
  async fetchNews() {
    try {
      if (supabase) {
        const { data } = await supabase.from('sra_news').select('*').limit(20);
        if (data && data.length > 0) return data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  /**
   * Fetch admin user list
   */
  async fetchAdminUsers() {
    return getStoredUsers();
  },

  /**
   * Fetch verification query tickets
   */
  async fetchAdminTickets() {
    return getStoredTickets();
  }
};
