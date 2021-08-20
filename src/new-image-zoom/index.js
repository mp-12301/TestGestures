import React, { useRef } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native'

const DEFAULT_IMAGE_ZOOM_CONF = {
  lastPositionX: null,
  positionX: 0,
  animatedPositionX: new Animated.Value(0),
  lastPositionY: null,
  positionY: 0,
  animatedPositionY: new Animated.Value(0),
  scale: 1,
  animatedScale: new Animated.Value(1),
  zoomLastDistance: null,
  zoomCurrentDistance: 0,
  lastTouchStartTime: 0,
  horizontalWholeOuterCounter: 0,
  horizontalWholeCounter: 0,
  verticalWholeCounter: 0,
  centerDiffX: 0,
  centerDiffY: 0,
  singleClickTimeout: undefined,
  longPressTimeout: undefined,
  lastClicktime: 0,
  doubleClickX: 0,
  doubleClickY: 0,
  isDoubleClick: false,
  isLongPress: false,
  isHorizontalWrap: false,
  imagePanResponder: null
}


// TODO didCenterOnChange?
export const getImageZoomParams = ({
  onPinchStart = () => {},
  onStartShouldSetPanResponder = () => true, 
  onPanResponderTerminationRequest = () => false,
  onMoveShouldSetPanResponder = () => {},
  cropWidth = 100,
  cropHeight = 100,
  onLongPress = () => {},
  longPressTime = 800,
  doubleClickInterval = 175,
  onDoubleClick = () => {},
  enableDoubleClickZoom = true,
  useNativeDriver = true,
  panToMove = true,
  imageHeight = 100,
  imageWidth = 100,
  maxOverflow = 100,
  horizontalOuterRangeOffset = () => {},
  pinchToZoom = true,
  minScale = 0.6,
  maxScale = 10,
  clickDistance = 10,
  onClick = () => {},
  responderRelease = () => {},
  enableCenterFocus = true,
  useHardwareTextureAndroid = true,
}) => {

  const imageZoomConf = useRef({
    ...DEFAULT_IMAGE_ZOOM_CONF
  })
  const imageZoomConfRef = imageZoomConf.current

  const imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder,
    onPanResponderTerminationRequest,
    onMoveShouldSetPanResponder,

    onPanResponderGrant: (evt) => {
      imageZoomConfRef.lastPositionX = null
      imageZoomConfRef.lastPositionY = null
      imageZoomConfRef.zoomLastDistance = null
      imageZoomConfRef.horizontalWholeCounter = 0
      imageZoomConfRef.verticalWholeCounter = 0
      imageZoomConfRef.lastTouchStartTime = new Date().getTime()
      imageZoomConfRef.isDoubleClick = false
      imageZoomConfRef.isLongPress = false
      imageZoomConfRef.isHorizontalWrap = false

      if (imageZoomConfRef.singleClickTimeout) {
        clearTimeout(imageZoomConfRef.singleClickTimeout)
      }

      if (evt.nativeEvent.changedTouches.length > 1) {
        onPinchStart()
        const centerX = (evt.nativeEvent.changedTouches[0].pageX + evt.nativeEvent.changedTouches[1].pageX) / 2
        imageZoomConfRef.centerDiffX = centerX - cropWidth / 2

        const centerY = (evt.nativeEvent.changedTouches[0].pageY + evt.nativeEvent.changedTouches[1].pageY) / 2
        imageZoomConfRef.centerDiffY = centerY - cropHeight / 2
      }

      if (imageZoomConfRef.longPressTimeout) {
        clearTimeout(imageZoomConfRef.longPressTimeout)
      }

      const { locationX, locationY, pageX, pageY } = evt.nativeEvent

      imageZoomConfRef.longPressTimeout = setTimeout(() => {
        imageZoomConfRef.isLongPress = true;
        if (onLongPress) {
          onLongPress({ locationX, locationY, pageX, pageY });
        }
      }, longPressTime)

      //TO DO
      // Double click logic worth having?
      if (evt.nativeEvent.changedTouches.length <= 1) {

        if (new Date().getTime() - imageZoomConfRef.lastClickTime < (doubleClickInterval || 0)) {
          imageZoomConfRef.lastClickTime = 0

          imageZoomConfRef.doubleClickX = evt.nativeEvent.changedTouches[0].pageX
          imageZoomConfRef.doubleClickY = evt.nativeEvent.changedTouches[0].pageY

          if (onDoubleClick) {
            onDoubleClick({
              locationX: evt.nativeEvent.changedTouches[0].locationX,
              locationY: evt.nativeEvent.changedTouches[0].locationY,
              pageX: imageZoomConfRef.doubleClickX,
              pageY: imageZoomConfRef.doubleClickY,
            })
          }

          clearTimeout(imageZoomConfRef.longPressTimeout)

          imageZoomConfRef.isDoubleClick = true

          if (enableDoubleClickZoom) {
            if (imageZoomConfRef.scale > 1 || imageZoomConfRef.scale < 1) {
              imageZoomConfRef.scale = 1
              imageZoomConfRef.positionX = 0
              imageZoomConfRef.positionY = 0
            } else {
              const beforeScale = imageZoomConfRef.scale
              imageZoomConfRef.scale = 2

              const diffScale = imageZoomConfRef.scale - beforeScale

              imageZoomConfRef.positionX =
                  ((cropWidth / 2 - imageZoomConfRef.doubleClickX) * diffScale) / imageZoomConfRef.scale
              imageZoomConfRef.positionY =
                  ((cropHeight / 2 - imageZoomConfRef.doubleClickY) * diffScale) / imageZoomConfRef.scale
            }
          }

          // TODO
          // this.imageDidMove('centerOn');

          Animated.parallel([
            Animated.timing(imageZoomConfRef.animatedScale, {
              toValue: imageZoomConfRef.scale,
              duration: 100,
              useNativeDriver: !!useNativeDriver,
            }),
            Animated.timing(imageZoomConfRef.animatedPositionX, {
              toValue: imageZoomConfRef.positionX,
              duration: 100,
              useNativeDriver: !!useNativeDriver,
            }),
            Animated.timing(imageZoomConfRef.animatedPositionY, {
              toValue: imageZoomConfRef.positionY,
              duration: 100,
              useNativeDriver: !!useNativeDriver,
            }),
          ]).start()
        }
      } else {
        imageZoomConfRef.lastClickTime = new Date().getTime()
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      if (imageZoomConfRef.isDoubleClick) {
        return
      }

      if (evt.nativeEvent.changedTouches.length <= 1) {
         let diffX = gestureState.dx - (imageZoomConfRef.lastPositionX || 0);
         if (imageZoomConfRef.lastPositionX === null) {
           diffX = 0;
         }
         let diffY = gestureState.dy - (imageZoomConfRef.lastPositionY || 0);
         if (imageZoomConfRef.lastPositionY === null) {
           diffY = 0;
         }
 
         imageZoomConfRef.lastPositionX = gestureState.dx;
         imageZoomConfRef.lastPositionY = gestureState.dy;
 
         imageZoomConfRef.horizontalWholeCounter += diffX;
         imageZoomConfRef.verticalWholeCounter += diffY;

         if (Math.abs(imageZoomConfRef.horizontalWholeCounter) > 5
            || Math.abs(imageZoomConfRef.verticalWholeCounter) > 5) {
          clearTimeout(imageZoomConfRef.longPressTimeout)
        }

        if (panToMove) {
          if (Math.abs(diffX) > Math.abs(diffY)) {
            imageZoomConfRef.isHorizontalWrap = true
          }

          if (imageWidth * imageZoomConfRef.scale > cropWidth) {
            if (imageZoomConfRef.horizontalWholeOuterCounter > 0) {
              if (diffX < 0) {
                if (imageZoomConfRef.horizontalWholeOuterCounter > Math.abs(diffX)) {
                  imageZoomConfRef.horizontalWholeOuterCounter += diffX
                  diffX = 0
                } else {
                  diffX += imageZoomConfRef.horizontalWholeOuterCounter
                  imageZoomConfRef.horizontalWholeOuterCounter = 0
                  if (horizontalOuterRangeOffset) {
                    horizontalOuterRangeOffset(0)
                  }
                }
              } else {
                imageZoomConfRef.horizontalWholeOuterCounter += diffX
              }
            } else if (imageZoomConfRef.horizontalWholeOuterCounter < 0) {
              if (diffX > 0) {
                if (Math.abs(imageZoomConfRef.horizontalWholeOuterCounter) > diffX) {
                  imageZoomConfRef.horizontalWholeOuterCounter += diffX
                  diffX = 0
                } else {
                  diffX += imageZoomConfRef.horizontalWholeOuterCounter
                  imageZoomConfRef.horizontalWholeOuterCounter = 0
                  if (horizontalOuterRangeOffset) {
                    horizontalOuterRangeOffset(0)
                  }
                }
              } else {
                imageZoomConfRef.horizontalWholeOuterCounter += diffX
              }
            } else {

            }

            imageZoomConfRef.positionX += diffX / imageZoomConfRef.scale;

            const horizontalMax =
                (imageWidth * imageZoomConfRef.scale - cropWidth) / 2 / imageZoomConfRef.scale
            if (imageZoomConfRef.positionX < -horizontalMax) {
              imageZoomConfRef.positionX = -horizontalMax

              imageZoomConfRef.horizontalWholeOuterCounter += -1 / 1e10
            } else if (imageZoomConfRef.positionX > horizontalMax) {
              imageZoomConfRef.positionX = horizontalMax;

              imageZoomConfRef.horizontalWholeOuterCounter += 1 / 1e10
            }
            imageZoomConfRef.animatedPositionX.setValue(imageZoomConfRef.positionX);
          } else {
            imageZoomConfRef.horizontalWholeOuterCounter += diffX
          }

          if (imageZoomConfRef.horizontalWholeOuterCounter > (maxOverflow || 0)) {
            imageZoomConfRef.horizontalWholeOuterCounter = maxOverflow || 0;
          } else if (imageZoomConfRef.horizontalWholeOuterCounter < -(maxOverflow || 0)) {
            imageZoomConfRef.horizontalWholeOuterCounter = -(maxOverflow || 0);
          }

          if (imageZoomConfRef.horizontalWholeOuterCounter !== 0) {
            if (horizontalOuterRangeOffset) {
              horizontalOuterRangeOffset(imageZoomConfRef.horizontalWholeOuterCounter);
            }
          }

          if (imageHeight * imageZoomConfRef.scale > cropHeight) {
            imageZoomConfRef.positionY += diffY / imageZoomConfRef.scale
            imageZoomConfRef.animatedPositionY.setValue(imageZoomConfRef.positionY)
          }
        }
      } else {

        if (imageZoomConfRef.longPressTimeout) {
          clearTimeout(imageZoomConfRef.longPressTimeout)

          if (pinchToZoom) {
          let minX
          let maxX
          if (evt.nativeEvent.changedTouches[0].locationX > evt.nativeEvent.changedTouches[1].locationX) {
            minX = evt.nativeEvent.changedTouches[1].pageX
            maxX = evt.nativeEvent.changedTouches[0].pageX
          } else {
            minX = evt.nativeEvent.changedTouches[0].pageX
            maxX = evt.nativeEvent.changedTouches[1].pageX
          }

          let minY
          let maxY
          if (evt.nativeEvent.changedTouches[0].locationY > evt.nativeEvent.changedTouches[1].locationY) {
            minY = evt.nativeEvent.changedTouches[1].pageY
            maxY = evt.nativeEvent.changedTouches[0].pageY
          } else {
            minY = evt.nativeEvent.changedTouches[0].pageY
            maxY = evt.nativeEvent.changedTouches[1].pageY
          }

          const widthDistance = maxX - minX
          const heightDistance = maxY - minY
          const diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance)
          imageZoomConfRef.zoomCurrentDistance = Number(diagonalDistance.toFixed(1))

          if (imageZoomConfRef.zoomLastDistance !== null) {
            const distanceDiff = (imageZoomConfRef.zoomCurrentDistance - imageZoomConfRef.zoomLastDistance) / 200
            let zoom = imageZoomConfRef.scale + distanceDiff

            if (zoom < (minScale || 0)) {
              zoom = minScale || 0
            }
            if (zoom > (maxScale || 0)) {
              zoom = maxScale || 0
            }

            const beforeScale = imageZoomConfRef.scale

            imageZoomConfRef.scale = zoom
            imageZoomConfRef.animatedScale.setValue(imageZoomConfRef.scale)

            const diffScale = imageZoomConfRef.scale - beforeScale

            imageZoomConfRef.positionX -= (imageZoomConfRef.centerDiffX * diffScale) / imageZoomConfRef.scale;
            imageZoomConfRef.positionY -= (imageZoomConfRef.centerDiffY * diffScale) / imageZoomConfRef.scale;
            imageZoomConfRef.animatedPositionX.setValue(imageZoomConfRef.positionX);
            imageZoomConfRef.animatedPositionY.setValue(imageZoomConfRef.positionY);
          }
          imageZoomConfRef.zoomLastDistance = imageZoomConfRef.zoomCurrentDistance;
          }
        }
      }

      // this.imageDidMove('onPanResponderMove');
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (imageZoomConfRef.longPressTimeout) {
        clearTimeout(imageZoomConfRef.longPressTimeout)
      }

      if (imageZoomConfRef.isDoubleClick) {
        return
      }

      if (imageZoomConfRef.isLongPress) {
        return
      }

      const moveDistance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy)
      const { locationX, locationY, pageX, pageY } = evt.nativeEvent

      if (evt.nativeEvent.changedTouches.length === 1 && moveDistance < (clickDistance || 0)) {
        imageZoomConfRef.singleClickTimeout = setTimeout(() => {
          if (onClick) {
            onClick({ locationX, locationY, pageX, pageY })
          }
        }, doubleClickInterval)
      } else {
        if (responderRelease) {
          responderRelease(gestureState.vx, this.scale);
        }

        if (enableCenterFocus && imageZoomConfRef.scale < 1) {
          imageZoomConfRef.scale = 1
          Animated.timing(imageZoomConfRef.animatedScale, {
            toValue: imageZoomConfRef.scale,
            duration: 100,
            useNativeDriver: !!useNativeDriver,
          }).start()
        }
    
        if (imageWidth * imageZoomConfRef.scale <= cropWidth) {
          imageZoomConfRef.positionX = 0
          Animated.timing(imageZoomConfRef.animatedPositionX, {
            toValue: imageZoomConfRef.positionX,
            duration: 100,
            useNativeDriver: !!useNativeDriver,
          }).start();
        }
    
        if (imageHeight * imageZoomConfRef.scale <= cropHeight) {
          imageZoomConfRef.positionY = 0
          Animated.timing(imageZoomConfRef.animatedPositionY, {
            toValue: imageZoomConfRef.positionY,
            duration: 100,
            useNativeDriver: !!useNativeDriver,
          }).start()
        }
    
        if (imageHeight * imageZoomConfRef.scale > cropHeight) {
          const verticalMax = (imageHeight * imageZoomConfRef.scale - cropHeight)
              / 2 / imageZoomConfRef.scale
          if (imageZoomConfRef.positionY < -verticalMax) {
            imageZoomConfRef.positionY = -verticalMax
          } else if (imageZoomConfRef.positionY > verticalMax) {
            imageZoomConfRef.positionY = verticalMax
          }
          Animated.timing(imageZoomConfRef.animatedPositionY, {
            toValue: imageZoomConfRef.positionY,
            duration: 100,
            useNativeDriver: !!useNativeDriver,
          }).start()
        }
    
        if (imageWidth * imageZoomConfRef.scale > cropWidth) {
          const horizontalMax = (imageWidth * imageZoomConfRef.scale - cropWidth) / 2 / imageZoomConfRef.scale;
          if (imageZoomConfRef.positionX < -horizontalMax) {
            imageZoomConfRef.positionX = -horizontalMax;
          } else if (imageZoomConfRef.positionX > horizontalMax) {
            imageZoomConfRef.positionX = horizontalMax;
          }
          Animated.timing(imageZoomConfRef.animatedPositionX, {
            toValue: imageZoomConfRef.positionX,
            duration: 100,
            useNativeDriver: !!useNativeDriver,
          }).start()
        }
    
        if (enableCenterFocus && imageZoomConfRef.scale === 1) {
          imageZoomConfRef.positionX = 0;
          imageZoomConfRef.positionY = 0;
          Animated.timing(imageZoomConfRef.animatedPositionX, {
            toValue: imageZoomConfRef.positionX,
            duration: 100,
            useNativeDriver: !!useNativeDriver,
          }).start()
          Animated.timing(imageZoomConfRef.animatedPositionY, {
            toValue: imageZoomConfRef.positionY,
            duration: 100,
            useNativeDriver: !!useNativeDriver,
          }).start()
        }
    
        imageZoomConfRef.horizontalWholeOuterCounter = 0
    
        // this.imageDidMove('onPanResponderRelease');
      }
    },
    onPanResponderTerminate: () => {

    }
  })

  const animateConf = {
    transform: [
      {
        scale: imageZoomConfRef.animatedScale,
      },
      {
        translateX: imageZoomConfRef.animatedPositionX,
      },
      {
        translateY: imageZoomConfRef.animatedPositionY,
      },
    ],
  }

  return {
    imagePanResponder,
    cropHeight,
    cropWidth,
    animateConf,
    useHardwareTextureAndroid,
    imageWidth,
    imageHeight,
  }
}

export const ImageZoom = ({
  parentImageZoomParams,
  children,
  ...props
}) => {
  const {
    imagePanResponder,
    cropHeight,
    cropWidth,
    animateConf,
    useHardwareTextureAndroid,
    imageWidth,
    imageHeight,
  } = parentImageZoomParams ? parentImageZoomParams : getImageZoomParams({
    ...props
  })

  return (
    <View 
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        width: cropWidth,
        height: cropHeight
      }}
      {...imagePanResponder.panHandlers}
    >
      <Animated.View style={animateConf} renderToHardwareTextureAndroid={useHardwareTextureAndroid}>
        <View
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  )
}

export default ImageZoom