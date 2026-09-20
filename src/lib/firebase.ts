import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ProductCategory, ProductItem, QuoteInquiry, TrustDocument } from '../types';
import { INITIAL_TRUST_DOCUMENTS, PRODUCT_GALLERY } from '../data/storeData';
import { INITIAL_QUOTES } from '../data/storage';
import { categories as INITIAL_EXPORT_CATEGORIES } from '../data/products';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore Database (using provisioned databaseId)
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

export const auth = getAuth(app);

// Collection References
export const quotesCollection = collection(db, 'quotes');
export const exportCategoriesCollection = collection(db, 'exportCategories');
export const trustDocsCollection = collection(db, 'trustDocs');
export const productsCollection = collection(db, 'products');

/**
 * 1. QUOTES SERVICE
 */
export function subscribeQuotes(
  onQuotes: (quotes: QuoteInquiry[]) => void,
  onError?: (error: Error) => void
): () => void {
  let isInitial = true;
  return onSnapshot(
    quotesCollection,
    async (snapshot) => {
      if (snapshot.empty && isInitial) {
        isInitial = false;
        // Seed initial quotes if database collection is empty
        try {
          for (const q of INITIAL_QUOTES) {
            await setDoc(doc(db, 'quotes', q.id), q);
          }
        } catch (err) {
          console.warn('Could not seed initial quotes to Firestore:', err);
        }
        onQuotes(INITIAL_QUOTES);
        return;
      }
      isInitial = false;
      const list: QuoteInquiry[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as QuoteInquiry);
      });
      // Sort newest first
      list.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      onQuotes(list);
    },
    (error) => {
      console.error('Firestore quotes listener error:', error);
      if (onError) onError(error);
    }
  );
}

export async function saveQuoteToFirestore(quote: QuoteInquiry): Promise<void> {
  await setDoc(doc(db, 'quotes', quote.id), quote, { merge: true });
}

export async function updateQuoteInFirestore(
  quoteId: string,
  updates: Partial<QuoteInquiry>
): Promise<void> {
  await updateDoc(doc(db, 'quotes', quoteId), updates);
}

export async function deleteQuoteFromFirestore(quoteId: string): Promise<void> {
  await deleteDoc(doc(db, 'quotes', quoteId));
}

/**
 * 2. EXPORT TRADE CATEGORIES & PRODUCT GRADES SERVICE
 */
export function subscribeExportCategories(
  onCategories: (cats: ProductCategory[]) => void,
  onError?: (error: Error) => void
): () => void {
  let isInitial = true;
  return onSnapshot(
    exportCategoriesCollection,
    async (snapshot) => {
      if (snapshot.empty && isInitial) {
        isInitial = false;
        // Seed default export categories into Firestore
        try {
          for (const cat of INITIAL_EXPORT_CATEGORIES) {
            await setDoc(doc(db, 'exportCategories', cat.id), cat);
          }
        } catch (err) {
          console.warn('Could not seed export categories to Firestore:', err);
        }
        onCategories(INITIAL_EXPORT_CATEGORIES);
        return;
      }
      isInitial = false;
      const list: ProductCategory[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as ProductCategory);
      });
      onCategories(list);
    },
    (error) => {
      console.error('Firestore exportCategories listener error:', error);
      if (onError) onError(error);
    }
  );
}

export async function saveExportCategoryToFirestore(
  category: ProductCategory
): Promise<void> {
  await setDoc(doc(db, 'exportCategories', category.id), category, { merge: true });
}

export async function deleteExportCategoryFromFirestore(
  categoryId: string
): Promise<void> {
  await deleteDoc(doc(db, 'exportCategories', categoryId));
}

/**
 * 3. TRUST & REGULATORY DOCUMENTS SERVICE
 */
export function subscribeTrustDocs(
  onDocs: (docs: TrustDocument[]) => void,
  onError?: (error: Error) => void
): () => void {
  let isInitial = true;
  return onSnapshot(
    trustDocsCollection,
    async (snapshot) => {
      if (snapshot.empty && isInitial) {
        isInitial = false;
        try {
          for (const td of INITIAL_TRUST_DOCUMENTS) {
            await setDoc(doc(db, 'trustDocs', td.id), td);
          }
        } catch (err) {
          console.warn('Could not seed trust docs to Firestore:', err);
        }
        onDocs(INITIAL_TRUST_DOCUMENTS);
        return;
      }
      isInitial = false;
      const list: TrustDocument[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as TrustDocument);
      });
      onDocs(list);
    },
    (error) => {
      console.error('Firestore trustDocs listener error:', error);
      if (onError) onError(error);
    }
  );
}

export async function saveTrustDocToFirestore(
  docItem: TrustDocument
): Promise<void> {
  await setDoc(doc(db, 'trustDocs', docItem.id), docItem, { merge: true });
}

export async function deleteTrustDocFromFirestore(docId: string): Promise<void> {
  await deleteDoc(doc(db, 'trustDocs', docId));
}

/**
 * 4. BOTANICAL GALLERY PRODUCTS SERVICE
 */
export function subscribeProducts(
  onProducts: (products: ProductItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  let isInitial = true;
  return onSnapshot(
    productsCollection,
    async (snapshot) => {
      if (snapshot.empty && isInitial) {
        isInitial = false;
        try {
          for (const p of PRODUCT_GALLERY) {
            await setDoc(doc(db, 'products', p.id), p);
          }
        } catch (err) {
          console.warn('Could not seed products to Firestore:', err);
        }
        onProducts(PRODUCT_GALLERY);
        return;
      }
      isInitial = false;
      const list: ProductItem[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as ProductItem);
      });
      onProducts(list);
    },
    (error) => {
      console.error('Firestore products listener error:', error);
      if (onError) onError(error);
    }
  );
}

export async function saveProductToFirestore(
  product: ProductItem
): Promise<void> {
  await setDoc(doc(db, 'products', product.id), product, { merge: true });
}

export async function deleteProductFromFirestore(
  productId: string
): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
}
