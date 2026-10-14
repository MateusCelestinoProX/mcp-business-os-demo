export interface LibraryItem {
  id: string;
  slug: string;
  title: string;
  file: string;
  rel_path: string;
  category: string;
  category_group: string;
  ext: string;
  size: number;
  size_formatted: string;
  pages?: number | null;
  text_preview: string;
  tags: string[];
}

export interface LibraryCategoryGroup {
  group: string;
  count: number;
}

export interface LibraryResponse {
  items: LibraryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: LibraryCategoryGroup[];
  stats: {
    totalItems: number;
    totalSize: number;
    totalCategories: number;
  };
}
