import { NewsApiResponse } from '../types/news';
import axios from "axios";

const BASE_URL_NEWS = 'https://newsapi.org/v2';
const API_KEY = '34169d103f284ebfaa6d2fd82572de64'; // <-- Replace with your API key
const PAGE_SIZE = 10;
const DEFAULT_COUNTRY = 'us';
const BASE_URL_Product = "https://dummyjson.com/products";

let controller: AbortController | null = null;

export const cancelInFlight = () => {
  if (controller) {
    controller.abort();
    controller = null;
  }
};
export const fetchNews = async ({page = 1, country = DEFAULT_COUNTRY}) => {
  cancelInFlight();
  controller = new AbortController();
  const url = `${BASE_URL_NEWS}/top-headlines?country=${country}&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${API_KEY}`;
  const res = await fetch(url, { signal: controller.signal });
  if (!res.ok) {
    throw new Error(`API error (${res.status}): ${res.statusText}`);
  }
  const json: NewsApiResponse = await res.json();
  return {
    articles: json.articles,
    totalResults: json.totalResults,
  };
};

// Product List with Search, Filter, and Lazy Loading

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
  total: number; //is the total number of products in API.
  skip: number; //tells how many items we skipped (used for pagination)
  limit: number; //is how many items we fetched in one call.
}

export const getProducts = async (limit = 10, skip = 0, search = "", category = ""): Promise<ProductsResponse> => {
  let url = `${BASE_URL_Product}?limit=${limit}&skip=${skip}`;
  if (search) url = `${BASE_URL_Product}/search?q=${search}&limit=${limit}&skip=${skip}`;
  if (category) url = `${BASE_URL_Product}/category/${category}?limit=${limit}&skip=${skip}`;

  const res = await axios.get<ProductsResponse>(url);
  return res.data;
};

export const getCategories = async (): Promise<any[]> => {
  const res = await axios.get("https://dummyjson.com/products/categories");
  return res.data;
};

