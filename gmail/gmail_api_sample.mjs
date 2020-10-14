import * as utils from "../utils";
import fs from "fs";
import readline from "readline";
import * as chrono from "chrono-node";
import googleapis from "googleapis";
const { google } = googleapis;
const fsPromises = fs.promises;

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// Access tokens and refresh tokens are stored here.
const TOKEN_PATH = "token.json";

export async function getPeopleWhoSent() { 
  try{
    const credentials = await fsPromises.readFile("credentials.json")
    // Authorize a client with credentials, then call the Gmail API.
    const authClient = await authorize(JSON.parse(credentials))
    const peopleSent = await getMessages(authClient);
    return peopleSent
  } 
  catch(err){
    if (err) return console.log("Error loading client secret file:", err);
  }
}

export async function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
return new Promise(async function(resolve,reject){
  try{
    const token = await fsPromises.readFile(TOKEN_PATH)
    oAuth2Client.setCredentials(JSON.parse(token));
    resolve(oAuth2Client);
  }
  catch(err){
    const oAuthClient = await getNewToken(oAuth2Client);
    resolve(oAuthClient)
  }

})

}

export async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
return new Promise(function(resolve,reject){
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      resolve(oAuth2Client)
      // callback(oAuth2Client);
    });
  });
})

}

export async function getMessages(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  return new Promise(function (resolve,reject){
    var peopleWhoSent = [];
    gmail.users.messages.list(
      {
        userId: "me",
        q: `subject: (daily report) after:${utils.getTodayDate()} before:${utils.getTomorrowDate()}`,
      },
      async (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        const messages = res.data.messages;
        if (messages && messages.length) {
          for (let message of messages) {
            const msg = await gmail.users.messages.get({
              userId: "me",
              id: message.id,
            });
            const { value: subject } = msg.data.payload.headers.find(
              (header) => header.name === "Subject"
            );
            const { value: from } = msg.data.payload.headers.find(
              (header) => header.name === "From"
            );
            const sentBy = from.split(" ")[0];
            const sentDate = chrono
              .parseDate(subject)
              .toISOString()
              .split("T")[0];
            if (sentDate === new Date().toISOString().split("T")[0]) {
              peopleWhoSent.push(sentBy)
            }
          }
          resolve(peopleWhoSent)
        } else {
          reject("No messages found.")
          console.log("No messages found.");
        }
      }
    );
  })
}
