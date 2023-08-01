import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Platform,
  StatusBar,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
// const BATTERY_SERVICE_UUID = '180F'; // UUID for the Battery Service


const App = () => {
  const peripherals = new Map();
  const [availableDevices, setAvailableDevices] = useState([]);
  const [display, setDisplay] = useState("none");
  const [isScanning, setIsScanning] = useState(false);      //changes
  const [connected, setConnected] = useState(false);
  const [bluetoothDevices, setBluetoothDevices] = useState([]);

  // console.log("asdasdasdasdasasdasdasdasdasasdasdasdasdas", BleManagerEmitter);
  useEffect(() => {
    // start bluetooth manager
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BLE Manager initialized');
    });
    // turn on bluetooth if it is not on
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    let stopListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        // console.log(handlerDiscover)
        setIsScanning(false);
        console.log('Scan is stopped');
        // console.log(peripherals);
        BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (p) => setAvailableDevices(i => [...i, p]));

        handleGetConnectedDevices();
        handleDiscoverPeripheral();
      },
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,

      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,

          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }
    return () => {
      stopListener.remove();
    };

  }, []);                                         // {...}  [{...}, {...}, {...}]


  // useEffect(() => {
  //   console.log(availableDevices.filter(item => item.name !== null))
  //   console.log("asdasd")
  // }, [availableDevices]);

  const startScan = () => {
    peripherals.clear(); // Clear the previous scanned devices
    setBluetoothDevices([]); // Reset the list of Bluetooth devices

    console.log('scanning began');
    if (!isScanning) {
      BleManager.scan([], 20, false)
        .then(() => {
          setIsScanning(true);
          handleDiscoverPeripheral();

        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleDiscoverPeripheral = peripheral => {
    if (peripheral?.name && peripheral?.id) {

      let peripheralSortName = peripheral?.name?.substring(0, 7);
      console.log(peripheralSortName);

      peripherals.set(peripheral.id, peripheral);
      setBluetoothDevices(Array.from(peripherals.values()));
      //setList(Array.from(peripherals.values()));
      setRandom(Date.now());
      if (peripheralSortName == SVGStringList.CAP_HD) {
        setPeripheralName(peripheral?.name);
        setSelectedPeripheral(peripheral);
        BleManager.stopScan();
      }
      else if (peripheralSortName == SVGStringList.FSR_HD) {
        setPeripheralName(peripheral?.name);
        setSelectedPeripheral(peripheral);
        BleManager.stopScan();
      }
      else if (peripheralSortName == SVGStringList.STG_HD) {
        setPeripheralName(peripheral?.name);
        setSelectedPeripheral(peripheral);
        BleManager.stopScan();
      }
      else if (peripheralSortName === "SMP_FSR_SOL_3370") {
        setPeripheralName(peripheral?.name);
        setSelectedPeripheral(peripheral);
        BleManager.stopScan();
      }
      console.log('------peripheral-->>>', peripheral?.name);
    }
  };


  const handleGetConnectedDevices = () => {
    BleManager.getConnectedPeripherals([]).then(results => {             // results --->  peripheral
      if (results.length == 0) {
        console.log('No connected bluetooth devices');
      } else {
        for (let i = 0; i < results.length; i++) {
          let peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          setConnected(true);
          setBluetoothDevices(Array.from(peripherals.values()));
          console.log("results");
        }
      }
    });
  };
  const connectToPeripheral = peripheral => {
    if (peripheral.connected) {
      BleManager.disconnect(peripheral.id).then(() => {
        peripheral.connected = false;
        setConnected(false);
        alert(`Disconnected from ${peripheral.name}`);
      });
    } else {
      BleManager.connect(peripheral.id)
        .then(() => {
          let peripheralResponse = peripherals.get(peripheral.id);
          if (peripheralResponse) {
            peripheralResponse.connected = true;
            peripherals.set(peripheral.id, peripheralResponse);
            setConnected(true);
            setBluetoothDevices(Array.from(peripherals.values()));
          }
          alert('Connected to ' + peripheral.name);
        })
        .catch(error => console.log(error));
      /* Read current RSSI value */
      setTimeout(() => {
        BleManager.retrieveServices(peripheral.id).then(peripheralData => {
          console.log('Peripheral services:', peripheralData);
        });
      }, 900);
    }
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };



  return (
    <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle}
        contentContainerStyle={styles.mainBody}
        contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
            marginBottom: 40,
          }}>
          <View>
            <Text
              style={{
                fontSize: 30,
                textAlign: 'center',
                color: isDarkMode ? Colors.white : Colors.black,
              }}>
              React Native BLE Manager
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={1.5}
            style={styles.buttonStyle}
            onPress={() => {
              startScan();
            }}>
            <Text style={styles.buttonTextStyle}>
              {isScanning ? "Scanning..." : 'Scan Bluetooth Devices'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* list of scanned bluetooth devices */}
      </ScrollView>
      <FlatList
        data={availableDevices.filter(item => item.name !== null).reduce((acc, curr) => {
          if(!acc.find(item => item.id === curr.id)) acc.push(curr);
          return acc;
        }, [])}
        renderItem={({ item }) => (
          <View
            style={
              {
                alignSelf: "center",
                display: "inline-block",
                paddingHorizontal: 25,
                paddingVertical: 15,
                backgroundColor: 'white',
                elevation: 5,
                borderRadius: 10,
                marginBottom: 10
              }
            }
          >
            <Text>
              {item.name}
            </Text>
          </View>
        )}
        keyExtractor={(item) => Math.random()}
      />

    </SafeAreaView>
  ); px
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default App;
