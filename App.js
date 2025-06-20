import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CryptoCurrencyList from "./CryptoCurrencyList";
import LoginScreen from "./LoginScreen";
import CoinDetailScreen from "./CoinDetailScreen";
import { MaterialIcons } from "@expo/vector-icons";

const backgroundImage = require("./assets/images/tsunami-home.png");
const logo = require("./assets/logo/Logo3.png");
const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCoin(null);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    // <ImageBackground
    //   source={backgroundImage}
    //   style={styles.background}
    //   resizeMode='cover'
    // >
    <LinearGradient
      colors={["#2C7D7D", "#1B3D44"]}
      start={{ x: -0.5, y: 0 }}
      end={{ x: -1, y: 0.5 }}
      style={styles.background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>TSUNAMI</Text>
          </View>
          <TouchableOpacity onPress={() => console.log("pressing account!")}>
            <MaterialIcons name='account-circle' size={42} color='white' />
          </TouchableOpacity>
        </View>
        
        <View style={styles.container}>
          <CryptoCurrencyList onCoinSelect={handleCoinSelect} />
          <StatusBar style='auto' />
        </View>
      </SafeAreaView>

      {/* Coin Detail Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <CoinDetailScreen coin={selectedCoin} onClose={handleCloseModal} />
      </Modal>
    </LinearGradient>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  background: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 28,
    marginLeft: 10,
  },
  logo: {
    height: 40,
    width: 40,
  },
  container: {
    flex: 1,
  },
});
