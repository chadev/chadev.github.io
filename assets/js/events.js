function init() {
  window.body = document.body;
  window.cal  = document.getElementById('calendar');
  window.days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];
  window.months = [
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
  window.tmpl = document.getElementById('template').innerHTML;
  window.cal.innerHTML = '';
  window.body.classList.add('loading');
  gapi.client.setApiKey('AIzaSyCp_IflIV150pu3Quu-XDIaM7tMYlfO4DQ');
  gapi.client.load('calendar', 'v3').then(execute);
}

function execute() {
  var start = new Date();
  start.setTime(start.getTime() - (60 * 60 * 24 * 5));
  displayEventsFor(start);
}

function displayEventsFor(start, end) {
  end = end || getEndOfMonth(start);
  var currentStart = start;
  var request = gapi.client.calendar.events.list({
    "calendarId": "4qc3thgj9ocunpfist563utr6g@group.calendar.google.com",
    "singleEvents": "True",
    "orderBy": "startTime",
    "timeMin": start.toISOString(),
    "timeMax": end.toISOString()

  });
  request.then(displayEvents);

  function getEndOfMonth(start) {
    var end = new Date(start.getTime());
    end.setMonth(start.getMonth() + 1);
    end = new Date(end - (24 * 60 * 60 * 1000));
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    end.setMilliseconds(999);
    return end;
  }
}

function displayEvents(data) {
  var events          = [],
      arrangedEvents  = {},
      today           = Date.now();

  data.result.items.forEach(function(item) {
    var obj        = {};
    obj.title      = item.summary.replace('/', '/<wbr>');
    obj.content    = autolink(item.description);
    obj.start      = startDate(item.start);
    obj.time       = prettyTime(obj.start);
    obj.meridian   = meridian(obj.start);
    console.log(item);

    try {
      obj.address = item.location.replace(', United States', '');
    } catch(e) {
      // Do nothing
    }

    var key = dateKey(obj.start);
    var date = arrangedEvents[key] || { events: [], prettyDate: '' };
    date.prettyDate = date.prettyDate || prettyDate(obj.start);
    date.events.push(obj);
    arrangedEvents[key] = date;
  });

  arrangedEvents = convertToArray(arrangedEvents);

  var templatedata = {
    'dates': arrangedEvents
  };

  window.cal.innerHTML = window.Mustache.render(window.tmpl, templatedata);
  window.body.classList.remove('loading');

  return;

  function prettyTime(start) {
    return hour(start) + ":" + minutes(start);

    function hour(time) {
      var h = time.getHours();
      return h > 12 ? h - 12 : h;
    }

    function minutes(time) {
      var m = time.getUTCMinutes();
      return m < 10 ? "0" + m : m;
    }

  }

  function meridian(time) {
    return time.getHours() >= 12 ? 'PM' : 'AM';
  }

  function prettyDate(start) {
    var day   = days[start.getDay()],
        month = months[start.getMonth()],
        date  = start.getDate();
    return day + ", " + month + " " + date;
  }

  function startDate(start) {
    var date = start.dateTime ? start.dateTime : start.date;
    return new Date(date);
  }

  function dateKey(date) {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
  }

  function autolink(text) {
    if(typeof(text) == 'undefined') { return text; }

    // http://jsfiddle.net/kachibito/hEgvc/1/light/
    return text.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,"<a href='$1'>$1</a>");
  }

  function formatTime(date) {
    var output = [];
    output.push((date.getHours() % 12) || 12);
    output.push(':');
    output.push(('0' + date.getMinutes()).slice(-2));
    output.push(date.getHours() > 11 ? ' p.m.' : ' a.m.');
    return output.join('');
  }

  function convertToArray(obj) {
    var arr =  Object.keys(obj).map(function(key) {
      return obj[key];
    });

    return arr;
  }
}

function errorHandler(error) {
  window.console.error(error);
}
