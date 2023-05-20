import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CryptoCurrencyList from "./CryptoCurrencyList";

const backgroundImage = require("./assets/images/tsunami-home.png");
const logo = require("./assets/logo/Logo3.png");
const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

export default function App() {
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
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 12,
            marginHorizontal: 10,
          }}
        >
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>TSUNAMI</Text>
        </View>
        <View style={styles.container}>
          <CryptoCurrencyList />
          <StatusBar style='auto' />
        </View>
      </SafeAreaView>
    </LinearGradient>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    // fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 36,
    marginLeft: 16,
  },
  logo: {
    height: 65,
    width: 65,
    marginLeft: 10,
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    alignItems: "cover",
    justifyContent: "center",
    margin: -4,
  },
});
