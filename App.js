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
import { State, PinchGestureHandler, PanGestureHandler } from 'react-native-gesture-handler'
import PagerView from 'react-native-pager-view'
import FastImage from 'react-native'

import Modal from 'react-native-modal'

import Paging from './Paging'

const windowWidth = Dimensions.get('window').width

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)

const PinchComponent = ({
  parentOnZoomEvent,
  parentHandleHandleStateChange,
  parentScale,
  isCurrentPage,
  uri,
  pagerViewRef,

}) => {
  const [pointerEvents, setPointerEvents] = useState('auto')
  // Pinch
  const pinchRef = useRef(null)
  const baseScale = useRef(new Animated.Value(1)).current
  const pinchScale = useRef(new Animated.Value(1)).current
  const scale = useRef(Animated.multiply(baseScale, pinchScale)).current
  let lastScale = useRef(1)
  const onZoomEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale }}],
    { 
      useNativeDriver: true,
      listener: (event) => {

      }
    }
  )
  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {

      lastScale.current *= event.nativeEvent.scale
      baseScale.setValue(lastScale.current)
      pinchScale.setValue(1)
      // const limit = (Math.abs((lastScale.current * windowWidth) - windowWidth) / 2) / lastScale.current

      // translateX.interpolate({
      //   inputRange: [-limit, limit],
      //   outputRange: [-limit, limit],
      //   extrapolateLeft: 'clamp',
      //   extrapolateRight: 'clamp'
      // })
      // console.log('scale', lastScale.current)
      // console.log('originalWidth', windowWidth, 'ScaledWidth', lastScale.current * windowWidth, 'difference', lastScale.current * windowWidth - windowWidth)
      // console.log(-Math.abs((lastScale.current * windowWidth) - windowWidth) / 4, Math.abs((lastScale.current * windowWidth) - windowWidth) / 4)

      // Animated.spring(baseScale, {
      //   toValue: 1,
      //   useNativeDriver: true
      // }).start()


      // console.log('lastScale', lastScale, 'enablePan', enablePan)
      // if (lastScale.current <= 1) {
      //   setActiveOffsetX([0, -1])
      // } else if (lastScale.current > 1) {
      //   setActiveOffsetX([1, 1])
      // }
      // Animated.spring(scale, {
      //   toValue: 1,
      //   useNativeDriver: true
      // }).start()
    }
  }

  // Pan
  const panRef = useRef(null)
  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current
  const lastOffset = useRef({ x: 0, y: 0})
  // const onGestureEvent = Animated.event(
  //   [
  //     {
  //       nativeEvent: {
  //         translationX: translateX,
  //         translationY: translateY,
  //       },
  //     },
  //   ],
  //   { 
  //     listener: (e) => {
  //       // console.log(lastOffset.current.x + e.nativeEvent.translationX, windowWidth, lastScale.current * windowWidth)
  //       // console.log('limit', ((Math.abs((lastScale.current * windowWidth) - windowWidth) / 2)))
  //       // console.log(e.nativeEvent)

  //       // console.log((lastOffset.current.x + e.nativeEvent.translationX))
  //     },
  //     useNativeDriver: true
  //   }
  // );

  const onGestureEvent = (event) => {
    // const limit = (Math.abs((lastScale.current * windowWidth) - windowWidth) / 2) / lastScale.current
    // const currentX = Math.abs(event.nativeEvent.translationX + lastOffset.current.x)

    // const limit = (((lastScale.current * windowWidth) - windowWidth) / 2) / lastScale.current
    // const currentX = event.nativeEvent.translationX + lastOffset.current.x
    // if (Math.abs(limit) <= Math.abs(currentX)) {
    //   if (currentX <= 0) {
    //     if (pointerEvents === 'auto') {
    //       setPointerEvents('none')
    //     }
    //   } else {
    //     console.log('disable for prev page')
    //   }
    // } else {
    //   translateX.setValue(event.nativeEvent.translationX)
    // }

    translateX.setValue(event.nativeEvent.translationX)
    translateY.setValue(event.nativeEvent.translationY)
  }
  const onPanHandlerStateChange = (event) => {
    // const limit = (((lastScale.current * windowWidth) - windowWidth) / 2) / lastScale.current
    // const currentX = event.nativeEvent.translationX + lastOffset.current.x

    // if (Math.abs(limit) <= Math.abs(currentX)) {
    //   lastOffset.current.x = currentX <= 0 ? -limit : limit;
    // } else {
    //   lastOffset.current.x += event.nativeEvent.translationX
    // }

    lastOffset.current.x += event.nativeEvent.translationX
    lastOffset.current.y += event.nativeEvent.translationY
    translateX.setOffset(lastOffset.current.x)
    translateX.setValue(0)
    translateY.setOffset(lastOffset.current.y)
    translateY.setValue(0)
    // console.log((lastOffset.current.x + event.nativeEvent.translationX))
    // if (event.nativeEvent.oldState === State.ACTIVE) { 
    //   const limit = Math.abs((lastScale.current * windowWidth) - windowWidth) / 2
    //   const movement = lastOffset.current.x * lastScale.current

    //   if (limit <= Math.abs(movement)) {
    //     // setActiveOffsetX(movement >= 0 ? 1 : -1)
    //   } else {
    //     // setActiveOffsetX(0)
    //   }
    // }
  }

  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={panRef}
      onGestureEvent={isCurrentPage ? parentOnZoomEvent : onZoomEvent}
      onHandlerStateChange={isCurrentPage ? parentHandleHandleStateChange : onPinchHandlerStateChange}
    >
      <Animated.View pointerEvents={pointerEvents} style={{width: windowWidth, height: 300}}>
        <PanGestureHandler
          ref={panRef}
          onGestureEvent={onGestureEvent}
          simultaneousHandlers={pagerViewRef}
          onHandlerStateChange={onPanHandlerStateChange}
        >
          <Animated.Image
            source={{
              uri: uri
            }}
            style={{
              width: windowWidth,
              height: 300,
              transform: [{perspective: 200}, { scale: isCurrentPage ? parentScale : scale }, { translateX: translateX }, { translateY: translateY }]
            }}
            resizeMode='cover'
          />
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  )
}

