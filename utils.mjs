// names is an array
export function formatDailyReport(names){
  if(names && names.length > 0) return `
    <!DOCTYPE html>
    <html>
      <body>
      <p>Hey all, Hope all are doing great !!!</p>

      <p>The following people have <b>sent the daily report for yesterday on time </b> 🥳. Thank you very much for your effort and time. </p>
      <ul>
      ${names.map(name => {
        if (name !== "chameera")`<li>${name}</li>`
      }).join('')}
      </ul>
      
      <p> Let's all continue sending daily reports in the relevant
      day itself 😁.</p>
      Thank you !
      <p>--</p>
      Best regards,<br />
      <p>
      The Daily Report Hunter <br />
      </p>
      </body>
    </html>
    `
}

export function getTomorrowDate(){
  let date = new Date();
  date.setDate(date.getDate() + 1);
  const nextDate = date.toISOString().split('T')[0].replace(/-/g,"/")
  return nextDate;
}

export function getTodayDate(){
  let date = new Date();
  return date.toISOString().split('T')[0].replace(/-/g,"/")
}

