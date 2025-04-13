import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

// Context & Providers
import {RealmProvider} from '@realm/react';
import {SnackbarProvider} from './src/components/SnackbarProvider';
import {ThemeProvider} from './src/context/ThemeContext';

// Realm Schema
import {TaskRealm} from './src/realm/TaskSchema';

// Screens
import CreateTaskScreen from './src/screens/CreateTaskScreen';
import TaskListScreen from './src/screens/TaskListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <RealmProvider schema={TaskRealm} deleteRealmIfMigrationNeeded>
        <SnackbarProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="TaskListScreen">
              <Stack.Screen
                name="TaskListScreen"
                component={TaskListScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="CreateTaskScreen"
                component={CreateTaskScreen}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SnackbarProvider>
      </RealmProvider>
    </ThemeProvider>
  );
};

export default App;
