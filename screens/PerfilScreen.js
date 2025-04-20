import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; // ✅ navegación
import { AuthContext } from '../context/AuthContext';
import app from '../firebaseConfig';

const PerfilScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation(); // ✅ aquí va
  const [imageUrl, setImageUrl] = useState(null);
  const auth = getAuth(app);
  const storage = getStorage(app);
  const db = getFirestore(app);

  useEffect(() => {
    const cargarImagen = async () => {
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().foto) {
        setImageUrl(docSnap.data().foto);
      }
    };
    cargarImagen();
  }, []);

  const subirImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Necesitas permitir acceso a la galería');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const imagen = await fetch(resultado.assets[0].uri);
      const blob = await imagen.blob();

      const nombreArchivo = `perfil_${user.uid}_${Date.now()}.jpg`; // 🔁 evita cache
      const storageRef = ref(storage, `perfiles/${nombreArchivo}`);

      await uploadBytes(storageRef, blob);
      const urlDescarga = await getDownloadURL(storageRef);

      const docRef = doc(db, 'usuarios', user.uid);
      await updateDoc(docRef, {
        foto: urlDescarga,
      });

      navigation.goBack(); // ✅ esto actualiza el Drawer
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <Image
        source={imageUrl ? { uri: imageUrl } : require('../assets/img/perfil.png')}
        style={styles.image}
      />
      <Button title="Cambiar imagen de perfil" onPress={subirImagen} />
      <Text style={styles.email}>Email: {user?.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  email: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default PerfilScreen;
