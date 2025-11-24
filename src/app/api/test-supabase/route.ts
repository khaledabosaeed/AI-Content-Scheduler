import { NextResponse, NextRequest } from 'next/server';
import { supabaseServer } from '@/shared/libs/auth/supabaseServer';

// GET: Fetch all users
export async function GET() {
    try {
        const { data, error } = await supabaseServer
            .from('users')
            .select('*')

        if (error) {
            console.error('Error fetching users:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to fetch users',
                    error: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Users fetched successfully',
            data,
            count: data?.length || 0,
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json(
            {
                success: false,
                message: 'Unexpected error occurred',
                error: err instanceof Error ? err.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// POST: Create a new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Name is required',
                },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseServer
            .from('users')
            .insert({
                name: body.name,
                image: body.image || null,
                role: body.role || 'user',
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating user:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to create user',
                    error: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'User created successfully',
                data,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json(
            {
                success: false,
                message: 'Unexpected error occurred',
                error: err instanceof Error ? err.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
