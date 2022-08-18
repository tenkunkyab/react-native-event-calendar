// @flow
import {
  VirtualizedList,
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';

import styleConstructor from './style';

import DayView from './DayView';

export default class EventCalendar extends React.Component {
  constructor(props) {
    super(props);

    const start = props.start ? props.start : 0;
    const end = props.end ? props.end : 24;
    const offset = props.offset ? props.offset : 130;

    this.styles = styleConstructor(props.styles, (end - start) * offset);
    this.state = {
      date: moment(this.props.initDate),
      index: this.props.size,
    };
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }

  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(undefined);
    }
  }

  static defaultProps = {
    size: 30,
    initDate: new Date(),
    formatHeader: 'DD MMMM YYYY',
  };

  _getItemLayout(data, index) {
    const { width } = this.props;
    return { length: width, offset: width * index, index };
  }

  _getItem(events, index) {
    const date = moment(this.props.initDate).add(
      index - this.props.size,
      'days'
    );
    return _.filter(events, event => {
      const eventStartTime = moment(event.start);
      return (
        eventStartTime >= date.clone().startOf('day') &&
        eventStartTime <= date.clone().endOf('day')
      );
    });
  }

  _renderItem({ index, item }) {
    const {
      width,
      format24h,
      initDate,
      scrollToFirst = true,
      start = 0,
      end = 24,
      formatHeader,
      upperCaseHeader = false,
      offset
    } = this.props;
    const date = moment(initDate).add(index - this.props.size, 'days');

    const leftIcon = this.props.headerIconLeft ? (
      this.props.headerIconLeft
    ) : (
      <Image source={require('./back.png')} style={this.styles.arrow} />
    );
    const rightIcon = this.props.headerIconRight ? (
      this.props.headerIconRight
    ) : (
      <Image source={require('./forward.png')} style={this.styles.arrow} />
    );

    const calendarIcon = this.props.calendarIcon ? (
      this.props.calendarIcon
    ) : (
      <Image source={require('./calendar.png')} style={this.styles.arrow} />
    );

    let headerText = upperCaseHeader
      ? date.format(formatHeader || 'DD MMMM YYYY').toUpperCase()
      : date.format(formatHeader || 'DD MMMM YYYY');

    return (
      <View style={[this.styles.container, { width }]}>
        <View style={[this.styles.header, this.props.headerStyle]}>
          {this.props.renderHeader ? this.props.renderHeader() : (
            <>
              <TouchableOpacity
                style={this.styles.arrowButton}
                onPress={this._previous}
              >
                {leftIcon}
              </TouchableOpacity>
              <View style={this.styles.headerTextContainer} >
                <Text style={this.styles.headerText}>{headerText}</Text>
                <TouchableOpacity
                  style={this.styles.arrowButton}
                  onPress={this.props.onCalendarPressed}
                >
                  {calendarIcon}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={this.styles.arrowButton}
                onPress={this._next}
              >
                {rightIcon}
              </TouchableOpacity>
            </>
          )}
        </View>
        <DayView
          date={date}
          index={index}
          format24h={format24h}
          formatHeader={this.props.formatHeader}
          headerStyle={this.props.headerStyle}
          renderEvent={this.props.renderEvent}
          eventTapped={this.props.eventTapped}
          hourTapped={this.props.hourTapped}
          events={item}
          width={width}
          styles={this.styles}
          scrollToFirst={scrollToFirst}
          start={start}
          end={end}
          offset={offset}
        />
      </View>
    );
  }

  _goToPage(index) {
    if (index <= 0 || index >= this.props.size * 2) {
      return false;
    }
    const date = moment(this.props.initDate).add(
      index - this.props.size,
      'days'
    );
  
    this.refs.calendar.scrollToIndex({ index, animated: false });
    this.setState({ index, date });
    return true
  }

  _goToDate(date) {
    const earliestDate = moment(this.props.initDate).subtract(
      this.props.size,
      'days'
    );
    const prevDate = moment(earliestDate).format("MM-DD-YYYY")
    const newDate = moment(date).format("MM-DD-YYYY")

    const index = moment(newDate).diff(prevDate, 'days')
    return this._goToPage(index);  
  }

  _previous = () => {
    this._goToPage(this.state.index - 1);
    if (this.props.dateChanged) {
      this.props.dateChanged(
        moment(this.props.initDate)
          .add(this.state.index - 1 - this.props.size, 'days')
          .format('YYYY-MM-DD')
      );
    }
  };

  _next = () => {
    this._goToPage(this.state.index + 1);
    if (this.props.dateChanged) {
      this.props.dateChanged(
        moment(this.props.initDate)
          .add(this.state.index + 1 - this.props.size, 'days')
          .format('YYYY-MM-DD')
      );
    }
  };

  render() {
    const {
      width,
      virtualizedListProps,
      events,
      initDate,
    } = this.props;

    return (
      <View style={[this.styles.container, { width }]}>
        <VirtualizedList
          ref="calendar"
          windowSize={2}
          initialNumToRender={2}
          initialScrollIndex={this.props.size}
          data={events}
          getItemCount={() => this.props.size * 2}
          getItem={this._getItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={this._getItemLayout.bind(this)}
          horizontal
          pagingEnabled
          renderItem={this._renderItem.bind(this)}
          style={{ width: width }}
          onMomentumScrollEnd={event => {
            const index = parseInt(event.nativeEvent.contentOffset.x / width);
            const date = moment(this.props.initDate).add(
              index - this.props.size,
              'days'
            );
            if (this.props.dateChanged) {
              this.props.dateChanged(date.format('YYYY-MM-DD'));
            }
            this.setState({ index, date });
          }}
          {...virtualizedListProps}
        />
      </View>
    );
  }
}
