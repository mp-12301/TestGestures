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
  uri,
  rootAnimateParams,
  pageTranslateX
}) => {
  const pinchRef = useRef(null)
  const panRef = useRef(null)

  const animateParams = rootAnimateParams ?? useAnimate({
    pageTranslateX
  })

  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={panRef}
      onGestureEvent={animateParams.onZoomEvent}
      onHandlerStateChange={animateParams.onPinchHandlerStateChange}
    >
      <Animated.View style={{width: windowWidth, height: 300}}>
        <PanGestureHandler
          ref={panRef}
          onGestureEvent={animateParams.onGestureEvent}
          simultaneousHandlers={pinchRef}
          onHandlerStateChange={animateParams.onPanHandlerStateChange}
        >
          <Animated.Image
            source={{
              uri: uri
            }}
            style={{
              width: windowWidth,
              height: 300,
              transform: [{perspective: 200}, { scale: animateParams.scale }, { translateX: animateParams.translateX }, { translateY: animateParams.translateY }]
            }}
            resizeMode='cover'
          />
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  )
}

const ModalComponent = ({
  onClose,
  position,
  rootAnimateParams,
  pageTranslateX,
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
      {/* <PagerView 
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
      </PagerView> */}
        <Animated.View
          style={{
            flex: 1,
            width: windowWidth * 3,
            flexDirection: 'row',
            transform: [{ translateX: pageTranslateX }]
          }}
        >
          <View style={styles.viewPagerModalItem} key={1}>
            <PinchComponent 
              rootAnimateParams={position + 1 === 1 ? rootAnimateParams : null}
              pageTranslateX={pageTranslateX}
              uri={'https://i.picsum.photos/id/590/200/300.jpg?hmac=rMKCd22eXuQjtVujiifOrJzm-dBuhO8blicB93xN4y4'}
            />
          </View>

          <View  style={styles.viewPagerModalItem} key={2}>
            <PinchComponent 
              rootAnimateParams={position + 1 === 2 ? rootAnimateParams : null}
              pageTranslateX={pageTranslateX}
              uri={'https://i.picsum.photos/id/1022/6000/3376.jpg?hmac=FBA9Qbec8NfDlxj8xLhV9k3DQEKEc-3zxkQM-hmfcy0'}
            />
          </View>

          <View  style={styles.viewPagerModalItem} key={3}>
            <PinchComponent 
              rootAnimateParams={position + 1 === 3 ? rootAnimateParams : null}
              pageTranslateX={pageTranslateX}
              uri={'https://i.picsum.photos/id/1023/3955/2094.jpg?hmac=AW_7mARdoPWuI7sr6SG8t-2fScyyewuNscwMWtQRawU'}
            />
          </View>
        </Animated.View>
    </Modal>
  )
}

const useAnimate = ({
  setShow,
  pageTranslateX
}) => {

  // Pinch
  const baseScale = useRef(new Animated.Value(1)).current
  const pinchScale = useRef(new Animated.Value(1)).current
  const scale = useRef(Animated.multiply(baseScale, pinchScale)).current
  let lastScale = useRef(1)
  const currentScale = useRef(1)
  const onZoomEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale }}],
    { 
      useNativeDriver: true,
      listener: (event) => {
        currentScale.current = event.nativeEvent.scale * lastScale.current
        // currentScale.current = event.nativeEvent.scale
      }
    }
  )
  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      if (setShow) {
        setShow(true)
      }
    }
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale
      baseScale.setValue(lastScale.current)
      pinchScale.setValue(1)
      const limit = (Math.abs((lastScale.current * windowWidth) - windowWidth) / 2) / lastScale.current
    }
  }

    // Pan
    const translateX = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(0)).current
    const lastTranslateX = useRef(0)
    const lastTranslateY = useRef(0)
    const lastOffset = useRef({ x: 0, y: 0})
    const lastOffsetPage = useRef({ x: 0 })
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
    //       pagerTranslateX.setValue(e.nativeEvent.translationX)
    //     },
    //     useNativeDriver: true
    //   }
    // );
  
    const onGestureEvent = (e) => {

      const edge = (((currentScale.current * windowWidth) - windowWidth) / 2) / currentScale.current
      const absoluteX = e.nativeEvent.translationX + lastOffset.current.x

      // console.log('absoluteX', absoluteX)
      // console.log('currentScale', currentScale.current)
      // console.log('translationX', e.nativeEvent.translationX)
      if (edge < Math.abs(absoluteX)) {
        if (!lastTranslateX.current) {
          lastTranslateX.current = e.nativeEvent.translationX
        }
        pageTranslateX.setValue((e.nativeEvent.translationX - lastTranslateX.current) * currentScale.current)
      } else {
        if (lastTranslateX.current) {
          lastTranslateX.current = 0
        }
        translateX.setValue(e.nativeEvent.translationX)
      }

      translateY.setValue(e.nativeEvent.translationY)
    }
  
    const onPanHandlerStateChange = (event) => {
      lastOffset.current.y += event.nativeEvent.translationY
      lastOffset.current.x += event.nativeEvent.translationX
      translateX.setOffset(lastOffset.current.x)
      translateX.setValue(0)
      translateY.setOffset(lastOffset.current.y)
      translateY.setValue(0)

      pageTranslateX.setValue(0)
  
      if (event.nativeEvent.oldState === State.ACTIVE) {
        // Animated.spring(pagerTranslateX, {
        //   toValue: - windowWidth,
        //   useNativeDriver: true
        // }).start()
      }
    }

  return {
    onZoomEvent,
    onPinchHandlerStateChange,
    onGestureEvent,
    onPanHandlerStateChange,
    scale,
    translateX,
    translateY,
  }
}

const App = () => {

  const [show, setShow] = useState(false)
  const [page, setPage] = useState(0)

  const pinchRef = useRef(null)
  const panRef = useRef(null)
  const pageTranslateX = useRef(new Animated.Value(0)).current
  
  const rootAnimateParams = useAnimate({
    setShow,
    pageTranslateX,
  })

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
        ref={pinchRef}
        simultaneousHandlers={panRef}
        onGestureEvent={rootAnimateParams.onZoomEvent}
        onHandlerStateChange={rootAnimateParams.onPinchHandlerStateChange}
      >
        <Animated.View style={styles.viewPager}>
        <PanGestureHandler
          ref={panRef}
          simultaneousHandlers={pinchRef}
          onGestureEvent={rootAnimateParams.onGestureEvent}
          onHandlerStateChange={rootAnimateParams.onPanHandlerStateChange}
        >
          <View style={styles.viewPager}>
          <PagerView 
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
              rootAnimateParams={rootAnimateParams}
              pageTranslateX={pageTranslateX}
              onClose={() => setShow(false)}
              position={page}
            />
          }
          </View>
        </PanGestureHandler>
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
