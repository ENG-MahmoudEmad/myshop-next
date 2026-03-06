import { api } from "@/lib/axios";
import type { FilterItem, ListResponse } from "../types/filters.types";

export const getCategories = async () => {
  const res = await api.get<ListResponse<FilterItem>>("/categories");
  return res.data;
};

export const getBrands = async () => {
  const res = await api.get<ListResponse<FilterItem>>("/brands");
  return res.data;
};