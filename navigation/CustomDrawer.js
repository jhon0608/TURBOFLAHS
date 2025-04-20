import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import app from '../firebaseConfig';

export default function CustomDrawer(props) {
  const { user, logout } = useContext(AuthContext);
  const [photoUrl, setPhotoUrl] = useState(null);
  const db = getFirestore(app);

  useFocusEffect(
    React.useCallback(() => {
      const cargarImagen = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'usuarios', user.uid));
          if (docSnap.exists() && docSnap.data().foto) {
            setPhotoUrl(docSnap.data().foto);
            console.log('✅ Foto actualizada desde Firestore');
          } else {
            console.log('⚠️ No se encontró la imagen en Firestore');
          }
        } catch (error) {
          console.log('❌ Error obteniendo la imagen:', error);
        }
      };
      if (user?.uid) {
        cargarImagen();
      }
    }, [user])
  );

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#f5f5f5' }}
      >
        <View style={styles.userInfo}>
          <Image
            source={
              photoUrl
                ? { uri: photoUrl }
                : require('../assets/img/perfil.png')
            }
            style={styles.profileImg}
          />
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.mode}>Modo pasajero</Text>
        </View>

        <View style={styles.drawerContent}>
          <View style={{ height: 40 }} />
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <TouchableOpacity onPress={logout} style={styles.logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  mode: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  logout: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutText: {
    fontWeight: 'bold',
    color: 'red',
  },
});
