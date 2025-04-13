import NetInfo from '@react-native-community/netinfo';
import {getDatabase} from '@react-native-firebase/database';
import Realm from 'realm';

const database = getDatabase();

// Fetch tasks from Firebase and sync with Realm
export const fetchTasksFromFirebase = realm => {
  if (realm) {
    const tasksRef = database.ref('tasks');
    tasksRef.on('value', snapshot => {
      const tasks = snapshot.val();
      if (tasks) {
        try {
          realm.write(() => {
            Object.values(tasks).forEach(task => {
              realm.create(
                'Task',
                {
                  _id: task._id,
                  title: task.title,
                  description: task.description,
                  status: task.status,
                  assignedTo: task.assignedTo,
                  updatedAt: new Date(task.updatedAt),
                  isSynced: true,
                },
                Realm.UpdateMode.Modified,
              );
            });
          });
        } catch (error) {
          console.error('Error syncing Firebase tasks to Realm:', error);
        }
      }
    });
  }
};

// ADD or UPDATE task depending on online/offline status
export const saveTask = async (task, realm, isUpdate = false) => {
  const netInfo = await NetInfo.fetch();
  const isConnected = netInfo.isConnected;

  if (isConnected) {
    const tasksRef = database.ref('tasks');
    const firebaseRef = isUpdate
      ? tasksRef.orderByChild('_id').equalTo(task._id)
      : tasksRef.push();

    if (isUpdate) {
      // Fetch matching task node and update it
      firebaseRef.once('value', snapshot => {
        const updates = {};
        snapshot.forEach(child => {
          updates[child.key] = {
            ...task,
            updatedAt: new Date().toISOString(),
          };
        });

        tasksRef.update(updates);
      });
    } else {
      firebaseRef.set({
        ...task,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // Store in Realm either way
  realm.write(() => {
    realm.create(
      'Task',
      {
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        assignedTo: task.assignedTo,
        updatedAt: new Date(),
        isSynced: isConnected, // false if offline
      },
      Realm.UpdateMode.Modified,
    );
  });
};

// Sync unsynced tasks once online
export const syncUnsyncedTasks = async realm => {
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    return;
  }

  const unsyncedTasks = realm.objects('Task').filtered('isSynced == false');

  unsyncedTasks.forEach(task => {
    const tasksRef = database.ref('tasks');
    const firebaseRef = tasksRef.push();

    firebaseRef.set({
      _id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo,
      updatedAt: new Date().toISOString(),
    });

    realm.write(() => {
      task.isSynced = true;
    });
  });
};
