import React from 'react';
import { View, Text, StyleSheet,StatusBar,TouchableOpacity,Dimensions} from 'react-native';

const screen = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width/2,
    height: screen.width/2,
    borderRadius: screen.width/2,
    alignItems: "center",
    justifyContent:"center"
  },
  buttonText:
  {
    fontSize: 45,
    color: "#89AAFF"
  }

});


export default class App extends React.Component {
  render(){
  return(
    <View style ={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity onPress={()=> alert('Hello world!')} style={styles.button}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>

  );
  }
}







