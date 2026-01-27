import axios from "axios";
import { showGlobalError, showGlobalWarning } from "../components/Toast";

const BASE_URL = "https://api.coingecko.com/api/v3";

// Simple cache to avoid hitting rate limits
const cache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Rate limiting - track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 Using cached data for ${key}`);
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Clear all cached data (useful for pull-to-refresh)
export const clearCache = () => {
  cache.clear();
  console.log('🗑️ API cache cleared');
};

const rateLimitedRequest = async (requestFn) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`⏳ Rate limiting: waiting ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
  return await requestFn();
};

export const getMarketData = async (perPage = 50, startIndex = 1) => {
  const page = Math.ceil(startIndex / perPage);
  const cacheKey = `market_data_${perPage}_page_${page}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await rateLimitedRequest(() =>
      axios.get(
        `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h&locale=en`
      )
    );
    
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    if (error.response?.status === 429) {
      showGlobalWarning('Rate limit reached. Please wait a moment.');
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      showGlobalError('Request timed out. Check your connection.');
    } else if (!error.response) {
      showGlobalError('Network error. Check your internet connection.');
    } else {
      showGlobalError('Failed to load market data.');
    }
    throw error;
  }
};

export const getCoinsList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/list`);
    return response.data;
  } catch (error) {
    console.error(error);
    showGlobalError('Failed to load coins list.');
    throw error;
  }
};

export const getPriceData = async (ids) => {
  try {
    const response = await axios.get(
      // `${BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      `${BASE_URL}/simple/price?ids=bitcoin%2Cethereum&vs_currencies=usd&include_24hr_change=true`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    showGlobalError('Failed to load price data.');
    throw error;
  }
};

export const getCoinData = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin data:', error);
    if (error.response?.status === 429) {
      showGlobalWarning('Rate limit reached. Please wait a moment.');
    } else {
      showGlobalError(`Failed to load data for ${id}.`);
    }
    throw error;
  }
};

// Get historical price data for charts
export const getCoinHistoricalData = async (id, days = 30) => {
  const cacheKey = `historical_${id}_${days}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await rateLimitedRequest(() =>
      axios.get(
        `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
      )
    );
    
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    if (error.response?.status === 429) {
      showGlobalWarning('Rate limit reached. Please wait a moment.');
    } else {
      showGlobalError('Failed to load chart data.');
    }
    throw error;
  }
};

export const getCoinDetails = async (coinId) => {
  const cacheKey = `details_${coinId}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    return await rateLimitedRequest(async () => {
      console.log(`🔍 Fetching details for ${coinId}...`);
      const response = await axios.get(
        `${BASE_URL}/coins/${coinId}`,
        {
          params: {
            localization: false,
            tickers: false,
            market_data: false,
            community_data: false,
            developer_data: false,
            sparkline: false
          },
          timeout: 10000
        }
      );
      
      const data = response.data;
      setCachedData(cacheKey, data);
      console.log(`✅ Successfully fetched details for ${coinId}`);
      return data;
    });
  } catch (error) {
    console.error(`❌ Error fetching details for ${coinId}:`, error.message);
    if (error.response?.status === 429) {
      showGlobalWarning('Rate limit reached. Please wait a moment.');
      throw new Error('Rate limit exceeded. Please wait a moment.');
    } else {
      showGlobalError(`Failed to load details for ${coinId}.`);
    }
    throw error;
  }
};

export const getWatchlistData = async (coinIds) => {
  if (!coinIds || coinIds.length === 0) return [];
  const idsParam = coinIds.join(',');
  const cacheKey = `watchlist_data_${idsParam}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await rateLimitedRequest(() => 
        axios.get(`${BASE_URL}/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&sparkline=true&price_change_percentage=24h&locale=en`)
    );
    
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
      console.error('Error fetching watchlist data:', error);
      if (error.response?.status === 429) {
        showGlobalWarning('Rate limit reached. Please wait a moment.');
      } else {
        showGlobalError('Failed to load watchlist data.');
      }
      throw error;
  }
};

export const getFearGreedIndex = async () => {
  const cacheKey = 'fear_greed_index';
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    return await rateLimitedRequest(async () => {
      console.log('📊 Fetching Fear & Greed Index...');
      const response = await axios.get(
        'https://api.alternative.me/fng/',
        {
          timeout: 10000
        }
      );
      
      const data = response.data;
      setCachedData(cacheKey, data);
      console.log('✅ Successfully fetched Fear & Greed Index');
      return data;
    });
  } catch (error) {
    console.error('❌ Error fetching Fear & Greed Index:', error.message);
    if (error.response?.status === 429) {
      showGlobalWarning('Rate limit reached. Please wait a moment.');
    } else {
      showGlobalError('Failed to load Fear & Greed Index.');
    }
    throw error;
  }
};
