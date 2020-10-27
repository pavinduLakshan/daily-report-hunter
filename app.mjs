import dotenv from 'dotenv'
dotenv.config()
import cron from 'node-cron'
import * as utils from './utils.mjs'
import http from 'http'
import * as gmailUtils from './gmail/gmail_api_sample.mjs'
import sendgrid from '@sendgrid/mail'

/* 
 * Runs at 11:58pm (1825h USA time) on every weekday
 */
cron.schedule('25 18 * * 1,2,3,4,5', () => {
  sendEmail()
});

async function sendEmail(){
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const peopleWhoSent = await gmailUtils.getPeopleWhoSent()
    const content = utils.formatDailyReport(peopleWhoSent)
    const msg = {
        to: process.env.TO_ADDR,
        from: process.env.FROM_ADDR, 
        subject: `Update on daily reports - ${new Date().toISOString().split('T')[0]}`,
        html: content,
      };

    sendgrid.send(msg)
     .then(() => {
        console.log("sent")
     }).catch(
        error => {
            console.error(error);
            if (error.response) {
              console.error(error.response.body)
            }
        }
     )
}

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!');
}

const server = http.createServer(requestListener);
server.listen(8080);