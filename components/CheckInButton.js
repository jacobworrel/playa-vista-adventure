
import React, { Component } from 'react';
import { Text, StyleSheet, TouchableHighlight, Image } from 'react-native';

class CheckInButton extends Component {

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.checkIn}
        style={this.props.style}
        underlayColor={this.props.checkinButtonColor}
      >
        <Image
          source={require('./../assets/checkin-button.png')}
          style={{ width: 80, height: 80 }}
        />
      </TouchableHighlight>
    );
  }
}

export default CheckInButton;
