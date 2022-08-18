// @flow
import { Platform, StyleSheet } from 'react-native';

// const eventPaddingLeft = 4
const leftMargin = 50 - 1;

export default function styleConstructor(theme = {}, calendarHeight) {
  let style = {
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      ...theme.container,
    },
    contentStyle: {
      marginTop: 16,
      backgroundColor: '#ffffff',
      height: calendarHeight + 10,
      ...theme.contentStyle,
    },
    header: {
      paddingHorizontal: 30,
      height: 50,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#E6E8F0',
      backgroundColor: '#F5F5F6',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      ...theme.header,
    },
    headerTextContainer: {
      flexDirection:"row",
      justifyContent: 'center',
      alignItems:"center"
    },
    headerText: {
      fontSize: 16,
      ...theme.headerText,
    },
    arrow: {
      width: 15,
      height: 15,
      resizeMode: 'contain',
    },
    arrowButton: {
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.arrowButton,
    },
    event: {
      position: 'absolute',
      backgroundColor: '#F8F8F8',
      opacity: 1,
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 4,
      minHeight: 25,
      flex: 1,
      paddingTop: 5,
      paddingBottom: 0,
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflow: 'scroll',
      ...theme.event,
    },
    eventTitle: {
      color: '#615B73',
      fontWeight: '600',
      minHeight: 15,
      ...theme.eventTitle,
    },
    eventSummary: {
      color: '#615B73',
      fontSize: 12,
      flexWrap: 'wrap',
      ...theme.eventSummary,
    },
    eventTimes: {
      marginTop: 3,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#615B73',
      flexWrap: 'wrap',
      ...theme.eventTimes,
    },
    line: {
      height: 1,
      position: 'absolute',
      left: leftMargin,
      borderColor:'#dddddd',
      borderWidth: 0.5,
      backgroundColor: '#ffffff',
      ...theme.line,
    },
    lineNow: {
      height: 2,
      position: 'absolute',
      left: leftMargin,
      backgroundColor: '#0bacf0',
      ...theme.lineNow,
    },
    timeLabel: {
      position: 'absolute',
      left: 15,
      color: 'rgb(170,170,170)',
      fontSize: 10,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
      fontWeight: '500',
      ...theme.timeLabel,
    },
  };
  return StyleSheet.create(style);
}
