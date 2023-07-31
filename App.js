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
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
// const BATTERY_SERVICE_UUID = '180F'; // UUID for the Battery Service


const App = () => {
  const peripherals = new Map();
  const [availableDevices, setAvailableDevices] = useState(peripherals);
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
        console.log(peripherals);
        BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (p) => console.log(p));

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
 
  }, []);
  // useEffect(() => {
    // const handlerDiscover = BleManagerEmitter.addListener(
    //   'BleManagerDiscoverPeripheral',
    //   () => {
    //     (peripheral) => {
    //       if (peripheral.name) {
    //         setAvailableDevices(p => ({ ...p, id: peripheral.id, name: peripheral.name }));
    //       }
    //       console.log(availableDevices);
    //     };
    //   }
    // );
  //   const handlerStop = BleManagerEmitter.addListener(
  //     'BleManagerStopScan',
  //     () => console.log("scaning Over")
  //   );

  //   return () => {
  //     handlerStop.remove();
  //     handlerDiscover.remove();
  //   }
  // }, [])

  const startScan = () => {
    peripherals.clear(); // Clear the previous scanned devices
    setBluetoothDevices([]); // Reset the list of Bluetooth devices

    console.log('scanning began');
    if (!isScanning) {
      BleManager.scan([], 15, false)
        .then(() => {
          setIsScanning(true);
         handleDiscoverPeripheral();

        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleDiscoverPeripheral = peripheral=> {
    if(peripheral?.name && peripheral?.id){

      let peripheralSortName = peripheral?.name?.substring(0,7);
      console.log(peripheralSortName);

      peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
        setRandom(Date.now());
        if (peripheralSortName == SVGStringList.CAP_HD){
          setPeripheralName(peripheral?.name);
          setSelectedPeripheral(peripheral);
          BleManagerStopScan();
        }
        else if (peripheralSortName == SVGStringList.FSR_HD){
          setPeripheralName(peripheral?.name);
          setSelectedPeripheral(peripheral);
          BleManagerStopScan();
        }
        else if (peripheralSortName == SVGStringList.STG_HD){
          setPeripheralName(peripheral?.name);
          setSelectedPeripheral(peripheral);
          BleManagerStopScan();
        }
        else (peripheralSortName === 'noise pro 3 Assist')
        {
          setPeripheralName(peripheral?.name);
          setSelectedPeripheral(peripheral);
          BleManagerStopScan();
        }
        console.log('------peripheral-->>>', peripheral?.name);
    }
  };
    

  const handleGetConnectedDevices = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
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
  
  // render list of bluetooth devices
  const RenderItem = ({ peripheral }) => {
    const color = peripheral.connected ? 'green' : '#fff';
    return(
      <>
      {console.log(availableDevices)}
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
            onPress={startScan}>
            <Text style={styles.buttonTextStyle}>
              {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* list of scanned bluetooth devices */}
        {bluetoothDevices.map(devices => (                    //device -> devices
          <View key={devices.id}>
            <RenderItem peripheral={devices} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
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




// import React, { useState, useEffect } from 'react';
// import {
//   Text,
//   View,
//   Platform,
//   StatusBar,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   NativeModules,
//   useColorScheme,
//   TouchableOpacity,
//   NativeEventEmitter,
//   PermissionsAndroid,
// } from 'react-native';
// import BleManager from 'react-native-ble-manager';
// import { Colors } from 'react-native/Libraries/NewAppScreen';

// const BleManagerModule = NativeModules.BleManager;
// const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// const App = () => {
//   const peripherals = new Map();
//   const [isScanning, setIsScanning] = useState(false);
//   const [connected, setConnected] = useState(false);
//   const [bluetoothDevices, setBluetoothDevices] = useState([]);

//   useEffect(() => {
//     BleManager.start({ showAlert: false }).then(() => {
//       console.log('BLE Manager initialized');
//     });

//     BleManager.enableBluetooth().then(() => {
//       console.log('Bluetooth is turned on!');
//     });

//     let stopListener = BleManagerEmitter.addListener('BleManagerStopScan', () => {
//       setIsScanning(false);
//       console.log('Scan is stopped');
//     });

//     if (Platform.OS === 'android' && Platform.Version >= 23) {
//       PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT).then(result => {
//         if (!result) {
//           PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT).then(result => {
//             if (result) {
//               console.log('User accepted Bluetooth permission.');
//             } else {
//               console.log('User refused Bluetooth permission.');
//             }
//           });
//         }
//       });
//     }

//     return () => {
//       stopListener.remove();
//     };
//   }, []);

//   const startScan = () => {
//     peripherals.clear();
//     setBluetoothDevices([]);
//     console.log('Scanning began');
//     if (!isScanning) {
//       BleManager.scan([], 30, false)
//         .then(() => {
//           setIsScanning(true);
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }
//   };

//   const handleDiscoverPeripheral = peripheral => {
//     if (peripheral?.name && peripheral?.id) {
//       let peripheralSortName = peripheral?.name?.substring(0, 7);

//       peripherals.set(peripheral.id, peripheral);
//       setBluetoothDevices(Array.from(peripherals.values()));

//       // if (peripheralSortName === 'CAP_HD' || peripheralSortName === 'FSR_HD' || peripheralSortName === 'STG_HD' || peripheralSortName === 'noise p') {
//       //   // Perform actions for specific device names
//       //   console.log('Peripheral of interest found:', peripheral?.name);
//       //   BleManager.stopScan();
//       // }
//     }
//   };

//   const handleGetConnectedDevices = () => {
//     BleManager.getConnectedPeripherals([]).then(results => {
//       if (results.length === 0) {
//         console.log('No connected Bluetooth devices');
//       } else {
//         for (let i = 0; i < results.length; i++) {
//           let peripheral = results[i];
//           peripheral.connected = true;
//           peripherals.set(peripheral.id, peripheral);
//           setConnected(true);
//           setBluetoothDevices(Array.from(peripherals.values()));
//           console.log('Connected device:', peripheral.name);
//         }
//       }
//     });
//   };

//   const connectToPeripheral = peripheral => {
//     if (peripheral.connected) {
//       BleManager.disconnect(peripheral.id).then(() => {
//         peripheral.connected = false;
//         setConnected(false);
//         alert(`Disconnected from ${peripheral.name}`);
//       });
//     } else {
//       BleManager.connect(peripheral.id)
//         .then(() => {
//           let peripheralResponse = peripherals.get(peripheral.id);
//           if (peripheralResponse) {
//             peripheralResponse.connected = true;
//             peripherals.set(peripheral.id, peripheralResponse);
//             setConnected(true);
//             setBluetoothDevices(Array.from(peripherals.values()));
//           }
//           alert('Connected to ' + peripheral.name);
//         })
//         .catch(error => console.log(error));
//       /* Read current RSSI value */
//       setTimeout(() => {
//         BleManager.retrieveServices(peripheral.id).then(peripheralData => {
//           console.log('Peripheral services:', peripheralData);
//         });
//       }, 900);
//     }
//   };

//   const isDarkMode = useColorScheme() === 'dark';
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   const RenderItem = ({ peripheral }) => {
//     const color = peripheral.connected ? 'green' : '#fff';
//     return (
//       <>
//         <Text
//           style={{
//             fontSize: 20,
//             marginLeft: 10,
//             marginBottom: 5,
//             color: isDarkMode ? Colors.white : Colors.black,
//           }}>
//           Nearby Devices:
//         </Text>
//         <TouchableOpacity onPress={() => connectToPeripheral(peripheral)}>
//           <View
//             style={{
//               backgroundColor: color,
//               borderRadius: 5,
//               paddingVertical: 5,
//               marginHorizontal: 10,
//               paddingHorizontal: 10,
//             }}>
//             <Text
//               style={{
//                 fontSize: 18,
//                 textTransform: 'capitalize',
//                 color: peripheral.connected ? Colors.white : Colors.black,
//               }}>
//               {peripheral.name}
//             </Text>
//             <View
//               style={{
//                 backgroundColor: color,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: peripheral.connected ? Colors.white : Colors.black,
//                 }}>
//                 RSSI: {peripheral.rssi}
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: peripheral.connected ? Colors.white : Colors.black,
//                 }}>
//                 ID: {peripheral.id}
//               </Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </>
//     );
//   };

//   return (
//     <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         style={backgroundStyle}
//         contentContainerStyle={styles.mainBody}
//         contentInsetAdjustmentBehavior="automatic">
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//             marginBottom: 40,
//           }}>
//           <View>
//             <Text
//               style={{
//                 fontSize: 30,
//                 textAlign: 'center',
//                 color: isDarkMode ? Colors.white : Colors.black,
//               }}>
//               React Native BLE Manager
//             </Text>
//           </View>
//           <TouchableOpacity
//             activeOpacity={1.5}
//             style={styles.buttonStyle}
//             onPress={startScan}>
//             <Text style={styles.buttonTextStyle}>
//               {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//         {bluetoothDevices.map(peripheral => (
//           <View key={peripheral.id}>
//             <RenderItem peripheral={peripheral} />
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const windowHeight = Dimensions.get('window').height;
// const styles = StyleSheet.create({
//   mainBody: {
//     flex: 1,
//     justifyContent: 'center',
//     height: windowHeight,
//   },
//   buttonStyle: {
//     backgroundColor: '#307ecc',
//     borderWidth: 0,
//     color: '#FFFFFF',
//     borderColor: '#307ecc',
//     height: 40,
//     alignItems: 'center',
//     borderRadius: 30,
//     marginLeft: 35,
//     marginRight: 35,
//     marginTop: 15,
//   },
//   buttonTextStyle: {
//     color: '#FFFFFF',
//     paddingVertical: 10,
//     fontSize: 16,
//   },
// });

// export default App;
