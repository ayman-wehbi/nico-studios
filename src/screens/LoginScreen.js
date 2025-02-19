import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Alert, Modal } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { auth } from '../../firebase'; // Adjust the path as necessary
import { useNavigation} from '@react-navigation/native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const fetchFonts = () => {
    return Font.loadAsync({
      'Lemon': require('../assets/fonts/Lemon-Regular.ttf'),
      'Cursives': require('../assets/fonts/CedarvilleCursive-Regular.ttf'),
    });
  };

const SignupScreen = (props) =>  {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      async function prepare() {
        try {
          await SplashScreen.preventAutoHideAsync();
          await fetchFonts();
          // Wait for other resources to load
        } catch (e) {
          console.warn(e);
        } finally {
          setFontLoaded(true);
          await SplashScreen.hideAsync();
        }
      }
  
      prepare();
    }, []);
    
        const ErrorModal = () => (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{errorMessage}</Text>
                <View style={styles.modalViewButtons}>
                <Pressable
                    style={[styles.button, styles.buttonPass]}
                    onPress={() => navigation.navigate("PwResetScreen")}
                    android_ripple={{ color: 'black' }}
                  >
                    <Text style={styles.textStyle}>Forgot Password</Text>
                  </Pressable>
                  <View style={styles.verticalSeparator}></View>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(false)}
                    android_ripple={{ color: 'black' }}
                  >
                    <Text style={styles.textStyle}>OK</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        );

        const handleSignIn = () => {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log(user.email);
                    navigation.navigate("SongList");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    let message = "Invalid Email or Password";
                    if (errorCode === 'auth/wrong-password') {
                      message = "The password you entered is incorrect. Please try again.";
                    } else if (errorCode === 'auth/user-not-found') {
                      message = "No user found with this email. Please sign up.";
                    }
                    setErrorMessage(message);
                    setModalVisible(true);
                  });
        };

    const handleSignUp = () => {

                navigation.navigate("SignupScreen")

    };
    
    if (!fontLoaded) {
      return null; // Return null or a loading spinner until fonts are loaded
    }

    return (
        <View style={styles.container}>
            <ErrorModal />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>NICO STUDIOS</Text>
                <Text style={styles.subtitle}>for songwriters</Text>
            </View>
            <View style={styles.loginContainer}>
                
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={"grey"}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={"grey"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Pressable style={styles.button} android_ripple={{ color: 'black' }} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
                <Pressable style={styles.button} android_ripple={{ color: 'black' }} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable> 
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: "2%",
        backgroundColor: "#0f0f0f"
    },
    titleContainer: {
        marginTop:"50%",
        alignItems: 'flex-end',
        marginBottom: "10%"
    },
    title: {
        fontSize: 45,
        color: '#Face88',
        fontFamily: "Lemon",
        marginBottom: -22
    },
    subtitle: {
        fontSize: 20,
        color: '#f754c8',
        marginLeft: 5, // Adjust as needed
        fontFamily: "Cursives",
    },
    loginContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 9,
        color: "white",
    },
    button: {
        backgroundColor: '#FACE88',
        padding: 10,
        borderRadius: 9,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#121a39',
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "#face88",
        borderRadius: 10,
        paddingTop: 5,
        paddingHorizontal: 29,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5
        },
        shadowOpacity: 1.25,
        shadowRadius: 3.84,
        elevation: 20
      },
      modalViewButtons: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-evenly', // This spreads out your buttons evenly
        marginTop: 5, // Gives some space between the text and the buttons
      },
      modalText: {
        margin: 10,
        textAlign: "center",
        fontSize:17,
      },
      buttonClose: {
        backgroundColor: "rgba(247, 84, 200, 0.0)", // Corrected color value
        width: 70, // Adjusted width to accommodate text
        height: 40, // Adjusted for better touch area
        justifyContent: 'center', // Centers text vertically
        alignItems: 'center', // Centers text horizontally
        borderRadius: 9, // Optional: adds rounded corners
        marginHorizontal: 5, // Optional: adds space between buttons
      },
      buttonPass: {
        backgroundColor: "rgba(247, 84, 200, 0.0)",
        width: 150, // Adjusted width to accommodate text
        height: 40, // Adjusted for better touch area
        justifyContent: 'center', // Centers text vertically
        alignItems: 'center', // Centers text horizontally
        borderRadius: 9, // Optional: adds rounded corners
        marginHorizontal: 5, // Optional: adds space between buttons
      },
      verticalSeparator: {
        height: '50%', // Match the height of the buttons
        marginBottom: '3%',
        width: 1.5,
        borderRadius: 2,
        backgroundColor: '#292929', // Or any color you prefer
        marginHorizontal: 2, // Adjust the space between the separator and the buttons
      },

});

export default SignupScreen;

