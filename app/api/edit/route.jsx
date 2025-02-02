import { NextResponse } from 'next/server';
import { db } from '@/Configs/db';
import { tasks } from '@/Configs/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');
    const body = await request.json();
    const { title, description, status, userId, projectId, categoryId, dueDate, priority } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const parsedTaskId = parseInt(taskId);
    if (isNaN(parsedTaskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID format' },
        { status: 400 }
      );
    }

    // Check if task exists
    const existingTask = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parsedTaskId))
      .limit(1);

    if (existingTask.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Parse dueDate if it exists
    const parsedDueDate = dueDate ? new Date(dueDate) : null;

    // Update the task with all fields
    await db
      .update(tasks)
      .set({
        title,
        description,
        status,
        userId,
        projectId,
        categoryId,
        dueDate: parsedDueDate,
        priority,
        updatedAt: new Date()
      })
      .where(eq(tasks.id, parsedTaskId));

    return NextResponse.json({ message: 'Task updated successfully' });

  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
