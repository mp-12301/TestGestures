import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Animated,
  TouchableOpacity,
  Image, 
  Dimensions,
  Modal,
} from 'react-native';

import InfiniteSwiper from './src/InfiniteSwiper'
// import ImageViewer from 'react-native-image-zoom-viewer'
import FastImage from 'react-native-fast-image'
import ImageViewer from './src/image-viewer/index'
import PagingZoomItem from './src/InfiniteSwiper/PagingZoomItem'
const App = () => {
  const images = [{
      url: 'https://i.picsum.photos/id/590/200/300.jpg?hmac=rMKCd22eXuQjtVujiifOrJzm-dBuhO8blicB93xN4y4',
    }, {
      url: 'https://i.picsum.photos/id/1022/6000/3376.jpg?hmac=FBA9Qbec8NfDlxj8xLhV9k3DQEKEc-3zxkQM-hmfcy0',
    }, {
      url: 'https://i.picsum.photos/id/1023/3955/2094.jpg?hmac=AW_7mARdoPWuI7sr6SG8t-2fScyyewuNscwMWtQRawU',
  }]

  return (
    <View style={styles.container}>

      <InfiniteSwiper 
        images={images}
        pagingStyle={styles.container}
        pagingWidth={300}
        pagingHeight={300}
        enablePressAreas={false}
        onIndexChanged={() => {}}
        loop
      /> 

      {/* <PagingZoomItem
        cropWidth={400}
        cropHeight={400}
        imageWidth={400}
        imageHeight={400}
      >
        <FastImage 
          style={{width: 400, height: 400}}
          source={{uri: 'https://i.picsum.photos/id/590/200/300.jpg?hmac=rMKCd22eXuQjtVujiifOrJzm-dBuhO8blicB93xN4y4'}}
        />
        <Text>derp</Text>
      </PagingZoomItem> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default App;
