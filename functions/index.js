/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");

setGlobalOptions({ 
  maxInstances: 10 
});

const { onCall } = require("firebase-functions/v2/https")
const admin = require("firebase-admin")
const axios = require("axios");

admin.initializeApp();

exports.verifyDorm = onCall(
    {
        secrets: ["MELISSA_LICENSE_KEY"],
        region: "us-west2"
    },
    async (request) => {
        const { address } = request.data;
        const melissaKey = process.env.MELISSA_LICENSE_KEY

        console.log("Incoming address from frontend:", address);

        try {
      // Call Melissa Address Verification API
      const response = await axios.get(
        "https://personator.melissadata.net/v3/WEB/ContactVerify/doContactVerify",
        {
          params: {
            id: melissaKey,
            a1: address,
            city: "Irvine",
            state: "CA",
            zip: "92617",
            act: "Check,Geocode",
            cols: "GrpGeocode",
            opt: "CheckFreeForm:ON,DeliveryLines:ON",
            format: "json",
          },
        }
      );

      const record = response.data.Records[0];
      console.log("Full Melissa Record:", JSON.stringify(record));

      if (!record) throw new Error("Address not found")

      
        const lat = parseFloat(record.Latitude);
        const lng = parseFloat(record.Longitude);
        if (isNaN(lat) || isNaN(lng)) {
                console.error("Geocoding failed for this address.");
                throw new Error("Could not find coordinates for this dorm.");
        }

    const fullAddress = `${record.AddressLine1}, ${record.City}, ${record.State} ${record.PostalCode}`

      return {
        formattedAddress: fullAddress,
        lat: lat,
        lng: lng,
      };
    } catch (err) {
      console.error(err);
      throw new Error("Failed to verify dorm address");
    }
  }
);


exports.computeRoute = onCall(
    {
        secrets: ["GOOGLE_ROUTES_KEY"],
        region: 'us-west2'
    },

    async (request) => {
        console.log('hello')
        
        const { origin, destination } = request.data;
        const apiKey = process.env.GOOGLE_ROUTES_KEY

        console.log("API Key present:", !!apiKey);

        try {
            const response = await axios.post(
                "https://routes.googleapis.com/directions/v2:computeRoutes",
                {
                    origin: {
                        location: { // <--- Google MANDATES this nest
                            latLng: { // <--- Google MANDATES this nest
                                latitude: origin.latitude, 
                                longitude: origin.longitude 
                            }
                        }
                    },
                    destination: {
                        location: {
                            latLng: { 
                                latitude: destination.latitude, 
                                longitude: destination.longitude 
                            }
                        }
                    },
                    travelMode: "WALK", // Routes API uses WALK instead of walking
                    routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
                    computeAlternativeRoutes: false,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": apiKey,
                        // This Field Mask is MANDATORY for the Routes API
                        "X-Goog-FieldMask": "*"
                    }
                }
            );

            const route = response.data.routes[0];
            console.log(route)
            if (!route) {
                throw new Error("No route found");
            }

            return {
                // Convert meters to miles or leave as meters
                distance: (route.distanceMeters * 0.000621371).toFixed(2) + " mi", 
                // Convert "300s" string to minutes
                duration: Math.round(parseInt(route.duration) / 60) + " mins",
                polyline: route.polyline.encodedPolyline
            };
        } catch (err) {
            if (err.response) {
                console.error("Google API Rejection:", JSON.stringify(err.response.data));
            } else {
                console.error("Function Crash Error:", err.message);
            }
            throw new Error("Internal Route Error: " + err.message);
        }
    }
);