export function formatTime(initTime, endTime) {
    const format = (time) => {
      const [hour, minute] = time.split(':');
      let period = 'am';
      let hourNum = parseInt(hour, 10);
      if (hourNum >= 12) {
        period = 'pm';
        if (hourNum > 12) hourNum -= 12;
      }
      if (hourNum === 0) hourNum = 12;
      return `${hourNum}:${minute} ${period}`;
    };
  
    return `${format(initTime)} - ${format(endTime)}`;
  }
  