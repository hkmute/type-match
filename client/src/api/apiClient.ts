import qs from 'qs';

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

const apiHost = import.meta.env.VITE_API_HOST;

const apiClient = Object.freeze({
  get: async <TData>(url: string, params?: Record<string, any>, options?: RequestInit) => {
    const query = qs.stringify(params);
    const apiPath = query ? `${url}?${query}` : url;
    const fetchUrl = new URL(apiPath, apiHost);
    try {
      const res = await fetch(fetchUrl, options);
      if (!res.ok) {
        const error = (await res.json()) as ApiErrorResponse;
        throw new Error(error.message);
      }
      return res.json() as Promise<ApiSuccessResponse<TData>>;
    } catch (error) {
      console.error('Error:', error.message, fetchUrl);
      throw new Error(error);
    }
  },
  post: async <TData>(url: string, body?: Record<string, any>) => {
    const fetchUrl = new URL(url, apiHost);
    try {
      const res = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const error = (await res.json()) as ApiErrorResponse;
        throw error;
      }
      return res.json() as Promise<ApiSuccessResponse<TData>>;
    } catch (error) {
      console.error('Error:', error.message, fetchUrl);
      throw error;
    }
  },
  put: async <TData>(url: string, body?: Record<string, any>) => {
    const fetchUrl = new URL(url, apiHost);
    try {
      const res = await fetch(fetchUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const error = (await res.json()) as ApiErrorResponse;
        throw error;
      }
      return res.json() as Promise<ApiSuccessResponse<TData>>;
    } catch (error) {
      console.error('Error:', error.message, fetchUrl);
      throw error;
    }
  },
  delete: async <TData>(url: string, params?: Record<string, any>) => {
    const query = qs.stringify(params);
    const apiPath = query ? `${url}?${query}` : url;
    const fetchUrl = new URL(apiPath, apiHost);
    try {
      const res = await fetch(fetchUrl, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const error = (await res.json()) as ApiErrorResponse;
        throw new Error(error.message);
      }
      return res.json() as Promise<ApiSuccessResponse<TData>>;
    } catch (error) {
      console.error('Error:', error.message, fetchUrl);
      throw new Error(error);
    }
  }
});

export default apiClient;
