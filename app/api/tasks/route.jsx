import { NextResponse } from 'next/server';
import { db } from '@/Configs/db';
import { tasks, users } from '@/Configs/schema';
import { eq } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // First find the user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all tasks for this user
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, user[0].id));

    return NextResponse.json(userTasks);

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.description || !body.userId) {
      return NextResponse.json(
        { error: 'Title, description and userId are required fields' },
        { status: 400 }
      );
    }

    const { title, description, status, projectId, categoryId, userId, dueDate, priority } = body;

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Priority must be one of: low, medium, high' },
        { status: 400 }
      );
    }

    // Validate due date format
    let parsedDueDate = null;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid due date format' },
          { status: 400 }
        );
      }
    }

    // Convert string IDs to integers or null
    const parsedProjectId = projectId ? parseInt(projectId) : null;
    const parsedCategoryId = categoryId ? parseInt(categoryId) : null;
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedUserId)) {
      return NextResponse.json(
        { error: 'Invalid userId format - must be an integer' },
        { status: 400 }
      );
    }

    try {
      // Verify user exists first
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, parsedUserId))
        .limit(1);

      if (existingUser.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Create new task
      const newTask = await db.insert(tasks).values({
        title: title.trim(),
        description: description.trim(),
        status: status || 'pending',
        projectId: parsedProjectId,
        categoryId: parsedCategoryId,
        userId: parsedUserId,
        dueDate: parsedDueDate,
        priority: priority || 'low'
      }).returning();

      return NextResponse.json(newTask[0]);

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}
