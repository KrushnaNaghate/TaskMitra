import NetInfo from '@react-native-community/netinfo';
import {getDatabase, onValue, ref, set} from '@react-native-firebase/database';
import Realm from 'realm';

const database = getDatabase();
const retryQueue = [];

export const fetchTasksFromFirebase = realm => {
  const tasksRef = ref(database, 'tasks');
  onValue(tasksRef, snapshot => {
    const tasks = snapshot.val();
    if (tasks) {
      try {
        realm.write(() => {
          Object.values(tasks).forEach(task => {
            try {
              realm.create(
                'Task',
                {
                  _id: String(task._id),
                  title: task.title || '',
                  description: task.description || '',
                  status: task.status || 'Pending',
                  assignedTo: task.assignedTo || '',
                  priority: task.priority || 'Medium',
                  createdAt: new Date(task.createdAt || Date.now()),
                  updatedAt: new Date(task.updatedAt || Date.now()),
                  isSynced: true,
                },
                Realm.UpdateMode.Modified,
              );
            } catch (err) {
              console.warn('🔥 Skipped bad task:', task._id, err.message);
            }
          });
        });
      } catch (err) {
        console.error('🔥 Firebase → Realm sync failed:', err);
      }
    }
  });
};

export const saveTask = async (task, realm, isUpdate = false, showToast) => {
  const netInfo = await NetInfo.fetch();
  const isConnected = netInfo.isConnected;
  const timestamp = new Date();

  const taskToSave = {
    ...task,
    _id: String(task._id),
    createdAt: task.createdAt || timestamp,
    updatedAt: timestamp,
  };

  realm.write(() => {
    realm.create(
      'Task',
      {
        ...taskToSave,
        isSynced: isConnected,
      },
      Realm.UpdateMode.Modified,
    );
  });

  if (isConnected) {
    try {
      const dbRef = ref(database, `tasks/${task._id}`);
      await set(dbRef, {
        ...taskToSave,
        updatedAt: taskToSave.updatedAt.toISOString(),
        createdAt: taskToSave.createdAt.toISOString(),
      });

      realm.write(() => {
        const obj = realm.objectForPrimaryKey('Task', task._id);
        if (obj) {
          obj.isSynced = true;
        }
      });

      showToast?.('✅ Task saved and synced');
    } catch (err) {
      retryQueue.push(taskToSave);
      showToast?.('⚠️ Task queued for sync');
    }
  } else {
    showToast?.('📴 Saved offline');
  }
};

export const syncUnsyncedTasks = async (realm, showToast) => {
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    showToast?.('🚫 You are offline');
    return;
  }

  const unsynced = realm.objects('Task').filtered('isSynced == false');
  if (unsynced.length === 0 && retryQueue.length === 0) {
    showToast?.('🎉 All tasks are already synced');
    return;
  }

  for (const task of unsynced) {
    const dbRef = ref(database, `tasks/${task._id}`);
    try {
      await set(dbRef, {
        ...task,
        updatedAt: task.updatedAt.toISOString(),
        createdAt: task.createdAt.toISOString(),
      });

      realm.write(() => {
        task.isSynced = true;
      });
    } catch (err) {
      retryQueue.push(task);
    }
  }

  while (retryQueue.length > 0) {
    const retryTask = retryQueue.shift();
    const dbRef = ref(database, `tasks/${retryTask._id}`);
    try {
      await set(dbRef, {
        ...retryTask,
        updatedAt: retryTask.updatedAt.toISOString(),
        createdAt: retryTask.createdAt.toISOString(),
      });

      realm.write(() => {
        const stored = realm.objectForPrimaryKey('Task', retryTask._id);
        if (stored) {
          stored.isSynced = true;
        }
      });
    } catch (err) {
      retryQueue.push(retryTask);
      console.warn('🔁 Retry failed again:', retryTask._id);
    }
  }

  showToast?.('✅ Synced all pending tasks');
};
