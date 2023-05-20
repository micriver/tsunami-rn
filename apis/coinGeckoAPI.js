import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";
// api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum&vs_currencies=usd&include_24hr_change=true

export const getMarketData = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h&locale=en`
    );
    return response.data;
  } catch (error) {
    console.error(error);
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
    console.error(error);
  }
};

// additional API functions here
