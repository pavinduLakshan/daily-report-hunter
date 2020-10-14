## How it works

1. Search every midnight for emails received in the day whose title contains "daily report - {date}"
2. Filter daily reports that are relevant for the day.
3. Prepare an email mentioning people who have sent daily reports for that day
4. Send the email.

## Technologies

- Node.js, node-cron - for running cron job every day midnight
- Heroku - for hosting the backend  
- Sendgrid - for sending the email
- Gmail API - for searching for the emails (daily reports)

## Roadmap

1. Omit people who have requested a leave on that day
2. Mention people who haven't logged the time properly
3. Mention people who haven't worked enough no. of hours