import { NextResponse } from 'next/server';
import { db } from '@/Configs/db';
import { tasks } from '@/Configs/schema';
import { eq } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

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

    const task = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parsedTaskId))
      .limit(1);

    if (task.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task[0]);

  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const parsedTaskId = parseInt(id);
    if (isNaN(parsedTaskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID format' },
        { status: 400 }
      );
    }

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

    // Update the task status
    await db
      .update(tasks)
      .set({ status })
      .where(eq(tasks.id, parsedTaskId));

    return NextResponse.json({ message: 'Task status updated successfully' });

  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json(
      { error: 'Failed to update task status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

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

    await db
      .delete(tasks)
      .where(eq(tasks.id, parsedTaskId));

    return NextResponse.json({ message: 'Task deleted successfully' });

  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
