import {yupResolver} from '@hookform/resolvers/yup';
import {get, getDatabase, ref} from '@react-native-firebase/database';
import {useRealm} from '@realm/react';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, Text} from 'react-native-paper';
import * as yup from 'yup';

import {responsiveFont} from 'react-native-adaptive-fontsize';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import CustomDropdown from '../components/CustomDropdown';
import CustomInputField from '../components/CustomInputField';
import {useSnackbar} from '../components/SnackbarProvider';
import {useTheme} from '../context/ThemeContext';
import useNetworkStatus from '../hooks/useNetworkStatus';
import {saveTask} from '../services/TaskService';

const schema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .matches(/^[A-Za-z\s]+$/, 'Title must only contain letters and spaces'), // Ensures the title has only letters and spaces

  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters') // Min length validation
    .max(200, 'Description must be less than or equal to 200 characters'), // Max length validation

  assignedTo: yup
    .string()
    .required('Assigned To is required')
    .matches(
      /^[A-Za-z\s]+$/,
      'Assigned To must only contain letters and spaces',
    ), // Ensures the name has only letters and spaces
});

const CreateTaskScreen = ({navigation, route}) => {
  const {taskId} = route.params || {};
  const realm = useRealm();
  const isConnected = useNetworkStatus();
  const {showToast} = useSnackbar();
  const {currentTheme, isDark} = useTheme();

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});

  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(!!taskId);

  useEffect(() => {
    if (taskId) {
      const loadTask = async () => {
        if (isConnected) {
          try {
            const snapshot = await get(ref(getDatabase(), 'tasks'));
            const allTasks = snapshot.val();
            const task = Object.values(allTasks || {}).find(
              t => t._id === taskId,
            );
            if (task) {
              populateFields(task);
            }
          } catch (err) {
            console.error(' Error fetching Firebase:', err);
          }
        } else {
          const task = realm.objectForPrimaryKey('Task', taskId);
          if (task) {
            populateFields(task);
          }
        }
        setLoading(false);
      };

      loadTask();
    } else {
      setLoading(false);
    }
  }, [taskId, isConnected]);

  const populateFields = task => {
    setValue('title', task.title);
    setValue('description', task.description);
    setValue('assignedTo', task.assignedTo);
    setStatus(task.status || 'Pending');
    setPriority(task.priority || 'Medium');
  };

  const onSubmit = data => {
    const timestamp = new Date();

    const task = {
      _id: taskId || `${Date.now()}`,
      title: data.title,
      description: data.description,
      assignedTo: data.assignedTo,
      status,
      priority,
      createdAt: taskId
        ? realm.objectForPrimaryKey('Task', taskId)?.createdAt || timestamp
        : timestamp,
      updatedAt: timestamp,
    };

    saveTask(task, realm, !!taskId, showToast);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={currentTheme.buttonColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.dark : styles.light]}>
      <ScrollView>
        {/* Custom Input for Title */}
        <Controller
          name="title"
          control={control}
          render={({field: {onChange, value}}) => (
            <CustomInputField
              label="Title"
              value={value}
              onChangeText={onChange}
              error={errors.title}
              errorMessage={errors.title?.message}
              placeholder="Enter task title"
              inputStyle={{backgroundColor: currentTheme.inputBackground}}
            />
          )}
        />

        {/* Custom Input for Description */}
        <Controller
          name="description"
          control={control}
          render={({field: {onChange, value}}) => (
            <CustomInputField
              label="Description"
              value={value}
              onChangeText={onChange}
              error={errors.description}
              errorMessage={errors.description?.message}
              placeholder="Enter task description"
              inputStyle={{backgroundColor: currentTheme.inputBackground}}
              multiline={value?.length > 34}
              numberOfLines={value?.length > 34 ? 4 : 1}
            />
          )}
        />

        {/* Custom Input for Assigned To */}
        <Controller
          name="assignedTo"
          control={control}
          render={({field: {onChange, value}}) => (
            <CustomInputField
              label="Assigned To"
              value={value}
              onChangeText={onChange}
              error={errors.assignedTo}
              errorMessage={errors.assignedTo?.message}
              placeholder="Assign task to someone"
              inputStyle={{backgroundColor: currentTheme.inputBackground}}
            />
          )}
        />

        {/* Custom Dropdown for Status */}
        <Text style={[styles.label, {color: currentTheme.textColor}]}>
          Status
        </Text>
        <CustomDropdown
          data={[
            {value: 'Pending', label: 'Pending'},
            {value: 'In Progress', label: 'In Progress'},
            {value: 'Done', label: 'Done'},
          ]}
          placeholder="Select Status"
          value={status}
          onSelect={setStatus}
          error={errors.status}
          errorMessage={errors.status?.message}
        />

        {/* Custom Dropdown for Priority */}
        <Text style={[styles.label, {color: currentTheme.textColor}]}>
          Priority
        </Text>
        <CustomDropdown
          data={[
            {value: 'High', label: 'High'},
            {value: 'Medium', label: 'Medium'},
            {value: 'Low', label: 'Low'},
          ]}
          placeholder="Select Priority"
          value={priority}
          onSelect={setPriority}
          error={errors.priority}
          errorMessage={errors.priority?.message}
        />

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, {backgroundColor: currentTheme.buttonColor}]}>
          {taskId ? 'Update Task' : 'Add Task'}
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: moderateScale(20)},
  input: {marginBottom: moderateVerticalScale(12)},
  button: {marginTop: moderateVerticalScale(20)},
  label: {
    fontSize: responsiveFont(14),
    fontWeight: 'bold',
    marginTop: moderateVerticalScale(10),
  },
  error: {
    color: 'red',
    fontSize: responsiveFont(12),
    marginBottom: moderateVerticalScale(8),
  },
  dark: {backgroundColor: '#121212'},
  light: {backgroundColor: '#fff'},
});

export default CreateTaskScreen;
