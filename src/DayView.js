// @flow
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import populateEvents from './Packer';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';

const LEFT_MARGIN = 60 - 1;
// const RIGHT_MARGIN = 10
const CALENDER_HEIGHT = 2400;
// const EVENT_TITLE_HEIGHT = 15
const TEXT_LINE_HEIGHT = 17;
// const MIN_EVENT_TITLE_WIDTH = 20
// const EVENT_PADDING_LEFT = 4

function range(from, to) {
  return Array.from(Array(to), (_, i) => from + i);
}

export default class DayView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.calendarHeight = (props.end - props.start) * props.offset;
    const width = props.width - LEFT_MARGIN;
    const packedEvents = populateEvents(props.events, width, props.start, props.offset);
    let initPosition =
      _.min(_.map(packedEvents, 'top')) -
      this.calendarHeight / ((props.end - props.start) * props.offset);
    initPosition = initPosition < 0 ? 0 : initPosition;
    this.state = {
      _scrollY: initPosition,
      packedEvents,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const width = nextProps.width - LEFT_MARGIN;
    this.setState({
      packedEvents: populateEvents(nextProps.events, width, nextProps.start, nextProps.offset),
    });
  }

  componentDidMount() {
    this.props.scrollToFirst && this.scrollToFirst();
  }

  scrollToFirst() {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this._scrollView) {
        this._scrollView.scrollTo({
          x: 0,
          y: this.state._scrollY,
          animated: true,
        });
      }
    }, 1);
  }

  _renderLineNow() {
    const offset = this.props.offset ? this.props.offset : 130 ;
    const { format24h } = this.props;
    const { width, styles } = this.props;
    const timeNowHour = moment().hour();
    const timeNowMin = moment().minutes();
    return (
      <View
        key={`timeNow`}
        style={[
          styles.lineNow,
          {
            top:
              offset * (timeNowHour - this.props.start) +
              (offset * timeNowMin) / 60,
            width: width - 20,
          },
        ]}
      />
    );
  }
  
  _onHourTapped(time) {
    if (this.props.hourTapped === null) {
      return;
    }
    const {date} = this.props;
    this.props.hourTapped({date, time})
  }

  _renderLines() {
    const { format24h, start, end } = this.props;
    const offset = this.props.hasOwnProperty('offset') ? this.props.offset : this.calendarHeight / (end - start);

    return (
      <View style={Platform.OS === 'android' && { marginTop: 3 }}>
        {range(start, end + 1).map((i, index) => {
          let timeText,
            time = i;
          if (i === start) {
            timeText = !format24h ? `${i} AM`: i;
            time = `0${i}`;
          } else if (i < 12) {
            timeText = !format24h ? `${i} AM` : i;
            time = `0${i}`;
          } else if (i === 12) {
            timeText = !format24h ? `${i} PM` : i;
          } else if (i === 24) {
            timeText = !format24h ? `12 AM` : 0;
          } else {
            timeText = !format24h ? `${i - 12} PM` : i;
          }
          const { width, styles } = this.props;

          return [
            <Text
              key={`timeLabel${i}`}
              style={[styles.timeLabel, { top: offset * index - 6 }]}
            >
              {timeText}
            </Text>,
            <TouchableOpacity
              key={`line${i}`}
              onPress={() => {
                const timeText = `${time}:00`;
                this._onHourTapped(timeText)
              }}
              style={[styles.line, { backgroundColor: '#FFFFFF', top: offset * index, width: width - 20, height: offset / 2}]}
            >
              <View />
            </TouchableOpacity>
            ,
            <TouchableOpacity
              // activeOpacity={0.8}
              key={`lineHalf${i}`}
              onPress={() => {
                const timeText = `${time}:30`;
                this._onHourTapped(timeText)
              }}
              style={[ styles.line, {  backgroundColor: '#FFFFFF', top: offset * (index + 0.5), width: width - 20, height: offset / 2 } ]}
            >
              <View />
            </TouchableOpacity>
          ]
        })}
      </View>
    )
  }

  _renderTimeLabels() {
    const { styles, start, end, offset } = this.props;
    const _offset = offset ? offset : this.calendarHeight / (end - start);
    return range(start, end).map((item, i) => {
      return (
        <View key={`line${i}`} style={[styles.line, { top: _offset * i }]} />
      );
    });
  }

  _onEventTapped(event) {
    this.props.eventTapped(event);
  }

  _renderEvents() {
    const { styles } = this.props;
    const { packedEvents } = this.state;
    let events = packedEvents.map((event, i) => {
      const style = {
        left: event.left,
        height: event.height - 8,
        width: event.width,
        top: event.top + 4,
        borderLeftWidth: 4,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderLeftColor: event.hasOwnProperty('color') ? event.color : '#808080'
      };

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const formatTime = this.props.format24h ? 'HH:mm' : 'hh:mm A';
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            this._onEventTapped(this.props.events[event.index])
          }
          key={i} style={[style, styles.event]}
        >
          {this.props.renderEvent ? (
            <ScrollView style={{flex: 1}}>
              {this.props.renderEvent(event)}
            </ScrollView>
          ) : (
            <View>
              <Text numberOfLines={1} style={styles.eventTitle}>
                {event.title || 'Event'}
              </Text>
              {numberOfLines > 1 ? (
                <Text
                  numberOfLines={numberOfLines - 1}
                  style={[styles.eventSummary]}
                >
                  {event.summary || ' '}
                </Text>
              ) : null}
              {numberOfLines > 2 ? (
                <Text style={styles.eventTimes} numberOfLines={1}>
                  {moment(event.start).format(formatTime)} -{' '}
                  {moment(event.end).format(formatTime)}
                </Text>
              ) : null}
              </View>
          )}
        </TouchableOpacity>
      );
    });

    return (
      <View>
        <View style={{ marginLeft: LEFT_MARGIN }}>{events}</View>
      </View>
    );
  }

  render() {
    const { styles } = this.props;
    return (
      <>
        
        <ScrollView
          ref={ref => (this._scrollView = ref)}
          contentContainerStyle={[
            styles.contentStyle,
            { width: this.props.width}, //, paddingTop: 250
          ]}
        >
          {this._renderLines()}
          {this._renderEvents()}
          {this._renderLineNow()}
        </ScrollView>
      </>
    );
  }
}
