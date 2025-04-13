export const TaskSchema = {
  name: 'Task',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    title: 'string',
    description: 'string',
    status: 'string', // "Pending", "In Progress", "Done"
    assignedTo: 'string',
    priority: 'string', // "High", "Medium", "Low"
    createdAt: 'date',
    updatedAt: 'date',
    isSynced: {type: 'bool', default: false},
  },
};

export const TaskRealm = [TaskSchema];
