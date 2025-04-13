import {useQuery, useRealm} from '@realm/react';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Card, Chip, IconButton, Switch, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {responsiveFont} from 'react-native-adaptive-fontsize';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {useSnackbar} from '../components/SnackbarProvider';
import {useTheme} from '../context/ThemeContext';
import useNetworkStatus, {toggleFakeOffline} from '../hooks/useNetworkStatus';
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

  React.useEffect(() => {
    if (realm) {
      fetchTasksFromFirebase(realm);
    }
  }, [realm]);

  const getPriorityIcon = priority => {
    switch (priority) {
      case 'High':
        return 'keyboard-double-arrow-up';
      case 'Medium':
        return 'linear-scale';
      case 'Low':
        return 'keyboard-double-arrow-down';
      default:
        return 'more-horiz';
    }
  };

  const getSyncIcon = isSynced => (isSynced ? 'check-circle' : 'cloud-off');

  const handleSyncNow = () => {
    syncUnsyncedTasks(realm, showToast);
  };

  const renderTask = ({item}) => (
    <Card
      style={[styles.card, {backgroundColor: currentTheme.inputBackground}]}>
      <Card.Title
        title={item.title}
        titleStyle={{color: currentTheme.textColor, fontWeight: 'bold'}}
        subtitle={`Assigned: ${item.assignedTo}`}
        subtitleStyle={{color: currentTheme.textColor, fontWeight: '600'}}
        // right={() => (

        // )}
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
            name={getPriorityIcon(item.priority)}
            size={22}
            color={currentTheme.textColor}
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
    <View
      style={[
        styles.container,
        {backgroundColor: currentTheme.backgroundColor},
      ]}>
      <View style={styles.headerRow}>
        <Text style={[styles.heading, {color: currentTheme.textColor}]}>
          Task List
        </Text>
        <IconButton
          icon="sync"
          onPress={handleSyncNow}
          color={currentTheme.buttonColor}
        />
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

      <View style={styles.toggleRow}>
        <Text style={{color: currentTheme.textColor}}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{true: currentTheme.buttonColor, false: '#ccc'}}
        />
        <Text style={{color: currentTheme.textColor, marginLeft: 16}}>
          Fake Offline
        </Text>
        <Switch
          value={!isConnected}
          onValueChange={toggleFakeOffline}
          trackColor={{true: 'orange', false: '#ccc'}}
        />
      </View>
    </View>
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
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
  },
});

export default TaskListScreen;
