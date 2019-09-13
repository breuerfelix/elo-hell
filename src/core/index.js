function formatDate(date) {
    date = new Date(date);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return day + ' / ' + monthIndex + ' / ' + year;
  }

  export {
      formatDate,
  };