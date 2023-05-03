import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const [city, serCity] = useState("Loading");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const icons = {
    "light rain": "weather-rainy",
    "overcast clouds": "weather-partly-cloudy",
    "broken clouds": "soundcloud",
    "scattered clouds": "soundcloud",
    "clear sky": "weather-sunny",
  };

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    } else {
      setOk(true);
    }
    const {
      coords: { longitude, latitude },
    } = await Location.getCurrentPositionAsync();

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    serCity(location[0].city);

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}&units=metric`
    );
    const data = await res.json();
    setDays(data.list);
    console.log(days);
  };
  useEffect(() => {
    getWeather();
  }, []);
  if (ok === false) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.cityName}>권한부여 오류😭</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.weather}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="#BD24A9" size="large" />
          </View>
        ) : (
          days.map((day, index) => {
            return (
              <View key={index} style={styles.day}>
                <Text style={styles.time}>{day.dt_txt}</Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.temp}>
                    {parseFloat(day.main.temp).toFixed(1)}°C
                  </Text>
                  <MaterialCommunityIcons
                    name={icons[day.weather[0].description]}
                    size={24}
                    color="#BD24A9"
                    style={{ marginTop: 20 }}
                  />
                </View>

                <Text style={styles.description}>
                  {day.weather[0].description}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(2,0,36) ",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "#BD24A9",
    fontSize: 50,
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
  },
  time: {
    marginLeft: 30,
    fontSize: 20,
    color: "#BD24A9",
  },
  temp: {
    marginLeft: 30,
    fontSize: 80,
    color: "#BD24A9",
  },
  description: {
    marginLeft: 30,
    fontSize: 30,
    color: "#BD24A9",
  },
});
