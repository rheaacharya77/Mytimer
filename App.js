

import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions, Picker, Platform } from 'react-native';

// Makes the screen fit the Dimensions of the windoe/simulator
const screen = Dimensions.get('window');

// Object with our styles
const styles = StyleSheet.create({
	container: {
		flex: 1, // Tells it to take up the entirety of the avilable area.
		backgroundColor: '#07121B',
		alignItems: 'center', // Horizontally center content
		justifyContent: 'center'
	},
	button: {
		borderWidth: 10,
		borderColor: '#89AAFF',
		width: screen.width / 2,
		height: screen.width / 2,
		borderRadius: screen.width / 2,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30
	},
	buttonStop: {
		borderColor: '#FF851B'
	},
	buttonText: {
		fontSize: 45,
		color: '#89AAFF'
	},
	buttonTextStop: {
		fontSize: 45,
		color: '#FF851B'
	},
	timerText: {
		color: '#fff',
		fontSize: 90
	},
	picker: {
		width: 50,
		...Platform.select({
			android: {
				color: '#fff',
				backgroundColor: '#07121B',
				marginLeft: 10
			}
		})
	},
	pickerItem: {
		color: '#fff',
		fontSize: 20
	},
	pickerContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

// Function: getRemaining
// Parameters: time - number
// Returns: Object {minutes: Amount of minutes remaing , seconds: Amount of seconds remaining for the given minute}
// Called by: render() to update the components
// Purpose: Gets the remaining time in seconds and returns an object after we have calculated the remaining minutes and seconds.
const getRemaining = time => {
	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;
	return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

// Function: formatNumber
// Parameter: number - number
// Called by: getRemaining
// Purpose:  Formats the number as such:  3 => 03, 10 => 10
const formatNumber = number => `0${number}`.slice(-2); // We get the last 2 numbers

// Function: createArray
// Parameter: length: number
// Returns: array `arr` starting with 0 to length-1
// Called By: AVALIABLE_MINUTES, AVALIABLE_SECONDS
// Purpose: Create array that contains a single number from 0 to length-1 in each index
const createArray = length => {
	const arr = [];
	let i = 0;
	while (i < length) {
		arr.push(i.toString()); // return the string version of the number (Pickers can only user strings)
		i += 1;
	}
	return arr;
};

// Constants for max amount of minutes and seconds
const AVALIABLE_MINUTES = createArray(10);
const AVALIABLE_SECONDS = createArray(60);

export default class App extends React.Component {
	// The default state once the app runs
	state = {
		remainingSeconds: 5,
		isRunning: false,
		selectedMinutes: '0',
		selectedSeconds: '5'
	};

	// We will be using interval so we have to make it is clear before we use it.
	interval = null;

	// Lifecyle method for the component
	// Parameters: prevProp, prevState
	// Called when: This is called after the render method is done executing
	// Purpose: To compare our previous state with our current state. Allowing us to check once we have reached 0 seconds.
	componentDidUpdate(prevProp, prevState) {
		// If `remainingSeconds` is 0 and the `prevState.remainingSeconds` is not 0 this means
		// this is the first time we have reached 0. So stop the timer.
		if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
			this.stop();
		}
	}

	// Lifestyle method for the component
	// Called when: Component unmounts or a new component takes over WITHIN app
	// Purpose: When the component unmounts clear or stop whatever needs to be stopped
	componentWillUnmount() {
		// If an interval exist clear it
		// This prevents "memory leaks" preventing another component from mistakenly
		// using the interval and this component and break things.
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	// Function: start
	// Called By: <TouchableOpacity id=startButton>
	// Purpose: Starts the timer
	start = () => {
		// Update the state with the seconding selected and indicate that the timer is running.
		this.setState(state => ({
			remainingSeconds: parseInt(state.selectedMinutes) * 60 + parseInt(state.selectedSeconds, 10),
			isRunning: true
		}));
		// Start the count down. Every second subtract from the remaining seconds in the the state.
		this.interval = setInterval(() => {
			this.setState(state => ({
				remainingSeconds: state.remainingSeconds - 1
			}));
		}, 1000);
	};

	// Function: stop
	// Called By: <TouchableOpacity id=stopButton>
	// Purpose: Stops the timer
	stop = () => {
		clearInterval(this.interval); // Clears interval to clear memory
		this.interval = null; // Make sure the inteval is null
		// Set remaingSeconds to a default of 5 seconds
		// Indicate that the timer has stopped running
		this.setState({
			remainingSeconds: 5,
			isRunning: false
		});
	};

	// Function: renderPickers
	// Returns: view with pickers and their PickerItems
	// Purpose: Nicer and neater way to have our picker section of the app seprates.
	// 			Also handles all the logic for the pickers
	renderPickers = () => {
		return (
			<View style={styles.pickerContainer}>
				{/* Picker for the minutes */}
				<Picker
					style={styles.picker}
					itemStyle={styles.pickerItem}
					selectedValue={this.state.selectedMinutes} // Set the state of Minutes to the user picked state
					onValueChange={itemValue => {
						this.setState({ selectedMinutes: itemValue }); // Detect what was the amount of minutes that the user selected
					}}
					mode='dropdown'
				>
					{/* Show the amount of pickeritems for the dropdown menus */}
					{AVALIABLE_MINUTES.map(value => <Picker.Item key={value} label={value} value={value} />)}
				</Picker>
				<Text style={styles.pickerItem}>Minutes</Text>

				{/* Picker for the Seconds */}
				<Picker
					style={styles.picker}
					itemStyle={styles.pickerItem}
					selectedValue={this.state.selectedSeconds} // Set the state of seconds to the user picked state
					onValueChange={itemValue => {
						this.setState({ selectedSeconds: itemValue }); // Detect what was the amount of seconds that the user selected
					}}
				>
					{/* Show the amount of pickeritems for the dropdown menus */}
					{AVALIABLE_SECONDS.map(value => <Picker.Item key={value} label={value} value={value} />)}
				</Picker>
				<Text style={styles.pickerItem}>Seconds</Text>
			</View>
		);
	};

	render() {
		// The minutes and seoncds that we will pass to the component to be rendered.
		// This is rendered every second.
		const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
		return (
			<View style={styles.container}>
				{/* Makes status bar on top white */}
				<StatusBar barStyle='light-content' />
				{/* If timer is running show the countdown else show the pickers */}
				{this.state.isRunning ? <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text> : this.renderPickers()}
				{/* If timer is running show the stopButton else show the start button */}
				{this.state.isRunning ? (
					<TouchableOpacity id='stopButton' onPress={this.stop} style={[ styles.button, styles.buttonStop ]}>
						<Text style={[ styles.buttonText, styles.buttonTextStop ]}>Stop</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity id='startButton' onPress={this.start} style={styles.button}>
						<Text style={styles.buttonText}>Start</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	}
}
