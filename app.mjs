import dotenv from 'dotenv'
dotenv.config()
import cron from 'node-cron'
import * as utils from './utils.mjs'
import * as gmailUtils from './gmail/gmail_api_sample.mjs'
import sendgrid from '@sendgrid/mail'

/*
 * Runs per 30 minutes between 8pm - 1am on every weekday
 */
cron.schedule('*/30 20-23,0-1 * * 1,2,3,4,5', () => {
  console.log("Keeping the app alive...")
});

/* 
 * Runs at 11:58pm on every weekday
 */
cron.schedule('58 23 * * 1,2,3,4,5', () => {
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