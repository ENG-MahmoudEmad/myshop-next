import { api } from "@/lib/axios";
import { getToken } from "@/features/auth/utils/auth-storage";

export type AddReviewPayload = {
  review: string;
  rating: number;
  product: string; // ✅ لازم يكون product مش productId
};

export type UpdateReviewPayload = {
  review: string;
  rating: number;
};

function authHeaders() {
  const t = getToken();
  if (!t) return {};
  return { token: t, Authorization: `Bearer ${t}` };
}

export async function addReviewApi(payload: AddReviewPayload) {
  const { data } = await api.post("/reviews", payload, {
    headers: authHeaders(),
  });
  return data;
}

export async function updateReviewApi(reviewId: string, payload: UpdateReviewPayload) {
  const { data } = await api.put(`/reviews/${reviewId}`, payload, {
    headers: authHeaders(),
  });
  return data;
}

export async function deleteReviewApi(reviewId: string) {
  const { data } = await api.delete(`/reviews/${reviewId}`, {
    headers: authHeaders(),
  });
  return data;
}

export async function getProductReviews(productId: string) {
  const { data } = await api.get(`/products/${productId}/reviews`);
  return data;
}