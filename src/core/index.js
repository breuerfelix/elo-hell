function formatDate(date) {
    const formatedDate = new Date(date);
    const day = formatedDate.getDate();
    const monthIndex = formatedDate.getMonth() + 1;
    const year = formatedDate.getFullYear();

    return `${day} / ${monthIndex} / ${year}`;
}

function tryParseInt(str, defaultValue = null) {
    if (str == null) return defaultValue;
    if (str.length < 1) return defaultValue;
    if (isNaN(str)) return defaultValue;

    return parseInt(str);
}

export {
    formatDate,
    tryParseInt,
};
