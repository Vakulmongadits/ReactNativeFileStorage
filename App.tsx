import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
  Alert,
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData()
  }, []);

  const getData = () => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(response => {
        console.log(response);
        setData(response?.products);
      });
  }

  const downloadIOS = async (item: any) => {
    const { dirs } = RNFetchBlob.fs;

    let fileName = item?.thumbnail.split('/');
    let docName = fileName[fileName?.length - 1];

    let options = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      path: `${dirs.DocumentDir}/` + docName,
      description: 'File Download',
    };

    RNFetchBlob.config(options)
      .fetch('GET', item?.thumbnail)
      .progress({ interval: 250 }, (received, total) => {
        console.log('progress', received / total);
      })
      .then(res => {

        Alert.alert("Success", 'file is downloaded');
        console.log('The file saved to ', res.path());

      });
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={data}
        extraData={data}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }: any) => {
          console.log('item item --> ', JSON.stringify(item));
          return (
            <View
              style={{
                height: 60,
                marginStart: 16,
                marginEnd: 16,
                flexDirection: 'row',
              }}>
              <Image
                source={{ uri: item.thumbnail }}
                style={{ height: 50, width: 50 }}
              />
              <Text style={{ flex: 1, marginStart: 10, color: 'black' }}>
                {item?.title}
              </Text>
              <Text style={{ color: 'black' }} onPress={() => downloadIOS(item)}>
                Download
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
