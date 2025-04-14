import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {responsiveFont} from 'react-native-adaptive-fontsize';
import {moderateVerticalScale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '../context/ThemeContext';
import useNetworkStatus from '../hooks/useNetworkStatus';

interface OfflineRibbonProps {
  style?: object;
}

const OfflineRibbon: React.FC<OfflineRibbonProps> = ({style}) => {
  const {currentTheme} = useTheme();
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const currentnet = useNetworkStatus(); // Checks the network status (online or offline)

  // Trigger the animation for the ribbon
  useEffect(() => {
    const delay = 300;

    const opacityAnimation = Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: 100,
      useNativeDriver: false,
    });

    const translateYAnimation = Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    });

    const parallelAnimation = Animated.parallel([
      opacityAnimation,
      translateYAnimation,
    ]);

    const delayAnimation = Animated.delay(delay);

    animationRef.current = Animated.sequence([
      delayAnimation,
      parallelAnimation,
    ]);
    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
      translateY.setValue(-50); // Reset position after the animation is done
    };
  }, []);

  return (
    <>
      {!currentnet ? ( // Show ribbon only when offline
        <View style={[styles.container, style]}>
          <Animated.View
            style={[styles.ribbon, {opacity, transform: [{translateY}]}]}>
            <Text style={styles.ribbonText}>
              <Feather
                name="wifi-off"
                size={moderateVerticalScale(13)}
                color={currentTheme.backgroundColor}
              />
              {'  '}
              You are offline. {/* Display message when offline */}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: moderateVerticalScale(40),
    overflow: 'hidden',
  },
  ribbon: {
    backgroundColor: '#E74C3C', // Red color for the ribbon
    height: moderateVerticalScale(40),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ribbonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: responsiveFont(10),
  },
});

export default OfflineRibbon;
