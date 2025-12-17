import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import CryptocurrencyListItem from "../components/CryptocurrencyListItem";
import React, { useEffect, useState } from "react";
import { getMarketData } from "../apis/coinGeckoAPI";
import theme from "../theme/theme";
import { useTheme } from "../context/ThemeContext";

const DATA = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image:
      "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    current_price: 29405,
    market_cap: 569484392152,
    market_cap_rank: 1,
    fully_diluted_valuation: 617758162407,
    total_volume: 17386049969,
    high_24h: 29544,
    low_24h: 28969,
    price_change_24h: -73.15458235108235,
    price_change_percentage_24h: -0.24817,
    market_cap_change_24h: -1164207768.1923828,
    market_cap_change_percentage_24h: -0.20401,
    circulating_supply: 19358987,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69045,
    ath_change_percentage: -57.42344,
    ath_date: "2021-11-10T14:24:11.849Z",
    atl: 67.81,
    atl_change_percentage: 43252.48392,
    atl_date: "2013-07-06T00:00:00.000Z",
    roi: null,
    last_updated: "2023-04-29T04:34:40.623Z",
    price_change_percentage_24h_in_currency: -0.24816854854399642,
    sparkline_in_7d: {
      price: [29500, 29400, 29600, 29300, 29700, 29500, 29405]
    },
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    current_price: 1902.65,
    market_cap: 229099329690,
    market_cap_rank: 2,
    fully_diluted_valuation: 229110243853,
    total_volume: 8047384442,
    high_24h: 1922.57,
    low_24h: 1880.33,
    price_change_24h: -9.515130397475104,
    price_change_percentage_24h: -0.49761,
    market_cap_change_24h: -1000089737.9986267,
    market_cap_change_percentage_24h: -0.43463,
    circulating_supply: 120400464.266637,
    total_supply: 120406200.07691,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -61.0163,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 439119.23426,
    atl_date: "2015-10-20T00:00:00.000Z",
    roi: {
      times: 85.49468736353957,
      currency: "btc",
      percentage: 8549.468736353958,
    },
    last_updated: "2023-04-29T04:34:42.547Z",
    price_change_percentage_24h_in_currency: -0.49760972069102083,
    sparkline_in_7d: {
      price: [1920, 1910, 1905, 1895, 1900, 1915, 1902.65]
    },
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image:
      "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663",
    current_price: 1.001,
    market_cap: 81689531213,
    market_cap_rank: 3,
    fully_diluted_valuation: 81689531213,
    total_volume: 23858815161,
    high_24h: 1.005,
    low_24h: 0.997392,
    price_change_24h: 0.0003299,
    price_change_percentage_24h: 0.03297,
    market_cap_change_24h: 26924856,
    market_cap_change_percentage_24h: 0.03297,
    circulating_supply: 81615536097.7521,
    total_supply: 81615536097.7521,
    max_supply: null,
    ath: 1.32,
    ath_change_percentage: -24.29136,
    ath_date: "2018-07-24T00:00:00.000Z",
    atl: 0.572521,
    atl_change_percentage: 74.96258,
    atl_date: "2015-03-02T00:00:00.000Z",
    roi: null,
    last_updated: "2023-04-29T04:30:00.290Z",
    price_change_percentage_24h_in_currency: 0.032970851050690295,
    sparkline_in_7d: {
      price: [0.999, 1.001, 0.998, 1.002, 1.000, 1.001, 1.001]
    },
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image:
      "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
    current_price: 324.36,
    market_cap: 51222940667,
    market_cap_rank: 4,
    fully_diluted_valuation: 64885866799,
    total_volume: 1354090647,
    high_24h: 327.71,
    low_24h: 319.88,
    price_change_24h: -3.3196865341146804,
    price_change_percentage_24h: -1.01309,
    market_cap_change_24h: -436157935.0171814,
    market_cap_change_percentage_24h: -0.8443,
    circulating_supply: 157886280,
    total_supply: 157900174,
    max_supply: 200000000,
    ath: 686.31,
    ath_change_percentage: -52.71981,
    ath_date: "2021-05-10T07:24:17.097Z",
    atl: 0.0398177,
    atl_change_percentage: 814831.76888,
    atl_date: "2017-10-19T00:00:00.000Z",
    roi: null,
    last_updated: "2023-04-29T04:34:42.023Z",
    price_change_percentage_24h_in_currency: -1.0130873758367975,
    sparkline_in_7d: {
      price: [330, 328, 325, 322, 324, 326, 324.36]
    },
  },
  {
    id: "usd-coin",
    symbol: "usdc",
    name: "USD Coin",
    image:
      "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
    current_price: 1,
    market_cap: 30508403359,
    market_cap_rank: 5,
    fully_diluted_valuation: 30506403912,
    total_volume: 5843400969,
    high_24h: 1.003,
    low_24h: 0.994044,
    price_change_24h: 0.00046911,
    price_change_percentage_24h: 0.04692,
    market_cap_change_24h: -29469400.35576248,
    market_cap_change_percentage_24h: -0.0965,
    circulating_supply: 30502657798.2263,
    total_supply: 30500658728.3347,
    max_supply: null,
    ath: 1.17,
    ath_change_percentage: -14.64875,
    ath_date: "2019-05-08T00:40:28.300Z",
    atl: 0.877647,
    atl_change_percentage: 14.04583,
    atl_date: "2023-03-11T08:02:13.981Z",
    roi: null,
    last_updated: "2023-04-29T04:34:42.180Z",
    price_change_percentage_24h_in_currency: 0.046921826910867895,
    sparkline_in_7d: {
      price: [0.998, 1.002, 0.999, 1.001, 1.000, 0.999, 1.000]
    },
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731",
    current_price: 0.481574,
    market_cap: 24924388885,
    market_cap_rank: 6,
    fully_diluted_valuation: 48162316113,
    total_volume: 1247066048,
    high_24h: 0.485298,
    low_24h: 0.46714,
    price_change_24h: 0.01058267,
    price_change_percentage_24h: 2.24689,
    market_cap_change_24h: 608022864,
    market_cap_change_percentage_24h: 2.50047,
    circulating_supply: 51750810378,
    total_supply: 99988998998,
    max_supply: 100000000000,
    ath: 3.4,
    ath_change_percentage: -85.82684,
    ath_date: "2018-01-07T00:00:00.000Z",
    atl: 0.00268621,
    atl_change_percentage: 17831.14759,
    atl_date: "2014-05-22T00:00:00.000Z",
    roi: null,
    last_updated: "2023-04-29T04:34:44.334Z",
    price_change_percentage_24h_in_currency: 2.246893233670914,
    sparkline_in_7d: {
      price: [0.470, 0.475, 0.472, 0.478, 0.480, 0.485, 0.481574]
    },
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image:
      "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860",
    current_price: 0.405669,
    market_cap: 14226222531,
    market_cap_rank: 7,
    fully_diluted_valuation: 18267360062,
    total_volume: 234775358,
    high_24h: 0.410729,
    low_24h: 0.398754,
    price_change_24h: -0.003919631226741494,
    price_change_percentage_24h: -0.95697,
    market_cap_change_24h: -121435568.16404343,
    market_cap_change_percentage_24h: -0.84638,
    circulating_supply: 35045020830.3234,
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -86.86388,
    ath_date: "2021-09-02T06:00:10.474Z",
    atl: 0.01925275,
    atl_change_percentage: 2006.19513,
    atl_date: "2020-03-13T02:22:55.044Z",
    roi: null,
    last_updated: "2023-04-29T04:34:46.815Z",
    price_change_percentage_24h_in_currency: -0.9569682679404165,
    sparkline_in_7d: {
      price: [0.410, 0.408, 0.412, 0.407, 0.409, 0.411, 0.405669]
    },
  },
  {
    id: "staked-ether",
    symbol: "steth",
    name: "Lido Staked Ether",
    image:
      "https://assets.coingecko.com/coins/images/13442/large/steth_logo.png?1608607546",
    current_price: 1900.4,
    market_cap: 11782304199,
    market_cap_rank: 8,
    fully_diluted_valuation: 11782304199,
    total_volume: 19005813,
    high_24h: 1919.85,
    low_24h: 1873.6,
    price_change_24h: -4.238708262227419,
    price_change_percentage_24h: -0.22255,
    market_cap_change_24h: 9196499,
    market_cap_change_percentage_24h: 0.07811,
    circulating_supply: 6199351.49591586,
    total_supply: 6199351.49591586,
    max_supply: 6199351.49591586,
    ath: 4829.57,
    ath_change_percentage: -60.72257,
    ath_date: "2021-11-10T14:40:47.256Z",
    atl: 482.9,
    atl_change_percentage: 292.8238,
    atl_date: "2020-12-22T04:08:21.854Z",
    roi: null,
    last_updated: "2023-04-29T04:34:39.862Z",
    price_change_percentage_24h_in_currency: -0.22254620541261586,
    sparkline_in_7d: {
      price: [1910, 1905, 1920, 1900, 1915, 1908, 1900.4]
    },
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image:
      "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256",
    current_price: 0.081051,
    market_cap: 11284710534,
    market_cap_rank: 9,
    fully_diluted_valuation: null,
    total_volume: 303752733,
    high_24h: 0.081118,
    low_24h: 0.0794,
    price_change_24h: 0.00080385,
    price_change_percentage_24h: 1.00171,
    market_cap_change_24h: 130003896,
    market_cap_change_percentage_24h: 1.16546,
    circulating_supply: 139133546383.705,
    total_supply: null,
    max_supply: null,
    ath: 0.731578,
    ath_change_percentage: -88.92224,
    ath_date: "2021-05-08T05:08:23.458Z",
    atl: 0.0000869,
    atl_change_percentage: 93155.41052,
    atl_date: "2015-05-06T00:00:00.000Z",
    roi: null,
    last_updated: "2023-04-29T04:34:47.054Z",
    price_change_percentage_24h_in_currency: 1.0017097986034575,
    sparkline_in_7d: {
      price: [0.080, 0.079, 0.081, 0.078, 0.082, 0.080, 0.081051]
    },
  },
  {
    id: "matic-network",
    symbol: "matic",
    name: "Polygon",
    image:
      "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912",
    current_price: 1.008,
    market_cap: 9323470887,
    market_cap_rank: 10,
    fully_diluted_valuation: 10080006557,
    total_volume: 292650393,
    high_24h: 1.014,
    low_24h: 0.982078,
    price_change_24h: -0.001283856789759952,
    price_change_percentage_24h: -0.12715,
    market_cap_change_24h: -10357209.930425644,
    market_cap_change_percentage_24h: -0.11096,
    circulating_supply: 9249469069.28493,
    total_supply: 10000000000,
    max_supply: 10000000000,
    ath: 2.92,
    ath_change_percentage: -65.52809,
    ath_date: "2021-12-27T02:08:34.307Z",
    atl: 0.00314376,
    atl_change_percentage: 31877.36197,
    atl_date: "2019-05-10T00:00:00.000Z",
    roi: {
      times: 382.44043298634637,
      currency: "usd",
      percentage: 38244.04329863464,
    },
    last_updated: "2023-04-29T04:34:39.409Z",
    price_change_percentage_24h_in_currency: -0.12714824736953695,
    sparkline_in_7d: {
      price: [1.015, 1.012, 1.018, 1.010, 1.014, 1.011, 1.008]
    },
  },
];

