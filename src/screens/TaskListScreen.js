import React, {useEffect} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Card, Chip, Switch, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useQuery, useRealm} from '@realm/react';
import {responsiveFont} from 'react-native-adaptive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import OfflineRibbon from '../components/OfflineRibbon';
import {useSnackbar} from '../components/SnackbarProvider';
import {useTheme} from '../context/ThemeContext';
import useNetworkStatus from '../hooks/useNetworkStatus';
import {
  fetchTasksFromFirebase,
  syncUnsyncedTasks,
} from '../services/TaskService';

const TaskListScreen = ({navigation}) => {
  const realm = useRealm();
  const tasks = useQuery('Task'); // live reactive Realm results
  const isConnected = useNetworkStatus();
  const {currentTheme, isDark, toggleTheme} = useTheme();
  const {showToast} = useSnackbar();

  useEffect(() => {
    if (realm) {
      fetchTasksFromFirebase(realm);
    }
  }, [realm]);

  const getPriorityIcon = priority => {
    switch (priority) {
      case 'High':
        return {icon: 'keyboard-double-arrow-up', color: 'red'};
      case 'Medium':
        return {icon: 'linear-scale', color: '#FFA500'};
      case 'Low':
        return {icon: 'keyboard-double-arrow-down', color: 'blue'};
      default:
        return {icon: 'more-horiz', color: 'gray'};
    }
  };

  const getSyncIcon = isSynced => (isSynced ? 'check-circle' : 'cloud-off');

  const handleSyncNow = () => {
    syncUnsyncedTasks(realm, showToast);
  };

  useEffect(() => {
    if (isConnected) {
      showToast('🔄 Syncing changes to Firebase...');
      syncUnsyncedTasks(realm, showToast);
    }
  }, [isConnected]);

  const renderTask = ({item}) => (
    <Card
      style={[styles.card, {backgroundColor: currentTheme.inputBackground}]}>
      <Card.Title
        title={item.title}
        titleStyle={{color: currentTheme.textColor, fontWeight: 'bold'}}
        subtitle={`Assigned: ${item.assignedTo}`}
        subtitleStyle={{color: currentTheme.textColor, fontWeight: '600'}}
      />
      <Card.Content>
        <Text style={{color: currentTheme.textColor, fontWeight: '400'}}>
          {item.description}
        </Text>
        <Chip style={styles.chip}>{item.status}</Chip>
      </Card.Content>
      <Card.Actions>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name={getPriorityIcon(item.priority).icon}
            size={22}
            color={getPriorityIcon(item.priority).color}
            style={{marginRight: 8}}
          />
          <Icon
            name={getSyncIcon(item.isSynced)}
            size={22}
            color={item.isSynced ? 'green' : 'red'}
          />
        </View>
        <Button
          onPress={() =>
            navigation.navigate('CreateTaskScreen', {taskId: item._id})
          }>
          Edit
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <OfflineRibbon />
      <View
        style={[
          styles.container,
          {backgroundColor: currentTheme.backgroundColor},
        ]}>
        <View style={styles.headerRow}>
          <Text style={[styles.heading, {color: currentTheme.textColor}]}>
            Task List
          </Text>
          <View style={styles.toggleContainer2}>
            <TouchableOpacity
              style={[
                styles.syncButton,
                {backgroundColor: currentTheme.backgroundColor},
              ]}
              onPress={handleSyncNow}
              activeOpacity={0.7}>
              <Icon name="sync" size={24} color={currentTheme.buttonColor} />
            </TouchableOpacity>
            <View
              style={[
                styles.toggleContainer,
                {backgroundColor: currentTheme.backgroundColor},
              ]}>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{true: currentTheme.buttonColor, false: '#ccc'}}
                thumbColor={isDark ? currentTheme.buttonColor : '#f4f3f4'}
              />
              <Icon
                name={isDark ? 'brightness-3' : 'wb-sunny'}
                size={24}
                color={currentTheme.textColor}
              />
            </View>
          </View>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={item => item._id}
          renderItem={renderTask}
          contentContainerStyle={{paddingBottom: 100}}
        />

        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateTaskScreen')}
          style={[styles.button, {backgroundColor: currentTheme.buttonColor}]}>
          Add Task
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: moderateScale(16)},
  card: {marginBottom: moderateVerticalScale(12)},
  chip: {marginTop: moderateVerticalScale(8), alignSelf: 'flex-start'},
  button: {marginTop: moderateVerticalScale(20)},
  heading: {fontSize: responsiveFont(22), fontWeight: 'bold'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(8),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    padding: moderateScale(6),
    borderRadius: 10,
  },
  toggleContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  syncButton: {
    padding: moderateScale(6),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginRight: moderateScale(8),
  },
});

export default TaskListScreen;
