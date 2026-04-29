import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStatus } from '../types/task';
import { loadTasks, saveTasks } from '../services/taskStorage';
import { generateId } from '../utils/generateId';
import { nowISO } from '../utils/formatDate';

type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt'>>;

interface TaskContextData {
  tasks: Task[];
  isLoading: boolean;
  filter: TaskStatus | 'todas';
  setFilter: (f: TaskStatus | 'todas') => void;
  filteredTasks: Task[];
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTask: (id: string) => Task | undefined;
}

export const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | 'todas'>('todas');

  useEffect(() => {
    loadTasks().then(stored => {
      setTasks(stored);
      setIsLoading(false);
    });
  }, []);

  const filteredTasks = filter === 'todas' ? tasks : tasks.filter(t => t.status === filter);

  async function createTask(input: CreateTaskInput) {
    const task: Task = {
      ...input,
      id: generateId(),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    const updated = [task, ...tasks];
    setTasks(updated);
    await saveTasks(updated);
  }

  async function updateTask(id: string, input: UpdateTaskInput) {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, ...input, updatedAt: nowISO() } : t
    );
    setTasks(updated);
    await saveTasks(updated);
  }

  async function deleteTask(id: string) {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    await saveTasks(updated);
  }

  function getTask(id: string): Task | undefined {
    return tasks.find(t => t.id === id);
  }

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, filter, setFilter, filteredTasks, createTask, updateTask, deleteTask, getTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}
