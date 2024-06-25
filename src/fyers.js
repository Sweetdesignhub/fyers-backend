// // Import required modules
// const { fyersModel } = require("fyers-api-v3");
// const fs = require("fs");

// // Create the logs directory if it doesn't exist
// const logsDir = './logs';
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// // Create a new instance of fyersModel with logging enabled
// const fyers = new fyersModel({ "path": logsDir, "enableLogging": true });

// // Set your APPID obtained from Fyers
// const APPID = "710RYAUI5Z-100";
// fyers.setAppId(APPID);

// // Set the RedirectURL where the authorization code will be sent after the user grants access
// const redirectUrl = "https://stockgenius.ai/";
// fyers.setRedirectUrl(redirectUrl);

// // Generate the URL to initiate the OAuth2 authentication process and get the authorization code
// const generateAuthcodeURL = fyers.generateAuthCode();

// // Log the generated URL
// console.log('Generated auth code URL: ', generateAuthcodeURL);

// // Function to generate access token using the authorization code
// async function generateAccessToken(authCode) {
//   try {
//     const response = await fyers.generate_access_token({
//       "client_id": APPID,
//       "secret_key": "JV4OW75KGT",
//       "auth_code": authCode
//     });

//     if (response.s === 'ok') {
//     //   fyers.setAccessToken(response.access_token);
//       fyers.setAccessToken('yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MTkzMDY0MzYsImV4cCI6MTcxOTM2MTgxNiwibmJmIjoxNzE5MzA2NDM2LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbWVvakVVbmw0TE52czk2UnFKT2ZQRW13SXVHTzFmdzJRSkdpMDJkM1RhVG1TMTJRS01peS1rcXRELUVENWt1aFhQbThocUQ2XzBGb3VRTVY0NDF6X2lwMGswaDZvSlBHcWFlZGxoaVdWbEs4UjR1MD0iLCJkaXNwbGF5X25hbWUiOiJBU1dJTkkgR0FKSkFMQSIsIm9tcyI6IksxIiwiaHNtX2tleSI6ImQ5NWQ0MTZmNDc2ZmFiZmUzNzVjMDFiOTA3ZTIwMjc2OTEwNTJiNzZhZmI5OTQ0ZjIwMjA1ZjJlIiwiZnlfaWQiOiJZQTE0MjIxIiwiYXBwVHlwZSI6MTAwLCJwb2FfZmxhZyI6Ik4ifQ.BWzKwLLxG6d5C6Gr3t8BH350RbsJeeHwbadD15C7Ilc');
//     //   console.log("Access token set successfully.");
//     //   console.log("Access Token:", response.access_token);  // Print the access token

//       // Now you can make authenticated API calls
//       await fetchProfileDetails();
//       await fetchFunds();
//       await fetchHoldings();
//     } else {
//       console.log("Error generating access token:", response);
//     }
//   } catch (error) {
//     console.error("An error occurred while generating the access token:", error);
//   }
// }

// // Function to fetch profile details
// async function fetchProfileDetails() {
//   try {
//     const response = await fyers.get_profile();
//     console.log("Profile Details:", response);
//   } catch (error) {
//     console.error("An error occurred while fetching profile details:", error);
//   }
// }

// // Function to fetch funds
// async function fetchFunds() {
//   try {
//     const response = await fyers.get_funds();
//     console.log("Funds Details:", response);
//   } catch (error) {
//     console.error("An error occurred while fetching funds details:", error);
//   }
// }

// // Function to fetch holdings
// async function fetchHoldings() {
//   try {
//     const response = await fyers.get_holdings();
//     console.log("Holdings Details:", response);
//   } catch (error) {
//     console.error("An error occurred while fetching holdings details:", error);
//   }
// }

// // Replace with the actual auth code you receive after user authorization
// const authCode = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkubG9naW4uZnllcnMuaW4iLCJpYXQiOjE3MTkzMDY0MDYsImV4cCI6MTcxOTMzNjQwNiwibmJmIjoxNzE5MzA1ODA2LCJhdWQiOiJbXCJ4OjBcIiwgXCJ4OjFcIiwgXCJ4OjJcIiwgXCJkOjFcIiwgXCJkOjJcIiwgXCJ4OjFcIiwgXCJ4OjBcIl0iLCJzdWIiOiJhdXRoX2NvZGUiLCJkaXNwbGF5X25hbWUiOiJZQTE0MjIxIiwib21zIjoiSzEiLCJoc21fa2V5IjoiZDk1ZDQxNmY0NzZmYWJmZTM3NWMwMWI5MDdlMjAyNzY5MTA1MmI3NmFmYjk5NDRmMjAyMDVmMmUiLCJub25jZSI6IiIsImFwcF9pZCI6IjcxMFJZQVVJNVoiLCJ1dWlkIjoiN2Y5NGZiM2MzNGM0NDUyYjkyNGFjYTZhMWIyZGFiMjAiLCJpcEFkZHIiOiIwLjAuMC4wIiwic2NvcGUiOiIifQ.v_XeWcnHEKIXyZzDMl27cZDKTrareZ9Ol6GUmMdCiIE";
// // Generate access token using the authorization code
// generateAccessToken(authCode);


const FyersAPI = require("fyers-api-v3").fyersModel

var fyers = new FyersAPI()
fyers.setAppId("710RYAUI5Z-100")
fyers.setRedirectUrl("https://stockgenius.ai/")
fyers.setAccessToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MTkzMDY0MzYsImV4cCI6MTcxOTM2MTgxNiwibmJmIjoxNzE5MzA2NDM2LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbWVvakVVbmw0TE52czk2UnFKT2ZQRW13SXVHTzFmdzJRSkdpMDJkM1RhVG1TMTJRS01peS1rcXRELUVENWt1aFhQbThocUQ2XzBGb3VRTVY0NDF6X2lwMGswaDZvSlBHcWFlZGxoaVdWbEs4UjR1MD0iLCJkaXNwbGF5X25hbWUiOiJBU1dJTkkgR0FKSkFMQSIsIm9tcyI6IksxIiwiaHNtX2tleSI6ImQ5NWQ0MTZmNDc2ZmFiZmUzNzVjMDFiOTA3ZTIwMjc2OTEwNTJiNzZhZmI5OTQ0ZjIwMjA1ZjJlIiwiZnlfaWQiOiJZQTE0MjIxIiwiYXBwVHlwZSI6MTAwLCJwb2FfZmxhZyI6Ik4ifQ.BWzKwLLxG6d5C6Gr3t8BH350RbsJeeHwbadD15C7Ilc")

fyers.get_profile().then((response)=>{
      console.log(response)
  }).catch((error)=>{
      console.log(error)
  })