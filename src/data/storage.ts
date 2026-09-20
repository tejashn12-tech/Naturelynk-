import { ProductItem, TrustDocument, QuoteInquiry, ProductCategory } from '../types';
import { PRODUCT_GALLERY, INITIAL_TRUST_DOCUMENTS } from './storeData';
import { categories as INITIAL_EXPORT_CATEGORIES } from './products';

const PRODUCTS_KEY = 'naturelink_products_v1';
const TRUST_DOCS_KEY = 'naturelink_trust_documents_v1';
const QUOTES_KEY = 'naturelink_quotes_v1';
const AUTH_KEY = 'naturelink_admin_auth_v1';
const EXPORT_CATEGORIES_KEY = 'naturelink_export_categories_v2';

export const ADMIN_CREDENTIALS = {
  adminId: 'admin@123',
  password: 'admin@123',
};

export const INITIAL_QUOTES: QuoteInquiry[] = [
  {
    id: 'quote-1001',
    customerName: 'Ananya Deshpande',
    contactNumber: '+91 98451 22890',
    locality: 'Gokulam 3rd Stage, Mysuru',
    category: 'Exotic Indoor Flora',
    plantCount: 14,
    includePots: true,
    needInstallation: true,
    estimatedTotal: 8900,
    transitTime: 'Within 90–120 minutes (Local Mysuru Dispatch)',
    submittedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 mins ago
    isRead: false,
    status: 'New',
    notes: 'Requested shade-loving fiddle leaf fig & monstera for balcony makeover.',
  },
  {
    id: 'quote-1002',
    customerName: 'Karthik Rao (Heritage Villa)',
    contactNumber: '+91 94480 34112',
    locality: 'Jayalakshmipuram, Mysuru',
    category: 'Artisanal Terracotta & Planters',
    plantCount: 20,
    includePots: true,
    needInstallation: false,
    estimatedTotal: 12250,
    transitTime: 'Within 90–120 minutes (Local Mysuru Dispatch)',
    submittedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    isRead: false,
    status: 'New',
    notes: 'Urgent delivery before evening housewarming ceremony.',
  },
];

export const getStoredQuotes = (): QuoteInquiry[] => {
  try {
    const data = localStorage.getItem(QUOTES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse stored quotes', e);
  }
  return INITIAL_QUOTES;
};

export const saveStoredQuotes = (quotes: QuoteInquiry[]): void => {
  try {
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error('Failed to save quotes', e);
  }
};

export const getStoredProducts = (): ProductItem[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse stored products', e);
  }
  return PRODUCT_GALLERY;
};

export const saveStoredProducts = (products: ProductItem[]): void => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products', e);
  }
};

export const getStoredTrustDocs = (): TrustDocument[] => {
  try {
    const data = localStorage.getItem(TRUST_DOCS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse stored documents', e);
  }
  return INITIAL_TRUST_DOCUMENTS;
};

export const saveStoredTrustDocs = (docs: TrustDocument[]): void => {
  try {
    localStorage.setItem(TRUST_DOCS_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save documents', e);
  }
};

export const getAdminAuth = (): boolean => {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

export const setAdminAuth = (isAuthed: boolean): void => {
  try {
    if (isAuthed) {
      localStorage.setItem(AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (e) {
    console.error('Failed to set auth state', e);
  }
};

export const getStoredExportCategories = (): ProductCategory[] => {
  try {
    const data = localStorage.getItem(EXPORT_CATEGORIES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse stored export categories', e);
  }
  return INITIAL_EXPORT_CATEGORIES;
};

export const saveStoredExportCategories = (cats: ProductCategory[]): void => {
  try {
    localStorage.setItem(EXPORT_CATEGORIES_KEY, JSON.stringify(cats));
  } catch (e) {
    console.error('Failed to save export categories', e);
  }
};

