module.exports = {
    formatDate: function (date) {
                let month = date.getMonth() + 1;
                month = month < 10 ? "0" + month : month;
                let day = date.getDate();
                day = day < 10 ? "0" + day : day
                return `${date.getFullYear()}-${month}-${day}`;
    }
}