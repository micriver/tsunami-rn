import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CryptoCurrencyList from "./CryptoCurrencyList";
import { MaterialIcons } from "@expo/vector-icons";

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
        <View style={styles.header}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>TSUNAMI</Text>
          </View>
          <TouchableOpacity onPress={() => console.log("pressing account!")}>
            <MaterialIcons name='account-circle' size={42} color='white' />
          </TouchableOpacity>
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
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 12,
  },
  background: {
    flex: 1,
    alignItems: "cover",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    // fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 42,
    marginLeft: 8,
  },
  logo: {
    height: 65,
    width: 65,
  },
  container: {
    flex: 1,
  },
});
