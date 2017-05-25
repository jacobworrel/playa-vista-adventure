
import React, { Component } from 'react';
import { Text, StyleSheet, TouchableHighlight, Image, View } from 'react-native';

class CheckInButton extends Component {

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.checkIn}
        style={this.props.style}
      >
        <View style={{backgroundColor: this.props.checkinButtonColor, borderRadius: 40}} >
          <Image
            source={require('./../assets/checkin-button.png')}
            style={{ width: 80, height: 80 }}
          />
        </View>
      </TouchableHighlight>
    );
  }
}


export default CheckInButton;

