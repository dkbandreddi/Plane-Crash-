const axios = require("axios");

module.exports.getAddressMapQuestAPI = (address) => {
  return new Promise((resolve, reject) => {
    let url = "http://open.mapquestapi.com/geocoding/v1/address";
    let key = "f38yT45d6AtUYlLtitjAiHBWRi4pA0Vu";
    let geoData = axios
      .get(url + "?key=" + key + "&location=" + address)
      .then((res) => {
        let lat = res.data.results[0].locations[0].latLng.lat;
        let lng = res.data.results[0].locations[0].latLng.lng;
        return [lat, lng, "MapQuest"];
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    if (geoData != null) {
      resolve(geoData);
    } else {
      reject("Geographical coordinates were not found");
    }
  });
};
