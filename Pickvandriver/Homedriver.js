import {
  Text,
  TouchableHighlight,
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  Button,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from './Card';
import Card_changeColor from './Card_changeColor';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import GetLocation from 'react-native-get-location';
import LocationEnabler from 'react-native-location-enabler';

const Homedriver = ({navigation}) => {
  useEffect(() => {
    checkAsyncStorage();
  }, []);

  async function checkAsyncStorage() {
    try {
      const email = await AsyncStorage.getItem('@datalogin');
      if (email === undefined || email === '' || email === null) {
        navigation.navigate('Login');
      }
    } catch (err) {}
  }

  const [Pointup, setPointup] = useState([{point: '', amount_all: '', id: ''}]);
  const [Pointdown, setPointdown] = useState([
    {
      point: '0',
      amount_all: '',
    },
  ]);
  const [seconds, setSeconds] = useState(0);
  const [seconds2, setSeconds2] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [text_location, settext_location] = useState('');

  useEffect(() => {
    get_data();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      get_data();
      setSeconds2(seconds2 => seconds2 + 1);
    }, 100000);
    return () => clearInterval(interval);
  }, []);

  async function get_data() {
    let id = await AsyncStorage.getItem('@dataloginId');
    await axios
      .get('http://10.0.2.2:3001/driver/driver_getpoint_up/' + id)
      .then(res => setPointup(res.data));
    await axios
      .get('http://10.0.2.2:3001/driver/driver_getpoint_down/' + id)
      .then(res => setPointdown(res.data));
  }

  const {
    PRIORITIES: {HIGH_ACCURACY},
    useLocationSettings,
  } = LocationEnabler;
  let state_gps = 0; //0 = on,1 = off
  const [enabled, requestResolution] = useLocationSettings(
    {
      priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
      alwaysShow: true, // default false
      needBle: true, // default false
    },
    false /* optional: default undefined */,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEnabled == true) {
        get_location();
      } else {
        settext_location('หยุดการเดินทาง');
        state_gps = 0;
      }
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isEnabled]);

  function get_location() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
    })
      .then(location => {
        console.log(location);
        state_gps = 0;
        send_location(location);
      })
      .catch(error => {
        if (state_gps == 1) {
        } else {
          Alert.alert(
            'เกิดข้อผิดผลาด',
            'กดปุ่ม OK เพื่อเปิด GPS ใหม่อีกครั้ง',
            [
              {
                text: 'Cancel',
                onPress: () => (state_gps = 0),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => requestResolution()},
            ],
          );
        }
        state_gps = 1;
      });
  }

  async function send_location(location) {
    let id = await AsyncStorage.getItem('@dataloginId');
    settext_location('เริ่มเดินทาง');
    axios
      .get(
        'http://10.0.2.2:3001/driver/get_location/' +
          id +
          '/' +
          location.latitude +
          '/' +
          location.longitude,
      )
      .then(res => console.log(res.data));
  }

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
      <View style={{marginTop: 5}}></View>

      <View style={styles.btnNormal}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginRight: 3, marginTop: 2}}>{text_location}</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value => setIsEnabled(value)}
            value={isEnabled}
          />
        </View>
      </View>
      <Text style={{color: '#140000', fontSize: 21, margin: 10}}>
        จุดรับส่งผู้โดยสาร
      </Text>
      <ScrollView>
        {Pointup.map(item => {
          return (
            <TouchableOpacity onPress={() => alert(JSON.stringify(item))}>
              <Card key={item.id}>
                <View>
                  <Text style={{fontSize: 20, color: '#140000'}}>
                    {' '}
                    จุดรับผู้โดยสาร : {item.point}
                  </Text>
                  <Text style={{fontSize: 20, color: '#140000'}}>
                    {' '}
                    จำนวน : {item.amount_all} คน
                  </Text>
                  <Text style={{fontSize: 20, color: '#140000'}}>
                    {' '}
                    เลขตั๋ว : {item.id}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
        {Pointdown.map(item => {
          return (
            <TouchableOpacity onPress={() => alert(JSON.stringify(item))}>
              <Card_changeColor key={item.point}>
                <View>
                  <Text style={{fontSize: 20, color: '#140000'}}>
                    {' '}
                    จุดส่งผู้โดยสาร : {item.point}
                  </Text>
                  <Text style={{fontSize: 20, color: '#140000'}}>
                    {' '}
                    จำนวน : {item.amount_all} คน
                  </Text>
                </View>
              </Card_changeColor>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNormal: {
    backgroundColor: '#b0e0e6',
    borderRadius: 21,
    height: 70,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnPress: {
    backgroundColor: '#7CBE65',
    borderRadius: 21,
    height: 70,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  Card: {
    backgroundColor: '#ACD3D3',
  },
});

export default Homedriver;