const ModalComponent = ({
  parentOnZoomEvent,
  parentHandleHandleStateChange,
  parentScale,
  onClose,
  position,
  pagerViewRef,
}) => {

  return (
    <Modal 
      style={{margin: 0}} 
      isVisible={true}
      backdropColor="#FFFFFF"
      backdropOpacity={1}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
    >
      <TouchableOpacity style={{
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 2000,
      }}
        onPress={onClose}
      >
        <Text style={{fontSize: 24}}>X</Text>
      </TouchableOpacity>
      <PagerView 
        style={styles.viewPager}
        initialPage={position}
      >
        <View style={styles.viewPagerModalItem} key={1}>
          <PinchComponent 
            parentHandleHandleStateChange={parentHandleHandleStateChange}
            parentOnZoomEvent={parentOnZoomEvent}
            parentScale={parentScale}
            pagerViewRef={pagerViewRef}
            isCurrentPage={position + 1 === 1}
            uri={'https://i.picsum.photos/id/590/200/300.jpg?hmac=rMKCd22eXuQjtVujiifOrJzm-dBuhO8blicB93xN4y4'}
          />
        </View>

        <View  style={styles.viewPagerModalItem} key={2}>
          <PinchComponent 
            parentHandleHandleStateChange={parentHandleHandleStateChange}
            parentOnZoomEvent={parentOnZoomEvent}
            parentScale={parentScale}
            pagerViewRef={pagerViewRef}
            isCurrentPage={position + 1 === 2}
            uri={'https://i.picsum.photos/id/1022/6000/3376.jpg?hmac=FBA9Qbec8NfDlxj8xLhV9k3DQEKEc-3zxkQM-hmfcy0'}
          />
        </View>

        <View  style={styles.viewPagerModalItem} key={3}>
          <PinchComponent 
            parentHandleHandleStateChange={parentHandleHandleStateChange}
            parentOnZoomEvent={parentOnZoomEvent}
            parentScale={parentScale}
            pagerViewRef={pagerViewRef}
            isCurrentPage={position + 1 === 3}
            uri={'https://i.picsum.photos/id/1023/3955/2094.jpg?hmac=AW_7mARdoPWuI7sr6SG8t-2fScyyewuNscwMWtQRawU'}
          />
        </View>
      </PagerView>
    </Modal>
  )
}

