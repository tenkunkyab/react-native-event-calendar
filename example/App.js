import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

import EventCalendar from '../src/EventCalendar';
import moment from 'moment';
let { width } = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          start: '2017-09-06 22:30:00',
          end: '2017-09-06 23:30:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
          color: '#55b560',
        },
        {
          start: '2017-09-07 00:30:00',
          end: '2017-09-07 01:30:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
          color: '#55b560',
        },
        {
          start: '2017-09-07 01:30:00',
          end: '2017-09-07 02:20:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-07 04:10:00',
          end: '2017-09-07 04:40:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-07 01:05:00',
          end: '2017-09-07 01:45:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-07 14:30:00',
          end: '2017-09-07 16:30:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-08 01:20:00',
          end: '2017-09-08 02:20:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-08 04:10:00',
          end: '2017-09-08 04:40:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-08 00:45:00',
          end: '2017-09-08 01:45:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-08 11:30:00',
          end: '2017-09-08 12:30:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-09 01:30:00',
          end: '2017-09-09 02:00:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-09 03:10:00',
          end: '2017-09-09 03:40:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-09 00:10:00',
          end: '2017-09-09 01:45:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
        {
          start: '2017-09-10 12:10:00',
          end: '2017-09-10 13:45:00',
          title: 'Dr. Mariana Joseph',
          summary: '3412 Piedmont Rd NE, GA 3032',
        },
      ],
    };
  }

  _eventTapped(event) {
    alert(JSON.stringify(event));
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <EventCalendar
          start={8}
          end={22}
          eventTapped={this._eventTapped.bind(this)}
          events={this.state.events}
          width={width}
          initDate={'2017-09-07'}
          scrollToFirst
          upperCaseHeader
          headerStyle={{
            display: 'none'
          }}
          // renderHeader={ () => (
          //   <Text>Hey yo</Text>
          // )}
          renderEvent={ (data) => {
            const TEXT_LINE_HEIGHT = 17;
            const formatTime = 'hh:mm A';
            const numberOfLines = Math.floor(data.height / TEXT_LINE_HEIGHT);
            return (
              <View>
                <Text numberOfLines={1} style={styles.eventTitle}>
                  {data.title || 'Event'}
                </Text>
                {numberOfLines > 1 ? (
                  <Text
                    numberOfLines={numberOfLines - 1}
                    style={[styles.eventSummary]}
                  >
                    {data.summary || ' '}
                  </Text>
                ) : null}
                {numberOfLines > 2 ? (
                  <Text style={styles.eventTimes} numberOfLines={1}>
                    {moment(data.start).format(formatTime)} -{' '}
                    {moment(data.end).format(formatTime)}
                  </Text>
                ) : null}
                </View>
            )
          }}
          uppercase
          scrollToFirst={false}
          offset={200}
          hourTapped={(data) => {
            console.log(data)
          }}
        />
      </View>
    );
  }
}

const styles = new StyleSheet.create({
  eventSummary: {
    color: '#615B73',
    fontSize: 12,
    flexWrap: 'wrap',
  },
  eventTimes: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#615B73',
    flexWrap: 'wrap',
  }
})


/**
 * [x] Header - customizable - hide
 * [c] Height of event container - customizable
 * [c] Click event on empty spaces/calendar
 * [ ] Font/Vertical Axis/Revamp the UI elements
 */