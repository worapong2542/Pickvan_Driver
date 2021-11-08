import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';

export function DrawerContent({props, navigation}) {

  async function del() {
    await AsyncStorage.removeItem('@datalogin');
    await AsyncStorage.removeItem('@dataloginId');
    await AsyncStorage.removeItem('@dataloginName');
    navigation.navigate('Login');
  }

  const [userName, setuserName] = useState('')

  //ทำงานเมื่อหน้าถูกเรียกใช้
  useEffect(() => {
    getUserName();
  }, []); //[] ทำงานรอบเดียว

  async function getUserName() { 
    const tempName = await AsyncStorage.getItem('@dataloginName');
    setuserName(tempName)
    console.log(tempName);
  }

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Text style={styles.txtUserName}> {userName}</Text>
          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem label="ออกจากระบบ" onPress={() => del()} />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    margin: 3,
    fontWeight: 'bold',
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingTop: 20,
  },
  txtUserName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});