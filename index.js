/**
 * @format
 */
import {AppRegistry} from 'react-native';
import Realm from 'realm';
import App from './App';
import {name as appName} from './app.json';

Realm.flags.THROW_ON_GLOBAL_REALM = true;
AppRegistry.registerComponent(appName, () => App);
