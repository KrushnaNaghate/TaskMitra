import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RealmProvider} from '@realm/react';
import React from 'react';
import {StatusBar} from 'react-native';

import {ThemeProvider} from './src/context/ThemeContext'; // Import ThemeProvider
import {TaskRealm} from './src/realm/TaskSchema';
import CreateTaskScreen from './src/screens/CreateTaskScreen'; // Import CreateTaskScreen
import TaskListScreen from './src/screens/TaskListScreen'; // Import TaskListScreen

const Stack = createStackNavigator();

const App = () => {
  return (
    // Wrap the app in ThemeProvider to provide the theme context
    <ThemeProvider>
      {/* Wrap the app in RealmProvider with the schema */}
      <RealmProvider schema={TaskRealm} deleteRealmIfMigrationNeeded>
        <NavigationContainer>
          {/* Get the current theme for StatusBar color */}
          <StatusBar barStyle="dark-content" />
          <Stack.Navigator initialRouteName="TaskListScreen">
            <Stack.Screen name="TaskListScreen" component={TaskListScreen} />
            <Stack.Screen
              name="CreateTaskScreen"
              component={CreateTaskScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </RealmProvider>
    </ThemeProvider>
  );
};

export default App;
