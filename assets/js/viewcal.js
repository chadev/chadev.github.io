function loadCalendar(feedArg){
    (function(g) {
    "use strict";
   
    g.load('gdata', '1');

    var
    body    =   document.body,
    cal     =   document.getElementById('calendar'),
    feed    =   feedArg,
    service,
    days    =   [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ],
    months  =   [
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
    ],
    currentStart,
    tmpl    =   document.getElementById('template').innerHTML;

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

    function sortEvents(a, b) {
        if(a.start < b.start) {
            return -1;
        } else if(a.start > b.start) {
            return 1;
        } else {
            return 0;
        }
    }
    function getNextEvent(events) {
        var
        now     =   new Date(),
        nevnt   =   0,
        i       =   events.length;

        while(i--) {
            var
            evnt    =   events[i],
            index   =   null,
            delta   =   evnt.start.getTime() - now.getTime();
            if(delta <= 0) {
                nevnt = i;
                return i;
            }
        }
        return nevnt;
    }


    function displayEvents(data) {
        var
        events  =   [],
        today   =   Date.now(),
        feed    =   data.feed.getEntries(),
        i       =   feed.length;
        while(i--) {
            var
            evnt    =   feed[i],
            j       =   evnt.gd$when.length;
            while(j--) {
                var
                obj     =   {};
                obj.title   =   evnt.getTitle().getText().replace('/', '/<wbr>');
                obj.content =   autolink(evnt.getContent().getText());
                obj.start   =   new Date(evnt.gd$when[j].startTime);
                obj.month   =   months[obj.start.getMonth()];
                obj.date     =   obj.start.getDate();
                obj.day     =   days[obj.start.getDay()]
                obj.time    =   formatTime(obj.start);
                try {
                    obj.address =   evnt.gd$where[0].valueString.replace(', United States', '');
                } catch(e) {}
                events.unshift(obj);
            }

        }
        events.sort(sortEvents);
        var nextEvent = getNextEvent(events) - 2,
            templatedata = {
                'events':   events
            };
        if(nextEvent > 0) {
            templatedata['events'] = events.slice(nextEvent);
        };

        cal.innerHTML   =   window.Mustache.render(tmpl, templatedata);
        body.classList.remove('loading');
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
        service     =   new g.gdata.calendar.CalendarService('notional-buffer-570');
        var start       =   new Date();
        start.setTime(start.getTime() - (60 * 60 * 24 * 5));
        displayEventsFor(start);
    }

    function displayEventsFor(start, end) {
        if(!service || !start) { return; }

        if(!end) {
            end     =   getEndOfMonth(start);
        }
        var
        query       =   new g.gdata.calendar.CalendarEventQuery(feed);

        query.setMinimumStartTime(start.toISOString());
        query.setMaximumStartTime(end.toISOString());

        cal.innerHTML   =   '';
        body.classList.add('loading');
        currentStart    =   start;

        service.getEventsFeed(query, displayEvents, errorHandler);
    }

    g.setOnLoadCallback(init);
})(window.google);
}
