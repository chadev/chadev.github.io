function autolink(text) {
    // http://jsfiddle.net/kachibito/hEgvc/1/light/
    return text.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,"<a href='$1'>$1</a>");
}

function formatTime(date) {
    var
    output  =   [];
    output.push((date.getHours() % 12) || 12);
    output.push(':');
    output.push(('0' + date.getMinutes()).slice(-2));
    output.push(date.getHours() > 11 ? ' p.m.' : ' a.m.');
    return output.join('');
}
function displayEvents(data) {
    var
    events  =   [],
    today   =   Date.now(),
    items    =   data.result.items,
    j       =   items.length;
    while(j--) {
        var
        obj     =   {};
        obj.title   =   items[j].summary.replace('/', '/<wbr>');
        obj.content =   autolink(items[j].description);
        obj.start   =   new Date((items[j].start.dateTime) ? items[j].start.dateTime : items[j].start.date);
        obj.month   =   months[obj.start.getMonth()];
        obj.date    =   obj.start.getDate();
        obj.day     =   days[obj.start.getDay()]
        obj.time    =   formatTime(obj.start);
        try {
            obj.address =   items[j].location.replace(', United States', '');
        } catch(e) {}
        events.unshift(obj);
    }
    var templatedata = {
        'events':   events
    };


    window.cal.innerHTML   =   window.Mustache.render(window.tmpl, templatedata);
    window.body.classList.remove('loading');
}

function errorHandler(error) {
    window.console.error(error);
}

function getEndOfMonth(start) {
    var
    end         =   new Date(start.getTime());
    end.setMonth(start.getMonth() + 1);
    end         =   new Date(end - (24 * 60 * 60 * 1000));
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    end.setMilliseconds(999);
    return end;
}

function init() {
    window.body    =   document.body;
    window.cal     =   document.getElementById('calendar');
    window.days    =   [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];
    window.months  =   [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    window.tmpl    =   document.getElementById('template').innerHTML;

    window.cal.innerHTML   =   '';
    window.body.classList.add('loading');
    console.log("init running");
    gapi.client.setApiKey('AIzaSyCp_IflIV150pu3Quu-XDIaM7tMYlfO4DQ');
    gapi.client.load('calendar', 'v3').then(execute);
}

function execute() {
    var start       =   new Date();
    start.setTime(start.getTime() - (60 * 60 * 24 * 5));
    displayEventsFor(start);
}

function displayEventsFor(start, end) {
    if(!end) {
        end     =   getEndOfMonth(start);
    }
    currentStart    =   start;
    var request = gapi.client.calendar.events.list({
        "calendarId": "4qc3thgj9ocunpfist563utr6g@group.calendar.google.com",
        "singleEvents": "True",
        "orderBy": "startTime",
        "timeMin": start.toISOString(),
        "timeMax": end.toISOString()

    });
    request.then(displayEvents);
}
