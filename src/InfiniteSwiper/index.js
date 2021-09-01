import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'

import ImageZoom, { getImageZoomParams } from './PagingZoomItem'
import PageViewer, { usePageViewer } from './PagingZoomViewer'
import Paging from './Paging'

const crossIcon = require('./close-icon.jpeg')

const InfiniteSwiper = ({
  images = [],
  pagingStyle,
  pagingWidth,
  pagingHeight,
  onIndexChanged,
  loop
}) => {
  const [show, setShow] = useState(false)
  const [page, setPage] = useState(0)

  const {
    positionX,
    handleHorizontalOuterRangeOffset,
    handleResponderRelease,
  } = usePageViewer({
    imageUrls: images,
    width: Dimensions.get('window').width,
    currentPage: page + 1,
  })

  const cropWidth = Dimensions.get('window').width
  const cropHeight = Dimensions.get('window').height
  const imageWidth = cropWidth
  const imageHeight = 300

  const imageZoomParams = getImageZoomParams({
    cropWidth,
    cropHeight,
    imageWidth,
    imageHeight,
    onPinchStart: () => {
      setShow(true)
    },
    responderRelease: handleResponderRelease,
    horizontalOuterRangeOffset: handleHorizontalOuterRangeOffset,
  })

  return <View style={styles.container}>
    <View
      style={pagingStyle}
      {...imageZoomParams.imagePanResponder.panHandlers}
    >
      <Paging 
        loop={loop}
        width={pagingWidth}
        height={pagingHeight}
        style={pagingStyle}
        onIndexChanged={(page) => {
          setPage(page)
          onIndexChanged(page)
        }}
      >
        { images.map((image, i) => {
          return (
            <FastImage
              key={i}
              style={{width: pagingWidth, height: pagingHeight}}
              source={{uri: image.url}}
            />
          )
        }) }
      </Paging>
    </View>

    {/* <Text>Page {page + 1}</Text> */}
    
    <Modal 
      style={{margin: 0}} 
      onDismiss={() => {
        imageZoomParams.resetScale()
      }}
      isVisible={show}
      backdropColor="#FFFFFF"
      backdropOpacity={1}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
    >
      <TouchableOpacity onPress={() => setShow(false)} style={{zIndex: 10, position: 'absolute', top: 60, left: 20 }}>
        <FastImage source={crossIcon} style={{width: 30, height: 30}} />
      </TouchableOpacity >
      <PageViewer 
        imageUrls={images}
        positionX={positionX}
      >
        { images.map((image, i) => {
          return (
            <ImageZoom
              key={i}
              cropWidth={cropWidth}
              cropHeight={cropHeight}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              responderRelease={handleResponderRelease}
              horizontalOuterRangeOffset={handleHorizontalOuterRangeOffset}
              parentImageZoomParams={i === page ? imageZoomParams : null}
            >
              <FastImage
                style={{width: imageWidth, height: imageHeight}}
                source={{uri: image.url}}
              />
            </ImageZoom>
          )
        })}
      </PageViewer>
    </Modal>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  viewPager: {
    width: '100%',
    height: 300,
  }
})

export default InfiniteSwiper