var shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var longDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var longMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function DateWrapper(date) {
    this.date = date;
    this.dayOfWeek = date.getDay();
    this.day = date.getDate();
    this.year = date.getFullYear();
    this.month = date.getMonth();
}

DateWrapper.prototype = {
    getShortDayName: function() {
        return shortDayNames[this.dayOfWeek];
    },

    getLongDayName: function() {
        return longDayNames[this.dayOfWeek];
    },

    getShortMonthName: function() {
        return shortMonthNames[this.month];
    },

    getLongMonthName: function() {
        return longMonthNames[this.month];
    },

    getDaySuffix: function() {
        var day = this.day;
        if (day === 1 || day === 21 || day === 31) {
            return 'st';
        }
        else if (day === 2 || day === 22) {
            return 'nd';
        }
        else if (day === 3 || day === 23) {
            return 'rd';
        }
        else {
            return 'th'
        }
    },

    getYear: function() {
        return this.year;
    },

    getTime: function() {
        return this.date.getTime();
    },

    getMonth: function() {
        return this.month + 1;
    },

    getDay: function() {
        return this.day;
    }
}

exports.wrapDate = function(date) {
    return new DateWrapper(date);
}

exports.sortPostsNewestFirst = function(posts) {
    posts.sort(function(a, b) {
        var a = a.date.getTime();
        var b = b.date.getTime();
        return a - b;
    });
    return posts;
}
