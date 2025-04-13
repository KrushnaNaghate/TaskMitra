import {yupResolver} from '@hookform/resolvers/yup';
import {get, getDatabase, ref} from '@react-native-firebase/database';
import {useRealm} from '@realm/react';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Divider,
  Menu,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import * as yup from 'yup';

import {useSnackbar} from '../components/SnackbarProvider';
import {useTheme} from '../context/ThemeContext';
import useNetworkStatus from '../hooks/useNetworkStatus';
import {saveTask} from '../services/TaskService';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  assignedTo: yup.string().required('Assigned To is required'),
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
  const [visible, setVisible] = useState(false);
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
      <Controller
        name="title"
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            label="Title"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            style={styles.input}
            theme={{colors: {primary: currentTheme.buttonColor}}}
          />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

      <Controller
        name="description"
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            label="Description"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            style={styles.input}
            theme={{colors: {primary: currentTheme.buttonColor}}}
          />
        )}
      />
      {errors.description && (
        <Text style={styles.error}>{errors.description.message}</Text>
      )}

      <Controller
        name="assignedTo"
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput
            label="Assigned To"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            style={styles.input}
            theme={{colors: {primary: currentTheme.buttonColor}}}
          />
        )}
      />
      {errors.assignedTo && (
        <Text style={styles.error}>{errors.assignedTo.message}</Text>
      )}

      <Text style={[styles.label, {color: currentTheme.textColor}]}>
        Status
      </Text>
      <RadioButton.Group onValueChange={setStatus} value={status}>
        <RadioButton.Item label="Pending" value="Pending" />
        <RadioButton.Item label="In Progress" value="In Progress" />
        <RadioButton.Item label="Done" value="Done" />
      </RadioButton.Group>

      <Text style={[styles.label, {color: currentTheme.textColor}]}>
        Priority
      </Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setVisible(true)}>
            {priority} Priority
          </Button>
        }>
        <Menu.Item onPress={() => setPriority('High')} title="High" />
        <Menu.Item onPress={() => setPriority('Medium')} title="Medium" />
        <Menu.Item onPress={() => setPriority('Low')} title="Low" />
        <Divider />
      </Menu>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={[styles.button, {backgroundColor: currentTheme.buttonColor}]}>
        {taskId ? 'Update Task' : 'Add Task'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  input: {marginBottom: 12},
  button: {marginTop: 20},
  label: {fontSize: 14, fontWeight: 'bold', marginTop: 10},
  error: {color: 'red', fontSize: 12, marginBottom: 8},
  dark: {backgroundColor: '#121212'},
  light: {backgroundColor: '#fff'},
});

export default CreateTaskScreen;
