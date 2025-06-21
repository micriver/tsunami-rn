import axios from "axios";

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
    throw error;
  }
};

export const getCoinsList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/list`);
    return response.data;
  } catch (error) {
    console.error(error);
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
  }
};

export const getCoinData = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin data:', error);
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
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};
