import 'react-native-url-polyfill/auto'
import { Jellyfin } from '@jellyfin/sdk'
import { getDeviceNameSync, getUniqueIdSync } from 'react-native-device-info'

const info = {
  clientInfo: {
    name: 'Jellyfish',
    version: '0.1.0',
  },
  deviceInfo: {
    name: getDeviceNameSync(),
    id: getUniqueIdSync(),
  },
}

export const jellyfin = new Jellyfin(info)
