import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import RootNav from "./src/routes/rootNav";
import NotificationModal from "./src/components/EnableNotificationModal";

import Loading from "./src/components/Loader";

export default function App() {

  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [dontShowAgain, setShowAgain] = React.useState("");

  async function createEmptyStorage(){
    const monday = ["Monday", JSON.stringify([])]
    const tuesday = ["Tuesday", JSON.stringify([])]
    const wednesday = ["Wednesday", JSON.stringify([])]
    const thursday = ["Thursday", JSON.stringify([])]
    const friday = ["Friday", JSON.stringify([])]
    const saturday = ["Saturday", JSON.stringify([])]
    const sunday = ["Sunday", JSON.stringify([])]
    await AsyncStorage.multiSet([monday, tuesday, wednesday, thursday, friday, saturday, sunday])
    .then(()=> setLoading(false))
    .catch(e => console.log(e));
    console.log('default values set')  
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  useEffect(() => {
    async function checkEmpty() {
      setLoading(true);
      await AsyncStorage.getAllKeys()
        .then(async (res) => {
          // await AsyncStorage.clear()
          if(res.length == 0)
          {
            createEmptyStorage();
          }
          else{
            await AsyncStorage.getItem('dontshowagain')
            .then(res => {
              console.log('dont show key exists')
              if(res === "true"){
                setVisible(false);
              }
            }).catch(e => console.log(e));
            setLoading(false);
          }     
        })
        .catch((e) => console.log(e));
    }
    checkEmpty();
  }, []);

  if(loading){
    return(<Loading />)
  }
  else{
    return (
      <NavigationContainer>
        <SafeAreaProvider>
          <RootNav />
          <NotificationModal
           visible={visible} 
           setVisible={() => {setVisible(!visible);}} 
           dontShowAgain={dontShowAgain} 
           setDontShowAgain={() => setShowAgain(!dontShowAgain)} 
          />
        </SafeAreaProvider>
      </NavigationContainer>
    );
  }
  
}
