export interface NavItem {
  id: string;
  label: string;
  labelRu?: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  priceStart?: string;
  features?: string[];
  tag?: string;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  category: 'all' | 'sourcing' | 'packaging' | 'transit';
  iconName: string;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  description: string;
  origin: string;
  imageUrl: string;
  specs: {
    label: string;
    value: string;
  }[];
  careLevel?: string;
  estimatedPrice?: string;
}

export interface TrustDocument {
  id: string;
  title: string;
  issuer: string;
  regNumber: string;
  category: 'Government License' | 'Quality & Health' | 'Organic Certification' | 'Trade Compliance';
  issueDate: string;
  validTill: string;
  status: 'Verified & Active' | 'Renewed' | 'Authorized';
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  uploadedAt: string;
  uploadedBy: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductGradeType {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  fallbackImage?: string;
  specs: ProductSpec[];
}

export interface ProductCategory {
  id: string;
  name: string;
  tagline: string;
  heroImage: string;
  types: ProductGradeType[];
}

export interface QuoteFormData {
  serviceType: string;
  category: string;
  destination: string;
  quantity: number;
  needPackaging: boolean;
  needInstallation: boolean;
  contactName: string;
  contactPhone: string;
}

export interface QuoteInquiry {
  id: string;
  customerName: string;
  contactNumber: string;
  locality: string;
  category: string;
  plantCount: number;
  includePots: boolean;
  needInstallation: boolean;
  estimatedTotal: number;
  transitTime: string;
  submittedAt: string;
  isRead: boolean;
  status: 'New' | 'Contacted' | 'Fulfilled' | 'Archived';
  notes?: string;
}
