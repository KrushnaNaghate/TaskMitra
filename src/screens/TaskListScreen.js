import {useQuery, useRealm} from '@realm/react';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useTheme} from '../context/ThemeContext';
import {fetchTasksFromFirebase} from '../services/TaskService';

const PAGE_SIZE = 10;

const TaskListScreen = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const {currentTheme, isDark, toggleTheme} = useTheme();
  const realm = useRealm();
  const allTasks = useQuery('Task') || [];

  useEffect(() => {
    try {
      fetchTasksFromFirebase(realm); // ✅ Make sure this doesn't access Realm too early

      const updated = [...allTasks];
      setTasks(updated);
      setVisibleTasks(updated.slice(0, PAGE_SIZE));
      setLoading(false);

      const listener = () => {
        const updatedTasks = [...allTasks];
        setTasks(updatedTasks);
        setVisibleTasks(updatedTasks.slice(0, currentPage * PAGE_SIZE));
      };

      allTasks.addListener(listener);

      return () => {
        allTasks.removeListener(listener);
      };
    } catch (error) {
      console.error('💥 useEffect crash:', error.message);
    }
  }, [allTasks, currentPage]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const newVisible = tasks.slice(0, nextPage * PAGE_SIZE);
    setCurrentPage(nextPage);
    setVisibleTasks(newVisible);
  };

  const handleTaskPress = task => {
    navigation.navigate('CreateTaskScreen', {taskId: task._id}); // Pass ID for edit
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: currentTheme.backgroundColor},
      ]}>
      <Text
        style={{
          color: currentTheme.textColor,
          fontSize: 24,
          fontWeight: 'bold',
        }}>
        Task List
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={currentTheme.buttonColor}
          style={{marginTop: 30}}
        />
      ) : (
        <FlatList
          data={visibleTasks}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleTaskPress(item)}>
              <View
                style={[
                  styles.item,
                  {backgroundColor: currentTheme.inputBackground},
                ]}>
                <Text style={{color: currentTheme.textColor, fontSize: 18}}>
                  {item.title}
                </Text>
                <Text style={{color: currentTheme.textColor, fontSize: 14}}>
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      )}

      <Button
        mode="contained"
        onPress={() => navigation.navigate('CreateTaskScreen')}
        style={[styles.button, {backgroundColor: currentTheme.buttonColor}]}>
        Add Task
      </Button>

      <View style={styles.toggleContainer}>
        <Text style={{color: currentTheme.textColor}}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{true: currentTheme.buttonColor, false: '#ccc'}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default TaskListScreen;
