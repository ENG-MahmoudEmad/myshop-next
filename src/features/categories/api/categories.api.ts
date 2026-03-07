import { api } from "@/lib/axios";

export type ApiCategory = {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiSubcategory = {
  _id: string;
  name: string;
  slug?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
};

type GetCategoriesResponse = {
  results: number;
  metadata?: {
    currentPage?: number;
    numberOfPages?: number;
    limit?: number;
  };
  data: ApiCategory[];
};

type GetCategoryResponse = {
  data: ApiCategory;
};

type GetSubcategoriesResponse = {
  results: number;
  metadata?: {
    currentPage?: number;
    numberOfPages?: number;
    limit?: number;
  };
  data: ApiSubcategory[];
};

export async function getCategoriesApi(params?: {
  page?: number;
  limit?: number;
  keyword?: string;
}) {
  const { data } = await api.get<GetCategoriesResponse>("/categories", {
    params,
  });
  return data;
}

export async function getCategoryByIdApi(id: string) {
  const { data } = await api.get<GetCategoryResponse>(`/categories/${id}`);
  return data;
}

export async function getCategorySubcategoriesApi(id: string) {
  const { data } = await api.get<GetSubcategoriesResponse>(
    `/categories/${id}/subcategories`
  );
  return data;
}