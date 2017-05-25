import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ClueDescription from './ClueDescription'
import ClueCompletion from './ClueCompletion'

class ClueOverlay extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <View style={styles.container}>
          <ClueDescription style={styles.clueDescription} clue={this.props.clue} />
          <ClueCompletion style={styles.clueCompletion} cluesCompleted={this.props.cluesCompleted} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#DB7093',
  },
  clueDescription: {
    flex: 3,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    padding: 20
  },
  clueCompletion: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    padding: 20
  }
})

export default ClueOverlay;