const App = () => {

  const [show, setShow] = useState(false)
  const [page, setPage] = useState(0)

  const pagerViewRef = useRef(null)

  // Pinch
  const baseScale = new Animated.Value(1)
  const pinchScale = new Animated.Value(1)
  const scale = Animated.multiply(baseScale, pinchScale)
  let lastScale = 1
  const onZoomEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale }}],
    { useNativeDriver: true }
  )
  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setShow(true)
    }
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale *= event.nativeEvent.scale
      baseScale.setValue(lastScale)
      pinchScale.setValue(1)
      // Animated.spring(scale, {
      //   toValue: 1,
      //   useNativeDriver: true
      // }).start()
    }
  }

  return <View style={styles.container}>

    <View style={{
      flex: 1,
      backgroundColor: 'lightblue',
      padding: 10
    }}>
      <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur luctus magna vel 
        eleifend ultricies. Suspendisse varius erat nunc, vel gravida nulla vulputate sagittis. Integer 
        congue turpis eu massa faucibus, a ultrices dolor dictum. Nunc egestas dolor eget mattis pulvinar. 
        Donec vel dolor eu velit pellentesque finibus. Vivamus enim elit, euismod non varius non, ornare nec mauris. 
        Duis dictum tellus mi, non eleifend ante sagittis eu. Maecenas scelerisque 
        sed quam eu eleifend.
      </Text>
    </View>

    <View style={{
      height: 300,
      width: windowWidth
    }}>
      <PinchGestureHandler
        onGestureEvent={onZoomEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
      >
        <Animated.View style={styles.viewPager}>
          <PagerView 
            ref={pagerViewRef}
            style={styles.viewPager}
            initialPage={0}
            onPageSelected={(e) => {
              setPage(e.nativeEvent.position)
            }}
          >
            <View key={1}>
              <Image
                source={{
                  uri:
                    'https://i.picsum.photos/id/590/200/300.jpg?hmac=rMKCd22eXuQjtVujiifOrJzm-dBuhO8blicB93xN4y4'
                }}
                style={{
                  width: windowWidth,
                  height: 300,
                }}
                resizeMode='cover'
              />
            </View>

            <View key={2}>
              <Image
                source={{
                  uri:
                    'https://i.picsum.photos/id/1022/6000/3376.jpg?hmac=FBA9Qbec8NfDlxj8xLhV9k3DQEKEc-3zxkQM-hmfcy0'
                }}
                style={{
                  width: windowWidth,
                  height: 300,
                }}
                resizeMode='cover'
              />
            </View>

            <View key={3}>
              <Image
                source={{
                  uri:
                    'https://i.picsum.photos/id/1023/3955/2094.jpg?hmac=AW_7mARdoPWuI7sr6SG8t-2fScyyewuNscwMWtQRawU'
                }}
                style={{
                  width: windowWidth,
                  height: 300,
                }}
                resizeMode='cover'
              />
            </View>
          </PagerView>
          {show && 
            <ModalComponent 
              pagerViewRef={pagerViewRef}
              onClose={() => setShow(false)}
              parentOnZoomEvent={onZoomEvent}
              parentHandleHandleStateChange={onPinchHandlerStateChange}
              parentScale={scale}
              position={page}
            />
          }
        </Animated.View>
      </PinchGestureHandler>
    </View>
    
    <View style={{
      flex: 1,
      backgroundColor: 'lightblue',
      padding: 10
    }}>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur luctus magna vel eleifend 
        ultricies. Suspendisse varius erat nunc, vel gravida nulla vulputate sagittis. Integer congue turpis eu 
        massa faucibus, a ultrices dolor dictum. Nunc egestas dolor eget mattis pulvinar. Donec vel dolor eu velit 
        pellentesque finibus. Vivamus enim elit, euismod non varius non, ornare nec mauris. Duis dictum tellus mi, 
        non eleifend ante sagittis eu. Maecenas scelerisque sed quam eu eleifend.
      </Text>
    </View>

  </View>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 50,
  },
  viewPager: {
    flex: 1,
  },
  viewPagerModalItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
});

export default App;
