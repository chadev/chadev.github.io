let days = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];
let months = [
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

var arrangedEvents = {};

class Event {
  constructor(title, content, location, start) {
    let address = '';
    try {
      address = location.replace(', United States', '');
    } catch (e) {
      // Do nothing
    }

    this.title = title;
    this.address = address;
    this.content = this.autolink(content);
    this.start = this.startDate(start);
    this.time = this.prettyTime(this.start);
    this.meridian = this.meridian(this.start);
  }

  prettyTime(start) {
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

  meridian(time) {
    return time.getHours() >= 12 ? 'PM' : 'AM';
  }

  startDate(start) {
    var date = start.dateTime ? start.dateTime : start.date;
    date = date ? date : start;
    return new Date(date);
  }

  autolink(text) {
    if (typeof (text) == 'undefined') { return text; }

    // http://jsfiddle.net/kachibito/hEgvc/1/light/
    return text.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, "<a href='$1'>$1</a>");
  }
}

Event.prettyDate = function (start) {
  var day = days[start.getDay()],
    month = months[start.getMonth()],
    date = start.getDate();
  return day + ", " + month + " " + date;
}

function dateKey(date) {
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
}

function addEvent(obj) {
  var key = dateKey(obj.start);
  var date = arrangedEvents[key] || { events: [], prettyDate: '' };
  date.prettyDate = date.prettyDate || Event.prettyDate(obj.start);
  date.events.push(obj);
  arrangedEvents[key] = date;
}

const loadRSS = () =>
  icalURLs.forEach(fetchRSS);

function fetchRSS(url) {
  fetch('https://cors-anywhere.herokuapp.com/' + url)
    .then(response => response.text())
    .then(cal => ical.parseICS(cal))
    .then(data => {
      for (let k in data) {
        if (data.hasOwnProperty(k)) {
          var item = data[k];
          if (data[k].type == 'VEVENT') {
            addEvent(new Event(
              item.summary.replace('/', '/<wbr>'),
              item.description,
              item.location,
              item.start,
            ));
          }
        }
      }
    })
    .then(render);
}

function init() {
  window.body = document.body;
  window.cal = document.getElementById('calendar');
  window.tmpl = document.getElementById('template').innerHTML;
  window.cal.innerHTML = '';
  window.body.classList.add('loading');

  loadRSS();
  gapi.client.setApiKey('AIzaSyCp_IflIV150pu3Quu-XDIaM7tMYlfO4DQ');
  gapi.client.load('calendar', 'v3').then(execute);
}

function execute() {
  var start = new Date();
  start.setTime(start.getTime() - (60 * 60 * 24 * 5));
  const end = getEndOfMonth(start);

  [
    '4qc3thgj9ocunpfist563utr6g@group.calendar.google.com', // Chadev
  ].forEach(function (calendar) {
    displayEventsFor(start, end, calendar);
  })
}

function displayEventsFor(start, end, calendar) {
  gapi.client.calendar.events.list({
    "calendarId": calendar,
    "singleEvents": "True",
    "orderBy": "startTime",
    "timeMin": start.toISOString(),
    "timeMax": end.toISOString(),
  })
    .then(addEvents)
    .then(render);
}

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

function addEvents(data) {
  data.result.items.forEach(function (item) {
    addEvent(new Event(
      item.summary.replace('/', '/<wbr>'),
      item.description,
      item.location,
      item.start,
    ));
  });
}

function render() {
  const dates = convertToArray(arrangedEvents);

  var templatedata = {
    'dates': dates
  };

  window.cal.innerHTML = window.Mustache.render(window.tmpl, templatedata);
  window.body.classList.remove('loading');

  return;

  function convertToArray(obj) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });

    return arr;
  }
}

function errorHandler(error) {
  window.console.error(error);
}
