import { api } from "@/lib/axios";

export type ApiBrand = {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

type GetBrandsResponse = {
  results: number;
  metadata?: {
    currentPage?: number;
    numberOfPages?: number;
    limit?: number;
  };
  data: ApiBrand[];
};

type GetBrandResponse = {
  data: ApiBrand;
};

export async function getBrandsApi() {
  const { data } = await api.get<GetBrandsResponse>("/brands");
  return data;
}

export async function getBrandByIdApi(id: string) {
  const { data } = await api.get<GetBrandResponse>(`/brands/${id}`);
  return data;
}