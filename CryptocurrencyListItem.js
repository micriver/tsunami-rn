import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
// import { LinearGradient } from "expo-linear-gradient";

const CryptocurrencyListItem = ({ currency, index }) => {
  const { name, symbol, current_price, price_change_24h, image } = currency;

  return (
    <TouchableOpacity onPress={() => console.log("Pressed!")}>
      <View style={styles.background}>
        <View style={styles.item}>
          <View style={styles.leftThird}>
            <Text
              style={{
                marginRight: 15,
                color: "#fff",
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              {index + 1}
            </Text>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.leftThirdText}>
              <Text style={styles.leftThirdName}>{name}</Text>
              <Text style={styles.leftThirdSymbol}>{symbol.toUpperCase()}</Text>
            </View>
          </View>

          {/* market chart goes here */}
          <View style={styles.middleThird}></View>

          <View style={styles.rightThird}>
            <Text style={styles.rightThirdPrice}>
              ${current_price.toFixed(2)}
            </Text>
            <View style={price_change_24h < 0 ? styles.red : styles.green}>
              <Text style={styles.rightThirdPrice24}>
                {price_change_24h.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CryptocurrencyListItem;

const styles = StyleSheet.create({
  background: {
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
    backgroundColor: "#F0903F",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 15,
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.35,
    shadowRadius: 5.84,
    elevation: 15,
  },

  leftThird: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  leftThirdText: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  leftThirdName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  leftThirdSymbol: {
    fontSize: 12,
    color: "white",
  },
  rightThird: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  rightThirdPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rightThirdPrice24: {
    fontSize: 12,
    color: "white",
  },
  red: {
    marginTop: 6,
    // opacity: 0.7,
    backgroundColor: "#FF0000",
    borderRadius: 5,
    padding: 5,
  },
  green: {
    marginTop: 6,
    // opacity: 0.6,
    backgroundColor: "#008000",
    borderRadius: 5,
    padding: 5,
  },
  image: {
    height: 50,
    width: 50,
    marginRight: 10,
  },
});
