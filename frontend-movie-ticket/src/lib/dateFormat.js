
const dateFormat = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short', // mon, tue..
    month: 'long',   // january, february...
    day: 'numeric',  // 1, 2,3
    hour:'numeric',  // 1-12
    minute: 'numeric' // 00-59
  })
}

export default dateFormat