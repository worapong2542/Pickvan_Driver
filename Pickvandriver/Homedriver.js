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
    //เช็คว่ามีข้อมูล login ไว้ไหม ถ้ามีก็เข้าหน้าหลัก ถ้าไม่มีก็จะไป login
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
  const [texttime, settexttime] = useState('');
  const [textdate, settextdate] = useState('');

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
      .then(res => setvalue(res));
  }
  function setvalue(res){
    setPointdown(res.data.point)
    settextdate(res.data.route[0].date.substring(0, 10))
    settexttime(res.data.route[0].time.substring(0, 5))
  }

  const {
    PRIORITIES: {HIGH_ACCURACY},
    useLocationSettings,
  } = LocationEnabler;
  const [enabled, requestResolution] = useLocationSettings(
    {
      priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
      alwaysShow: true, // default false
      needBle: true, // default false
    },
    false /* optional: default undefined */,
  );
  let state_gps = 0; //0 = on,1 = off

  //ดูสถานะปุ่ม ว่าเปิดหรือปิด 
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
    <View style={styles.container}>
      <View style={styles.btnNormal}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textBtn}>{text_location}</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={value => setIsEnabled(value)}
            value={isEnabled}
          />
        </View>
      </View>

      <View style={styles.viewBox}>
        <Text style={styles.textBox}>จุดรับส่งผู้โดยสาร </Text>
      </View>

      <ScrollView>
      <Text style={styles.textTime}>วันที่ {textdate} เวลา {texttime}</Text>
        {Pointup.map(item => {
          return (
            <TouchableOpacity onPress={() => alert(JSON.stringify(item))}>
              <Card key={item.id}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>จุดรับผู้โดยสาร :</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>{item.point}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>จำนวน :</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>{item.amount_all}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>เลขตั๋ว :</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>{item.id}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
        {Pointdown.map(item => {
          return (
            <TouchableOpacity onPress={() => alert(JSON.stringify(item))}>
              <Card_changeColor key={item.point}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>จุดส่งผู้โดยสาร :</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>{item.point}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>จำนวน :</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.textDefault}>{item.amount_all}</Text>
                  </View>
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
    backgroundColor: '#FFFFFF',
  },
  btnNormal: {
    backgroundColor: '#b0e0e6',
    borderRadius: 21,
    height: 70,
    width: 250,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textBtn: {
    marginRight: 3,
    marginTop: 2,
    fontSize: 20,
  },
  viewBox: {
    marginTop: 10,
    alignItems: 'center',
  },
  textBox: {
    color: '#140000',
    fontSize: 20,
    margin: 5,
  },
  textTime: {
    color: '#140000',
    fontSize: 18 ,
    textAlign: 'center',
  },
  textDefault: {
    fontSize: 20,
    color: '#140000',
  },
});

export default Homedriver;
