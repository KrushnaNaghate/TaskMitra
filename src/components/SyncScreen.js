import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {responsiveFont} from 'react-native-adaptive-fontsize';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {useTheme} from '../context/ThemeContext';

const SyncScreen = () => {
  const {currentTheme} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: currentTheme.backgroundColor},
      ]}>
      <Text style={[styles.syncText, {color: currentTheme.textColor}]}>
        Syncing... Please wait
      </Text>

      <Image
        source={require('../assets/ForceUpdate.png')} // Image path
        style={styles.syncImage}
        resizeMode="contain"
      />

      <ActivityIndicator
        size="large"
        color={currentTheme.buttonColor}
        style={styles.activityIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  syncText: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(20),
  },
  syncImage: {
    width: moderateScale(200), // Adjust width as per your requirement
    height: moderateScale(200), // Adjust height as per your requirement
  },
  activityIndicator: {
    marginTop: moderateVerticalScale(20),
  },
});

export default SyncScreen;
