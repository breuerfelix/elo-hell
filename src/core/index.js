function formatDate(date) {
    date = new Date(date);
    const day = date.getDate();
    const monthIndex = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return day + ' / ' + monthIndex + ' / ' + year;
  }

  export {
      formatDate,
  };
