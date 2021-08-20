import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';


import Modal from 'react-native-modal'
import ImageZoom from './src/index'
import ImageZoom2, { getImageZoomParams } from './src/new-image-zoom/index'
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image'

const ModalComponent = ({
  parentImageZoomParams,
  isVisible,
}) => {

  return (
    <Modal 
      style={{margin: 0}} 
      isVisible={isVisible}
      backdropColor="#FFFFFF"
      backdropOpacity={1}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
    >
      <ImageZoom2
        parentImageZoomParams={parentImageZoomParams}
      >
        <FastImage style={{width:200, height:200}}
            source={{uri:'https://i.picsum.photos/id/1022/6000/3376.jpg?hmac=FBA9Qbec8NfDlxj8xLhV9k3DQEKEc-3zxkQM-hmfcy0'}}
        />
      </ImageZoom2>
    </Modal>
  )
}

const App = () => {
  const images = [{
    // Simplest usage.
    url: 'https://i.picsum.photos/id/590/200/300.jpg?hmac=rMKCd22eXuQjtVujiifOrJzm-dBuhO8blicB93xN4y4',

    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance

    // You can pass props to <Image />.
    props: {
        // headers: ...
    }
    }, {
      // Simplest usage.
      url: 'https://i.picsum.photos/id/1022/6000/3376.jpg?hmac=FBA9Qbec8NfDlxj8xLhV9k3DQEKEc-3zxkQM-hmfcy0',

      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {
          // headers: ...
      }
    }, {
      // Simplest usage.
      url: 'https://i.picsum.photos/id/1023/3955/2094.jpg?hmac=AW_7mARdoPWuI7sr6SG8t-2fScyyewuNscwMWtQRawU',

      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {
          // headers: ...
      }
  }]

  const [show, setShow] = useState(false)
  const imageZoomParams = getImageZoomParams({
    cropWidth: Dimensions.get('window').width,
    cropHeight: Dimensions.get('window').height,
    imageWidth: 200,
    imageHeight: 200,
    onPinchStart: () => {
      setShow(true)
    },
  })

  return <View style={styles.container}>

    <View
      style={{
        width: 200,
        height: 200
      }}
      {...imageZoomParams.imagePanResponder.panHandlers}
    >
      <FastImage style={{width:200, height:200}}
        source={{uri:'https://i.picsum.photos/id/1022/6000/3376.jpg?hmac=FBA9Qbec8NfDlxj8xLhV9k3DQEKEc-3zxkQM-hmfcy0'}}
      />
    </View>

    <ModalComponent 
      isVisible={show}
      parentImageZoomParams={imageZoomParams}
    />

    
    {/* <ImageZoom2 
      parentImageZoomParams={imageZoomParams}
    >

    </ImageZoom2> */}
  </View>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
