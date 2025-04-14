import React, {forwardRef} from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {responsiveFont} from 'react-native-adaptive-fontsize';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../context/ThemeContext';

interface CustomInputFieldProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  containerStyle?: object;
  inputStyle?: object;
  onBlur?: () => void;
  onClick?: () => void;
  error?: boolean;
  errorMessage?: string;
  disableInput?: boolean;
  hint?: string;
  extra?: JSX.Element;
  preError?: boolean;
  preErrorColor?: string;
  PreErrorText?: string;
  isrequired?: boolean;
  secureTextEntryIcon?: boolean;
}

const CustomInputField = forwardRef<TextInput, CustomInputFieldProps>(
  (
    {
      label,
      placeholder,
      containerStyle,
      inputStyle,
      onBlur,
      onClick,
      error,
      errorMessage,
      disableInput = true,
      hint = '',
      extra,
      preError,
      preErrorColor,
      PreErrorText,
      isrequired = false,
      secureTextEntryIcon = false,
      ...rest
    },
    ref,
  ) => {
    const {currentTheme} = useTheme();

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.labelRow}>
          {label && (
            <Text style={[styles.label, {color: currentTheme.textColor}]}>
              {label} {isrequired && <Text style={styles.required}>*</Text>}
            </Text>
          )}
          {hint && (
            <Text
              style={[styles.hintText, {color: currentTheme.placeholderColor}]}>
              {hint}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              borderColor: error
                ? currentTheme.errorColor
                : currentTheme.inputBorderColor,
              backgroundColor: disableInput
                ? currentTheme.inputBackground
                : currentTheme.disableBackground,
            },
          ]}>
          <TextInput
            ref={ref}
            style={[styles.input, inputStyle, {color: currentTheme.textColor}]}
            placeholder={placeholder}
            placeholderTextColor={currentTheme.placeholderColor}
            secureTextEntry={secureTextEntryIcon}
            onFocus={() => {
              if (onClick) {
                onClick();
              }
            }}
            editable={disableInput}
            onBlur={onBlur}
            {...rest}
          />
        </View>

        {!!preError && (
          <Text
            style={[
              styles.preError,
              {color: preErrorColor || currentTheme.textColor},
            ]}>
            <AntDesign
              name="exclamationcircle"
              size={moderateVerticalScale(10)}
              color={preErrorColor || currentTheme.textColor}
            />{' '}
            {PreErrorText}
          </Text>
        )}

        {!!error && (
          <Text style={[styles.error, {color: currentTheme.errorColor}]}>
            {errorMessage}
          </Text>
        )}

        {!!extra && extra}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateVerticalScale(10),
    marginTop: moderateVerticalScale(4),
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(5),
  },
  label: {
    fontSize: responsiveFont(12),
    fontWeight: '600',
  },
  hintText: {
    fontSize: responsiveFont(10),
    fontWeight: '400',
  },
  required: {
    color: 'red',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    padding: moderateVerticalScale(6),
    fontSize: responsiveFont(14),
    fontWeight: '400',
  },
  preError: {
    fontSize: responsiveFont(10),
    marginTop: moderateVerticalScale(2),
    marginLeft: moderateScale(2),
    fontWeight: '300',
    alignSelf: 'flex-start',
  },
  error: {
    fontSize: responsiveFont(10),
    marginLeft: moderateScale(2),
    fontWeight: '400',
  },
});

export default CustomInputField;
