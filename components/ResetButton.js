import React, { Component } from 'react';
import { Text, StyleSheet, Button, View } from 'react-native';

class ResetButton extends Component {

  render() {
    return (
      <View style={this.props.style}>
        <Button style={this.props.style}
          onPress={this.props.reset}
          title='RESET'
          color="white"
        />
      </View>
    );
  }
}

export default ResetButton;
