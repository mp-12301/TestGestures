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
// import ImageZoom from './src/index'
import ImageZoom, { getImageZoomParams } from './src/new-image-zoom/index'
// import ImageViewer from './src/image-viewer/index';

import ImageViewer from 'react-native-image-zoom-viewer';

import FastImage from 'react-native-fast-image'

import PageViewer, { usePageViewer } from './src/new-image-viewer/index'

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

const ModalComponent = ({
  parentImageZoomParams,
  isVisible,
  imageUrls,
  positionX,
  handleHorizontalOuterRangeOffset,
  handleResponderRelease,
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
      <PageViewer 
        imageUrls={imageUrls}
        positionX={positionX}
        handleHorizontalOuterRangeOffset={handleHorizontalOuterRangeOffset}
        handleResponderRelease={handleResponderRelease}
        parentImageZoomParams={parentImageZoomParams}
      />
    </Modal>
  )
}

const App = () => {
  const [show, setShow] = useState(false)

  const {
    positionX,
    handleHorizontalOuterRangeOffset,
    handleResponderRelease,
  } = usePageViewer({
    imageUrls: images,
    width: Dimensions.get('window').width,
  })

  const imageZoomParams = getImageZoomParams({
    cropWidth: Dimensions.get('window').width,
    cropHeight: Dimensions.get('window').height,
    imageWidth: 200,
    imageHeight: 200,
    onPinchStart: () => {
      setShow(true)
    },
    responderRelease: handleResponderRelease,
    horizontalOuterRangeOffset: handleHorizontalOuterRangeOffset
  })

  return <View style={styles.container}>
            {/* <Modal visible={true} transparent={true}>
                <ImageViewer imageUrls={images}/>
            </Modal> */}
    <View
      style={{
        width:'100%',
        height: 200
      }}
      {...imageZoomParams.imagePanResponder.panHandlers}
    >
      <FastImage style={{width:'100%', height:200}}
        source={{uri:'https://i.picsum.photos/id/590/200/300.jpg?hmac=rMKCd22eXuQjtVujiifOrJzm-dBuhO8blicB93xN4y4'}}
      />
    </View>

    <ModalComponent 
      isVisible={show}
      parentImageZoomParams={imageZoomParams}
      imageUrls={images}
      positionX={positionX}
      handleHorizontalOuterRangeOffset={handleHorizontalOuterRangeOffset}
      handleResponderRelease={handleResponderRelease}
    />

    
    {/* <ImageZoom 
      parentImageZoomParams={imageZoomParams}
    >

    </ImageZoom> */}

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
