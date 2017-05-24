import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

class ClueDescription extends Component {
  render() {
    return (
      <Text style={this.props.style}>
        {this.props.clue}
      </Text>
    );
  }
}

export default ClueDescription;
//{/*{this.props.clueDescription}*/}
