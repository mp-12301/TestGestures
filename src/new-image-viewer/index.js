import React, { useRef } from 'react'

import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native'

import ImageZoom from '../new-image-zoom/index'
import FastImage from 'react-native-fast-image'

const useNativeDriver = true
const flipThreshold = 80
const pageAnimateTime = 100

export const usePageViewer = ({
  imageUrls,
  width
}) => {
  const pageViewerPropsRef = useRef({
    standardPositionX: 0,
    positionXNumber: 0,
    positionX: new Animated.Value(0),
    currentIndex: 0,
  })

  const jumpToPage = (index) => {
    pageViewerPropsRef.current.positionXNumber = width * index
    pageViewerPropsRef.current.positionX.setValue(pageViewerPropsRef.current.positionXNumber)
  }

  const handleHorizontalOuterRangeOffset = (offsetX) => {
    pageViewerPropsRef.current.positionXNumber = pageViewerPropsRef.current.standardPositionX + offsetX
    pageViewerPropsRef.current.positionX.setValue(pageViewerPropsRef.current.positionXNumber)
  }

  const handleResponderRelease = (vx) => {
    console.log(vx)
    const vxRTL = vx
    const isLeftMove = pageViewerPropsRef.current.positionXNumber
        - pageViewerPropsRef.current.standardPositionX > flipThreshold
    const isRightMove = pageViewerPropsRef.current.positionXNumber
        - pageViewerPropsRef.current.standardPositionX < -flipThreshold

    if (vxRTL > 0.7) {
      goBack()
    } else if (vxRTL < -0.7) {
      goNext()
    } else if (isLeftMove) {
      goBack()
    } else if (isRightMove) {
      goNext()
    } else {
      resetPosition()
    }
  }

  const goBack = () => {
    if (pageViewerPropsRef.current.currentIndex === 0) {
      resetPosition()
      return
    }

    pageViewerPropsRef.current.positionXNumber = pageViewerPropsRef.current.standardPositionX + width
    pageViewerPropsRef.current.standardPositionX = pageViewerPropsRef.current.positionXNumber
  
    Animated.timing(pageViewerPropsRef.current.positionX, {
      toValue: pageViewerPropsRef.current.positionXNumber,
      duration: pageAnimateTime,
      useNativeDriver: useNativeDriver
    }).start()

    pageViewerPropsRef.current.currentIndex = pageViewerPropsRef.current.currentIndex - 1
  }

  const goNext = () => {
    if (pageViewerPropsRef.current.currentIndex === imageUrls.length - 1) {
      resetPosition()
      return
    }

    pageViewerPropsRef.current.positionXNumber = pageViewerPropsRef.current.standardPositionX - width
    pageViewerPropsRef.current.standardPositionX = pageViewerPropsRef.current.positionXNumber
    Animated.timing(pageViewerPropsRef.current.positionX, {
      toValue: pageViewerPropsRef.current.positionXNumber,
      duration: pageAnimateTime,
      useNativeDriver: useNativeDriver
    }).start()

    pageViewerPropsRef.current.currentIndex = pageViewerPropsRef.current.currentIndex + 1
  };

  const resetPosition = () => {
    pageViewerPropsRef.current.positionXNumber = pageViewerPropsRef.current.standardPositionX 
    Animated.timing(pageViewerPropsRef.current.positionX, {
      toValue: pageViewerPropsRef.current.standardPositionX,
      duration: 150,
      useNativeDriver: !!useNativeDriver
    }).start()
  }
  return {
    positionX: pageViewerPropsRef.current.positionX,
    handleHorizontalOuterRangeOffset,
    handleResponderRelease
  }
}

export const PageViewer = ({
  imageUrls = [],
  positionX,
  handleResponderRelease,
  handleHorizontalOuterRangeOffset,
  parentImageZoomParams,
}) => {
  const width = Dimensions.get('window').width

  const cropWidth = Dimensions.get('window').width
  const cropHeight = Dimensions.get('window').height

  const renderContent = () => {
    return imageUrls.map((imageUrl, i) => {
      return <ImageZoom
        key={i}
        cropWidth={cropWidth}
        cropHeight={cropHeight}
        imageWidth={200}
        imageHeight={200}
        responderRelease={handleResponderRelease}
        horizontalOuterRangeOffset={handleHorizontalOuterRangeOffset}
        parentImageZoomParams={i === 0 ? parentImageZoomParams : null}
      >
        <FastImage
          style={{width: 200, height: 200}}
          source={{uri: imageUrl.url}}
        />
      </ImageZoom>
    })
  }

  return (
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
      }}
    >
        <Animated.View
          style={{
            transform: [{
              translateX: positionX,
            }],
            width: width * imageUrls.length,
            flexDirection: 'row', 
            alignItems: 'center'
          }}
        >
          { renderContent() }
        </Animated.View>
    </View>
  )
}

export default PageViewer