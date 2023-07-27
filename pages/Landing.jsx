import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView, Dimensions } from "react-native"
import BleManager from 'react-native-ble-manager';


  // const connectToPeripheral = peripheral => {
  //   if (peripheral.connected) {
  //     BleManager.disconnect(peripheral.id).then(() => {
  //       peripheral.connected = false;
  //       setConnected(false);
  //       alert(`Disconnected from ${peripheral.name}`);
  //     });
  //   } else {
  //     BleManager.connect(peripheral.id)
  //       .then(() => {
  //         let peripheralResponse = peripherals.get(peripheral.id);
  //         if (peripheralResponse) {
  //           peripheralResponse.connected = true;
  //           peripherals.set(peripheral.id, peripheralResponse);
  //           setConnected(true);
  //           setBluetoothDevices(Array.from(peripherals.values()));
  //         }
  //         alert('Connected to ' + peripheral.name);
  //       })
  //       .catch(error => console.log(error));
  //     /* Read current RSSI value */
  //     setTimeout(() => {
  //       BleManager.retrieveServices(peripheral.id).then(peripheralData => {
  //         console.log('Peripheral services:', peripheralData);
  //       });
  //     }, 900);
  //   }
  // };
  const RenderItem = ({ peripheral }) => {
    const color = peripheral.connected ? 'green' : '#fff';
    return (
      <>
        <Text
          style={{
            fontSize: 20,
            marginLeft: 10,
            marginBottom: 5,
            color: isDarkMode ? Colors.white : Colors.black,
          }}>
          Nearby Devices:
        </Text>
        <TouchableOpacity onPress={() => connectToPeripheral(peripheral)}>
          <View
            style={{
              backgroundColor: color,
              borderRadius: 5,
              paddingVertical: 5,
              marginHorizontal: 10,
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                textTransform: 'capitalize',
                color: connected ? Colors.white : Colors.black,
              }}>
              {peripheral.name}
            </Text>
            <View
              style={{
                backgroundColor: color,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: connected ? Colors.white : Colors.black,
                }}>
                RSSI: {peripheral.rssi}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: connected ? Colors.white : Colors.black,
                }}>
                ID: {peripheral.id}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };


export const Landing = () => {
  const [bluetoothDevices, setBluetoothDevices] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setdevices] = useState([]);

  useEffect(() => {

    BleManager.start({ showAlert: false });
    console.log("Module initialized");
  }, []);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 10, false)
        .then(results => {
          console.log('Scanning...');
          setIsScanning(true);
          const discoveredDevices = results.map((result) => ({
            id: result.id,
            name: result.name || 'Unknown Device',
          }));
          setBluetoothDevices(discoveredDevices);
          console.log(results, "resultsssssssss");
        })
        .catch(err => {
          console.error(err);
        });
      console.log('The bluetooth is already enabled or the user confirm');
    }
    // navigation.navigate('homeScreen', { position: position });
  };
  return (
    <SafeAreaView style={[styles.main]}>
      <ScrollView>
        <View style={styles.main}>
          <Text style={styles.welcomeText}>
            Welcome to the Bluetooth Chat App

          </Text>
          <TouchableOpacity
           activeOpacity={0.5}
            style={styles.buttonStyle}
             onPress={startScan}>
            <Text style={styles.buttonTextStyle}> {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'} </Text>
          </TouchableOpacity>
        </View>
        {/* list of scanned bluetooth devices */}
        {bluetoothDevices && bluetoothDevices?.map(device => (
          <View key={device.id}>
            <RenderItem peripheral={device} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};


//const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  main: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#0082FC",
    height: "100%",
    paddingTop: "10%"
  },
  welcomeText: {
    color: "white",
    fontSize: 40,
    textAlign: "center",
    fontFamily: "Baloo2-Bold"
  },
  buttonStyle: {
    backgroundColor: 'white',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 50,
    alignItems: 'center',
    borderRadius: 50,
    marginLeft: 45,
    marginRight: 45,
    marginTop: 25,
  },
  buttonTextStyle: {
    color: "#0082FC",
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Baloo2-medium",
  },
})