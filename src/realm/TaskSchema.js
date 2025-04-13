// ✅ Correct schema definition
export const TaskSchema = {
  name: 'Task',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    title: 'string',
    description: 'string',
    status: 'string',
    assignedTo: 'string',
    updatedAt: 'date',
    isSynced: {type: 'bool', default: false},
  },
};

// ✅ Optional: if you're importing it as array
export const TaskRealm = [TaskSchema];
