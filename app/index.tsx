import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [totalDuration, setTotalDuration] = useState("");

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString());
    checkTimings();
  }, []);

  const checkTimings = async () => {
    const checkedInTime = await AsyncStorage.getItem("checkInTime");
    const checkedOutTime = await AsyncStorage.getItem("checkOutTime");
    if (checkedInTime) {
      setCheckInTime(new Date(checkedInTime));
    }
    if (checkedOutTime) {
      setCheckOutTime(new Date(checkedOutTime));
    }
  };

  const handleCheckIn = async () => {
    const now = new Date();
    setCheckInTime(now);
    setCheckOutTime(null);
    setTotalDuration("");
    await AsyncStorage.setItem("checkInTime", now.toISOString());
    await AsyncStorage.removeItem("checkOutTime");
    setError("");
    Alert.alert(
      "Check-In Successful",
      `You checked in at ${now.toLocaleTimeString()}`
    );
  };

  const handleCheckOut = async () => {
    if (!checkInTime) {
      setError("Please check in first!");
      return;
    }
    const now = new Date();
    const elapsedTime = now.getTime() - checkInTime.getTime();
    const elapsedHours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const elapsedMinutes = Math.floor(
      (elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const elapsedSeconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    if (elapsedHours >= 9) {
      setCheckOutTime(now);
      setTotalDuration(
        `${elapsedHours} hours, ${elapsedMinutes} minutes, and ${elapsedSeconds} seconds`
      );
      await AsyncStorage.setItem("checkOutTime", now.toISOString());
      await AsyncStorage.removeItem("checkInTime");
      Alert.alert(
        "Check-Out Successful",
        `You checked out at ${now.toLocaleTimeString()}. Total Duration: ${elapsedHours} hours, ${elapsedMinutes} minutes, and ${elapsedSeconds} seconds.`
      );
      setCheckInTime(null);
    } else {
      setError(
        `Check-out failed. Elapsed time: ${elapsedHours} hours, ${elapsedMinutes} minutes, and ${elapsedSeconds} seconds`
      );
    }
  };

  const handleReset = async () => {
    setCheckInTime(null);
    setCheckOutTime(null);
    setError("");
    setTotalDuration("");
    await AsyncStorage.removeItem("checkInTime");
    await AsyncStorage.removeItem("checkOutTime");
    Alert.alert("Reset Successful!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.card}>
          <Text style={styles.title}>SG CheckIn</Text>
          <Text style={styles.date}>Today's Date: {currentDate}</Text>
          {checkInTime && (
            <Text style={styles.time}>
              Check-In Time: {checkInTime.toLocaleTimeString()}
            </Text>
          )}
          {checkOutTime && (
            <>
              <Text style={styles.time}>
                Check-Out Time: {checkOutTime.toLocaleTimeString()}
              </Text>
              <Text style={styles.time}>Total Duration: {totalDuration}</Text>
            </>
          )}
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.buttonContainer}>
            {!checkInTime && !checkOutTime && (
              <TouchableOpacity
                onPress={handleCheckIn}
                style={styles.checkInButton}
              >
                <Text style={styles.buttonText}>Check In</Text>
              </TouchableOpacity>
            )}
            {checkInTime && (
              <TouchableOpacity
                onPress={handleCheckOut}
                style={styles.checkOutButton}
              >
                <Text style={styles.buttonText}>Check Out</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#3f3f3f",
    paddingTop: 50,
  },
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
    color: "#333",
  },
  date: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  time: {
    fontSize: 16,
    color: "#555",
    marginVertical: 10,
  },
  error: {
    color: "red",
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  checkInButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  checkOutButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
