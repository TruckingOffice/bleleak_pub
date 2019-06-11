/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react'
import {BleManager} from 'react-native-ble-plx'
import {StyleSheet, Text, View} from 'react-native'

const deviceName = 'Your-Device-Name'
const serviceUUID = 'Your-Service-UUID'
const characteristic1UUID = 'Your-Characteristic-UUID'
const characteristic2UUID = 'Your-Characteristic-UUID'
const characteristic3UUID = 'Your-Characteristic-UUID'

class BleReader extends Component {

  constructor(props) {
    super(props)
    console.log('app constructor')
    this.state = {}
  }

  componentWillMount() {
    this.manager = new BleManager()
    const subscription = this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.scanAndConnect()
        subscription.remove()
      }
    }, true)
  }

  async scanAndConnect(byService = null) {
    if (__DEV__) console.log('start scan')
    this.manager.startDeviceScan(null, null, async (error, device) => {
      console.log('Scanning...')
      if (device && device.name && (device.name.includes(deviceName))) {
        console.log(device.name)
        if (__DEV__) console.log('BLE found. connecting.')
        this.manager.stopDeviceScan()
        if (__DEV__) console.log('stop scan, clear timers ')
        device.connect()
          .then(async (device) => {
            if (__DEV__) console.log('Device = ' + device.id)
            if (__DEV__) console.log('Discovering services and bleChars')
            return (await device.discoverAllServicesAndCharacteristics())
          })
          .then((device) => {
            console.log('Setting notifications')
            setInterval(() => {
              console.log('interval loop')
              device.readCharacteristicForService(serviceUUID, characteristic1UUID)
                .then((res) => {
                  console.log(`char1 ${res.value}`)
                  this.setState({char1: res.value})
                })
              device.readCharacteristicForService(serviceUUID, characteristic2UUID)
                .then((res) => {
                  console.log(`char2 ${res.value}`)
                  this.setState({char2: res.value})
                })
              device.readCharacteristicForService(serviceUUID, characteristic3UUID)
                .then((res) => {
                  console.log(`char3 ${res.value}`)
                  this.setState({char3: res.value})
                })
            }, 500)
          })
      }
    })

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Ble Leak</Text>
        <Text style={styles.instructions}>Char1: {this.state.char1}</Text>
        <Text style={styles.instructions}>Char2: {this.state.char2}</Text>
        <Text style={styles.instructions}>Char3: {this.state.char3}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

export default BleReader