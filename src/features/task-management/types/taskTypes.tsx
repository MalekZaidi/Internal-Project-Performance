// src/features/task-management/types/taskTypes.ts
export interface Task {
  _id: string;
  taskName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  project: string | { _id: string; projectName: string };
  assignedTo: string | { _id: string; fullName: string };
  createdAt?: string;
  updatedAt?: string;
  order: number;
  actualWorkedHours: number;
  workingHours: number;
  assignedAt: string;
  completedAt?: string;
}
  
  export interface CreateTaskPayload {
    taskName: string;
    description: string;
    startDate: string;
    endDate: string;
    project: string;
    assignedTo: string;
    status : string;
    priority: string;
    order : number;

  }
  
  export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}