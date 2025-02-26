import React, {useState, useEffect, useContext} from 'react';
import UserContext from '../UserContext.tsx';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store'; 
import { View, Button, Alert } from 'react-native';

const GOOGLE_CLIENT_ID = "954083427661-t8o8nsd2mvi7ui3tcu64ehlnp579bvpt.apps.googleusercontent.com"

//allow authentication to complete and return results
WebBrowser.maybeCompleteAuthSession();
const OAuth = () => {
    const {loginUser, logOut} = useContext(UserContext);
    const [access_token, setAccessToken] = useState();

    //setup google auth
    //promptAsync opens a web browser window for user to login into google
    //redirect to google Oauth page, then redirect back to the app via the redirectUri
    //promptAsync is what going to call to authenticate the user and open browser
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: GOOGLE_CLIENT_ID,
        androidClientId: "954083427661-3imv10kespmn2sqemvtdp7615coijrva.apps.googleusercontent.com",
        scopes: ['profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        useProxy: false,
    })

    // const signIn = async () => { //handle login and store data in user context
    //     try{
    //         await GoogleSignIn.hasPlayServices();
    //         const userInfo = await GoogleSignIn.signIn();
    //         loginUser(userInfo.user);
    //         Alert.alert("Login Success", `Welcome ${userInfo.user.name}`);
    //     }catch (error){
    //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //             Alert.alert("Login Cancelled");
    //         } else if (error.code === statusCodes.IN_PROGRESS) {
    //             Alert.alert("Login in Progress");
    //         } else {
    //             Alert.alert("Login Failed", error.message);
    //         }
    //     }
    // };

    const fetchUserInfo = async (access_token) => {
        try{
            console.log("entered")
            console.log("access_token: " + access_token)
            const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                }
            });
            console.log(res)
            const userInfo = await res.json();

            //store user data
            //loginUser(userInfo);

            //store token
            await SecureStore.setItemAsync("userToken", access_token);


            Alert.alert("Login Success", `Welcome ${userInfo.name}`);
            setShowProfile(true);
        }catch (error){
            Alert.alert("Login Failed", error.message);
        }
    }

    const [showProfile, setShowProfile] = useState(false);

    if (showProfile) {
        return <ProfileScreen />;
    }

    //Handle response
    useEffect(() => {
        if(response?.type ==='success') {
            const { access_token } = response.authentication;
            console.log("OAuth successful, access token:", access_token);
            setAccessToken(access_token);
            console.log("in use effect")
            console.log("res: " + response)
            fetchUserInfo(access_token);
        }else if (response?.type === "error") {
            console.error("Login Error:", response.error);
            Alert.alert("Login Error", response.error?.message || "Something went wrong");
        }
    }, [response]);

    //testing uses
    useEffect(() => {
        console.log("Auth request object:", request);
    }, [request]);

    const signOut = async() => { //logout and clear context
        try {
            // await GoogleSignIn.signOut();
            await SecureStore.deleteItemAsync("userToken"); //delete token securely before logout
            logOut();
            Alert.alert("Logged Out Successfully");
        }catch(error){
            Alert.alert("Logout Failed", error.message);
        }
    };

    return (
        <View>
            <Button title="Login with Google" onPress={() => {console.log("pressed");promptAsync(); }} disabled={!request} />
            <Button title="Logout" onPress={signOut} />
            <Button 
                title="Login with Google" 
                onPress={async () => { 
                    console.log("Button Pressed"); 
                    try {
                        const result = await promptAsync({showInRevents: true});

                        console.log("OAuth Result:", result);
                    } catch (error) {
                        console.error("Error in promptAsync:", error);
                    }
                }} 
                disabled={!request} 
            />



        </View>
    );
}
    


export default OAuth