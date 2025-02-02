import { create } from 'zustand';
import { db } from '../Configs/db';
import { tasks, users } from '../Configs/schema';
import { eq } from 'drizzle-orm';

interface UserState {
  tasks: any[];
  user: any;
  userId: number | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: any) => void;
  setUserId: (id: number) => void;
  fetchTasks: (email: string) => Promise<void>;
  addTask: (title: string, description: string, userId: number, projectId?: number, categoryId?: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  tasks: [],
  user: null,
  userId: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  
  setUserId: (id) => set({ userId: id }),

  fetchTasks: async (email) => {
    try {
      set({ isLoading: true, error: null });
      
      // First find user by email
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user.length === 0) {
        throw new Error('User not found');
      }

      // Get tasks for this user
      const fetchedTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, user[0].id));


      set({ tasks: fetchedTasks, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: async (title: string, description: string, userId: number, projectId?: number, categoryId?: number) => {
    try {
      set({ isLoading: true, error: null });

      // Verify user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (existingUser.length === 0) {
        throw new Error('User not found');
      }

      // Create new task
      const newTask = await db.insert(tasks).values({
        title: title.trim(),
        description: description.trim(),
        userId,
        status: 'pending',
        projectId: projectId || null,
        categoryId: categoryId || null
      }).returning();

      // Fetch updated task list
      const fetchedTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, userId));

      set({ tasks: fetchedTasks, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add task', isLoading: false });
    }
  },
}));
