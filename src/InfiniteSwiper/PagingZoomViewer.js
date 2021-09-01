import React, { useEffect, useRef } from 'react'

import {
  View,
  Animated,
  Dimensions,
} from 'react-native'

const useNativeDriver = true
const flipThreshold = 80
const pageAnimateTime = 100

export const usePageViewer = ({
  imageUrls,
  width,
  initialPage = 0,
  currentPage,
}) => {
  const pageViewerPropsRef = useRef({
    standardPositionX: - (initialPage + 1) * width,
    positionXNumber: - (initialPage + 1) * width,
    positionX: new Animated.Value( - (initialPage + 1) * width),
    currentIndex: initialPage + 1,
  })

  useEffect(() => {
    jumpToPage(currentPage)

  }, [currentPage])

  const jumpToPage = (index) => {
    pageViewerPropsRef.current.positionXNumber = - width * index
    pageViewerPropsRef.standardPositionX = pageViewerPropsRef.current.positionXNumber
    pageViewerPropsRef.current.positionX.setValue(pageViewerPropsRef.current.positionXNumber)
  }

  const handleHorizontalOuterRangeOffset = (offsetX) => {
    console.log('horizontal', offsetX)
    pageViewerPropsRef.current.positionXNumber = pageViewerPropsRef.current.standardPositionX + offsetX
    pageViewerPropsRef.current.positionX.setValue(pageViewerPropsRef.current.positionXNumber)
  }

  const handleResponderRelease = (vx) => {
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
    // if (pageViewerPropsRef.current.currentIndex === 0) {
    //   resetPosition()
    //   return
    // }

    pageViewerPropsRef.current.positionXNumber = pageViewerPropsRef.current.standardPositionX + width
    pageViewerPropsRef.current.standardPositionX = pageViewerPropsRef.current.positionXNumber
  
    Animated.timing(pageViewerPropsRef.current.positionX, {
      toValue: pageViewerPropsRef.current.positionXNumber,
      duration: pageAnimateTime,
      useNativeDriver: useNativeDriver
    }).start(
      () => {
        if (pageViewerPropsRef.current.currentIndex === 0) {
          pageViewerPropsRef.current.positionXNumber = - (imageUrls.length) * width
          pageViewerPropsRef.current.currentIndex = imageUrls.length
          pageViewerPropsRef.current.standardPositionX = pageViewerPropsRef.current.positionXNumber
          pageViewerPropsRef.current.positionX.setValue(pageViewerPropsRef.current.positionXNumber)
        }
      }
    )

    pageViewerPropsRef.current.currentIndex = pageViewerPropsRef.current.currentIndex - 1
  }

  const goNext = () => {
    // if (currentIndex === imageUrls.length - 1 + 4) {
    //   resetPosition()
    //   return
    // }

    pageViewerPropsRef.current.positionXNumber = pageViewerPropsRef.current.standardPositionX - width
    pageViewerPropsRef.current.standardPositionX = pageViewerPropsRef.current.positionXNumber
    Animated.timing(pageViewerPropsRef.current.positionX, {
      toValue: pageViewerPropsRef.current.positionXNumber,
      duration: pageAnimateTime,
      useNativeDriver: useNativeDriver
    }).start(
      () => {
        if (pageViewerPropsRef.current.currentIndex === imageUrls.length + 1) {
          pageViewerPropsRef.current.positionXNumber = - width
          pageViewerPropsRef.current.currentIndex = 1
          pageViewerPropsRef.current.standardPositionX = pageViewerPropsRef.current.positionXNumber
          pageViewerPropsRef.current.positionX.setValue(pageViewerPropsRef.current.positionXNumber)
        }
      }
    )

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
  children,
  loop = true,
}) => {

  if (loop && children.length) {

  }

  const imageZoomElements = (loop && children.length) > 1 ? 
      [
        children[children.length - 1], 
        ...children, 
        children[0], 
      ] : 
        children

  return (
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
      }}
    >

<Animated.View style={{ zIndex: 9 }}>
        <Animated.View
          style={{
            transform: [{
              translateX: positionX,
            }],
            width: Dimensions.get('window').width * imageZoomElements.length,
            flexDirection: 'row', 
            alignItems: 'center'
          }}
        >
          { imageZoomElements.map((el, i) => <View key={i}>{el}</View>) }
        </Animated.View>
        </Animated.View>
    </View>
  )
}

export default PageViewer