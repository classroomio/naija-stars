export type Repository = {
  id: string;
  name: string;
  link: string;
  description: string;
  author: string;
  author_link: string;
  author_avatar: string;

  stars: number;
  topics: string[];
  license: {
    key: string;
    name: string;
    url: string;
  };
  forks: number;
  open_issues_count: number;
  archived: boolean;
  disabled: boolean;

  original_created_at: string;
  original_updated_at: string;

  created_at?: string; // auto set this to the time created
  updated_at?: string; // auto set this to the time updated
};

export type ApiMetadata = {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  sort: {
    sortBy: 'stars' | 'author';
    order: 'asc' | 'desc';
  };
};
