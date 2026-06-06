interface BaseBook {
  id: string;
  namespaceId: string;
  name: string;
  slug: string;
  author: string;
  lang: 'en' | 'uk';
  langAvailable: ('en' | 'uk')[];
  category: string[];
  priceRegular: number;
  priceDiscount: number | null;
  images: string[];
  publicationYear: number;
  publication: string;
  description: string[];
}

export interface Audiobook extends BaseBook {
  type: 'audiobook';
  narrator: string;
  listeningLength: number;
}

export interface KindleBook extends BaseBook {
  type: 'kindle';
  coverType: string | null;
  numberOfPages: number;
  format: string;
  illustrations: boolean;
}

export interface Paperback extends BaseBook {
  type: 'paperback';
  coverType: 'paperback' | 'hardcover' | 'softcover' | 'ebook' | null;
  numberOfPages: number;
  format: string;
  illustrations: boolean;
}

export type Book = Audiobook | KindleBook | Paperback;
