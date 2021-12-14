'use strict';

const IotCentral = require('azure-iotcentral-device-client');

//expected device ID
const deviceId = 'a2iot-td-04';

// Get IoT Central APP Credentials
const scopeId = '';
const sasMasterKey = '';
const urn = '';

module.exports = async function (deviceId) {
  return new Promise(async function (resolve, reject) {
    try {
      // Delete existing device entry
      //await DeleteDevice(deviceId);

      const iotc = new IotCentral.IoTCClient(deviceId, scopeId, 'symm_key', sasMasterKey);
      iotc.setModelId(urn);

      await iotc.register()
        .then(async function (iothubConnectionString) {
          //console.log("IotHub Connection String: " + iothubConnectionString);
          if (iothubConnectionString) {
            var deviceCredentials = {
              uri: iothubConnectionString.split(";")[0].replace("HostName=", ""),
              deviceId: iothubConnectionString.split(";")[1].replace("DeviceId=", ""),
              primaryKey: iothubConnectionString.split(";")[2].replace("SharedAccessKey=", ""),
              secondaryKey: iothubConnectionString.split(";")[2].replace("SharedAccessKey=", ""),
              connString: iothubConnectionString
            };
            resolve({
              cloudType: "azure",
              azure: deviceCredentials
            });
          } else {
            console.log("Failed to get device connection string.");
            reject("Failed to get device connection string.");
          }
        })
        .catch(async function (err) {
          console.log("Failed to register device to IoT Central: " + err);
          reject("Failed to register device to IoT Central: " + err);
        });
    } catch (e) {
      console.log("Exception, failed to create device in IoT Central: " + e);
      reject("Exception, failed to create device in IoT Central: " + e);
    }
  });
}

function main() {
  module.exports(deviceId)
    .then(async function (res) {
      console.log("Device Created, key: " + JSON.stringify(res))
    })
    .catch(async function (rej) {
      console.log("Error Creating device: " + rej)
    });
}

main()