const CryptoCurrencyList = ({ onCoinSelect }) => {
  const [cryptoData, setCryptoData] = useState(DATA); // Start with mock data as fallback
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalVolume, setTotalVolume] = useState(0);
  const COINS_PER_PAGE = 25;
  const { isDarkMode } = useTheme();
  
  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  // Calculate total volume from current crypto data
  const calculateTotalVolume = (data) => {
    const total = data.reduce((sum, coin) => {
      return sum + (coin.total_volume || 0);
    }, 0);
    setTotalVolume(total);
  };

  // Format volume for display
  const formatVolume = (volume) => {
    if (volume >= 1e12) {
      return `$${(volume / 1e12).toFixed(2)} Tn`;
    } else if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)} Bn`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)} Mn`;
    } else {
      return `$${volume.toLocaleString()}`;
    }
  };

  useEffect(() => {
    async function handleGetMarketData() {
      try {
        setIsLoading(true);
        const prices = await getMarketData(COINS_PER_PAGE); // Start with 25 coins
        if (prices && prices.length > 0) {
          setCryptoData(prices);
          calculateTotalVolume(prices);
          console.log(`✅ Live API data loaded successfully - ${COINS_PER_PAGE} coins`);
        } else {
          console.log("⚠️ API returned empty data, using mock data");
          setCryptoData(DATA);
          calculateTotalVolume(DATA);
        }
      } catch (error) {
        console.log("⚠️ API failed, using mock data:", error.message);
        setCryptoData(DATA);
        calculateTotalVolume(DATA);
      } finally {
        setIsLoading(false);
      }
    }
    handleGetMarketData();
  }, []); // Only run on mount

  console.log("CryptoCurrencyList rendering with data:", cryptoData.length, "items");
  
  const loadMoreCoins = async () => {
    if (isLoadingMore || !hasMoreData) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const startIndex = currentPage * COINS_PER_PAGE + 1;
      
      // Limit to 200 coins total to prevent memory issues
      if (cryptoData.length >= 200) {
        setHasMoreData(false);
        return;
      }
      
      const newCoins = await getMarketData(COINS_PER_PAGE, startIndex);
      
      if (newCoins && newCoins.length > 0) {
        const updatedData = [...cryptoData, ...newCoins];
        setCryptoData(updatedData);
        calculateTotalVolume(updatedData);
        setCurrentPage(nextPage);
        console.log(`✅ Loaded ${newCoins.length} more coins - Total: ${updatedData.length}`);
        
        // If we got fewer coins than requested, we've reached the end
        if (newCoins.length < COINS_PER_PAGE) {
          setHasMoreData(false);
        }
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.log("⚠️ Failed to load more coins:", error.message);
      setHasMoreData(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      <View style={styles.header}>
        {/* Column Headers */}
        <View style={styles.columnHeaders}>
          <View style={styles.leftColumnHeader}>
            <Text style={[styles.columnHeaderText, { color: currentTheme.text.muted }]}>RANK</Text>
            <Text style={[styles.columnHeaderText, { color: currentTheme.text.muted, marginLeft: 48 }]}>COIN</Text>
          </View>
          <View style={styles.centerColumnHeader}>
            <Text style={[styles.columnHeaderText, { color: currentTheme.text.muted }]}>7D</Text>
          </View>
          <View style={styles.rightColumnHeader}>
            <Text style={[styles.columnHeaderText, { color: currentTheme.text.muted }]}>PRICE</Text>
          </View>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: currentTheme.text.secondary }]}>Loading crypto data...</Text>
        </View>
      ) : (
        <FlatList
          data={cryptoData}
          renderItem={({ item, index }) => (
            <CryptocurrencyListItem 
              currency={item} 
              index={index} 
              onPress={() => onCoinSelect && onCoinSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMoreCoins}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() => 
            isLoadingMore ? (
              <View style={styles.loadingMoreContainer}>
                <Text style={[styles.loadingMoreText, { color: currentTheme.text.secondary }]}>Loading more coins...</Text>
              </View>
            ) : !hasMoreData && cryptoData.length > COINS_PER_PAGE ? (
              <View style={styles.endOfListContainer}>
                <Text style={[styles.endOfListText, { color: currentTheme.text.muted }]}>No more coins to load</Text>
              </View>
            ) : null
          }
          // removeClippedSubviews={true} // Removed to fix swipe gestures
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={15}
          windowSize={10}
        />
      )}
    </View>
  );
};

export default CryptoCurrencyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  columnHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  leftColumnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerColumnHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  rightColumnHeader: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  columnHeaderText: {
    fontSize: theme.typography.sizes.caption - 2, // Made smaller
    fontWeight: theme.typography.weights.medium, // Reduced from bold to medium
    fontFamily: theme.typography.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coinCountContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
  },
  coinCountButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: 2,
  },
  selectedCoinCount: {
    backgroundColor: theme.colors.brand.primary,
  },
  coinCountText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  selectedCoinCountText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  subheader: {
    color: theme.colors.brand.primary,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.h2, // Reduced from h1 to h2
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  text: {
    color: theme.colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl,
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
  },
  loadingMoreContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  loadingMoreText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
  },
  endOfListContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  endOfListText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
  },
});
