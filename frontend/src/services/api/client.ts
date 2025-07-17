import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API client configuration
const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: `${baseURL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add user address for user-specific requests
        const userAddress = localStorage.getItem('user_address');
        if (userAddress) {
          config.headers['X-User-Address'] = userAddress;
        }

        // Add timestamp for request tracking
        config.headers['X-Request-Time'] = Date.now().toString();

        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`[API] Response ${response.status}:`, response.data);
        return response;
      },
      (error) => {
        console.error('[API] Response error:', error);
        
        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              // Handle unauthorized
              localStorage.removeItem('auth_token');
              window.location.href = '/connect';
              break;
            case 403:
              // Handle forbidden
              console.warn('Access denied');
              break;
            case 404:
              // Handle not found
              console.warn('Resource not found');
              break;
            case 429:
              // Handle rate limiting
              console.warn('Rate limit exceeded');
              break;
            case 500:
              // Handle server error
              console.error('Server error');
              break;
            default:
              console.error(`API Error ${status}:`, data);
          }
          
          // Return a more user-friendly error
          return Promise.reject(new Error(data.message || `Request failed with status ${status}`));
        } else if (error.request) {
          // Network error
          return Promise.reject(new Error('Network error - please check your connection'));
        } else {
          // Other error
          return Promise.reject(new Error('Request failed'));
        }
      }
    );
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  // Utility method to set auth token
  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Utility method to remove auth token
  removeAuthToken() {
    localStorage.removeItem('auth_token');
    delete this.instance.defaults.headers.common['Authorization'];
  }

  // Utility method to set user address
  setUserAddress(address: string) {
    localStorage.setItem('user_address', address);
  }

  // Utility method to remove user address
  removeUserAddress() {
    localStorage.removeItem('user_address');
  }
}

export const apiClient = new ApiClient();

// Helper function for handling API errors
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server error response
    const { status, data } = error.response;
    
    if (data.message) {
      return data.message;
    }
    
    switch (status) {
      case 400:
        return 'Invalid request';
      case 401:
        return 'Authentication required';
      case 403:
        return 'Access denied';
      case 404:
        return 'Resource not found';
      case 429:
        return 'Too many requests';
      case 500:
        return 'Server error';
      default:
        return `Request failed with status ${status}`;
    }
  } else if (error.request) {
    return 'Network error';
  } else {
    return error.message || 'Unknown error';
  }
};

// Request retry utility
export const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
};

// Batch request utility
export const batchRequests = async <T>(
  requests: (() => Promise<T>)[],
  concurrency: number = 5
): Promise<T[]> => {
  const results: T[] = [];
  
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(request => request()));
    results.push(...batchResults);
  }
  
  return results;
};