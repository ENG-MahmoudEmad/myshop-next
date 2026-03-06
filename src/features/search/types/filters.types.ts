export type FilterItem = {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
};

export type ListResponse<T> = {
  results: number;
  data: T[];
};