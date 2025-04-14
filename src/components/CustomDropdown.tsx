import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {responsiveFont} from 'react-native-adaptive-fontsize';
import {Dropdown} from 'react-native-element-dropdown';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {useTheme} from '../context/ThemeContext';

interface CustomDropdownProps {
  data: {label: string; value: string}[];
  placeholder?: string;
  value?: string | null;
  onSelect: (value: string | null) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  isrequired?: boolean;
  [rest: string]: any; // Allow additional props (for Dropdown props like labelField, valueField, etc.)
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  data = [],
  placeholder = 'Select',
  value = null,
  onSelect,
  onBlur,
  error,
  errorMessage,
  label,
  isrequired,
  ...rest
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(value);
  const {currentTheme} = useTheme();

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, {color: currentTheme.textColor}]}>
          {label} {isrequired && <Text style={{color: 'red'}}>*</Text>}
        </Text>
      )}
      <Dropdown
        style={[
          styles.dropdown,
          {
            borderColor: error
              ? currentTheme.errorColor
              : currentTheme.inputBorderColor,
            backgroundColor: currentTheme.inputBackground,
          },
        ]}
        placeholderStyle={{
          fontSize: responsiveFont(14),
          color: currentTheme.placeholderColor,
          fontWeight: '400',
        }}
        selectedTextStyle={{
          fontSize: responsiveFont(14),
          color: currentTheme.textColor,
          fontWeight: '400',
        }}
        data={data}
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={selectedValue}
        onBlur={onBlur}
        onChange={item => {
          setSelectedValue(item.value);
          onSelect(item.value);
        }}
        {...rest}
      />
      {error && (
        <Text style={[styles.errorText, {color: currentTheme.errorColor}]}>
          {errorMessage || ''}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateVerticalScale(10),
  },
  label: {
    fontSize: responsiveFont(12),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(5),
  },
  dropdown: {
    height: moderateVerticalScale(40),
    paddingHorizontal: moderateScale(8),
    borderWidth: 1,
    borderRadius: 6,
  },
  errorText: {
    fontSize: responsiveFont(10),
    marginTop: moderateVerticalScale(4),
    marginLeft: moderateScale(2),
    fontWeight: '400',
  },
});

export default CustomDropdown;
