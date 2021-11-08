import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {sha256} from 'react-native-sha256';

function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let result;

  function checkLogin() {
    if (email == '' || password == '') {
      alert('กรุณากรอกข้อมูลให้ครบ');
    } else {
      login_sentApi();
    }
  }

  async function login_sentApi() {
    let hash_pass;
    await sha256(password).then(hash => {
      hash_pass = hash;
    });
    await axios
      .post('http://10.0.2.2:3001/driver/login_driver', {
        email: email,
        password: hash_pass,
      })
      .then(res => setitem(res));
  }

  async function setitem(res) {
    result = res.data;
    if (result.status == 0) {
      //emai,pass ไม่ตรง
      alert('กรุณากรอกข้อมูลให้ถูกต้อง');
    } else {
      await AsyncStorage.setItem('@datalogin', email); //เก็บเช้า local storage
      await AsyncStorage.setItem('@dataloginId', result.driver_id.toString());
      await AsyncStorage.setItem('@dataloginName', result.name);
      navigation.navigate('Homedriver');
    }
  }

  return (
    <ImageBackground
      source={require('../images/loginBg.png')}
      style={{width: '100%', height: '100%'}}>
      <View style={styles.title}>
        <Text style={styles.Texttitle}> PickVan</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.TextInput}
            placeholder="กรอกอีเมล์"
            placeholderTextColor="#8C8C8C"
            onChangeText={email => setEmail(email)} //รับ email แล้วส่งไป setEmail
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.TextInput}
            placeholder="กรอกรหัสผ่าน"
            placeholderTextColor="#8C8C8C"
            secureTextEntry={true}
            onChangeText={password => setPassword(password)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => checkLogin()} style={styles.button}>
            <Text style={styles.buttonText}> ลงชื่อเข้าใช้</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Texttitle: {
    marginTop: 170,
    fontSize: 45,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 5,
  },

  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#FEB5A6',
    width: '100%',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonRegister: {
    marginTop: 5,
    borderColor: 'white',
    borderWidth: 2,
    width: '100%',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonRegisterText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Login;