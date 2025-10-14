import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserRequest {
  action: 'create' | 'update' | 'delete';
  userId?: string;
  name?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user is admin
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: roles, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roles) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client for user management
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: UserRequest = await req.json();
    console.log('Admin action:', body.action, 'by user:', user.id);

    switch (body.action) {
      case 'create': {
        if (!body.email || !body.password) {
          return new Response(
            JSON.stringify({ error: 'Email and password are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create user in auth
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: body.email,
          password: body.password,
          email_confirm: true,
        });

        if (createError) {
          console.error('Create user error:', createError);
          return new Response(
            JSON.stringify({ error: createError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create user profile
        const { error: profileError } = await supabaseAdmin
          .from('users')
          .insert({
            id: newUser.user.id,
            email: body.email,
            name: body.name || null,
          });

        if (profileError) {
          console.error('Create profile error:', profileError);
          // Clean up auth user if profile creation fails
          await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
          return new Response(
            JSON.stringify({ error: 'Failed to create user profile' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Set admin role if requested
        if (body.isAdmin) {
          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({
              user_id: newUser.user.id,
              role: 'admin',
            });

          if (roleError) {
            console.error('Assign admin role error:', roleError);
          }
        }

        console.log('User created successfully:', newUser.user.id);
        return new Response(
          JSON.stringify({ success: true, userId: newUser.user.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        if (!body.userId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update user profile
        const updateData: any = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.email !== undefined) updateData.email = body.email;

        if (Object.keys(updateData).length > 0) {
          const { error: profileError } = await supabaseAdmin
            .from('users')
            .update(updateData)
            .eq('id', body.userId);

          if (profileError) {
            console.error('Update profile error:', profileError);
            return new Response(
              JSON.stringify({ error: 'Failed to update user profile' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }

        // Update email in auth if changed
        if (body.email) {
          const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
            body.userId,
            { email: body.email }
          );

          if (emailError) {
            console.error('Update email error:', emailError);
          }
        }

        // Update admin role
        if (body.isAdmin !== undefined) {
          if (body.isAdmin) {
            // Add admin role
            const { error: roleError } = await supabaseAdmin
              .from('user_roles')
              .insert({
                user_id: body.userId,
                role: 'admin',
              })
              .select()
              .single();

            if (roleError && !roleError.message.includes('duplicate')) {
              console.error('Add admin role error:', roleError);
            }
          } else {
            // Remove admin role
            const { error: roleError } = await supabaseAdmin
              .from('user_roles')
              .delete()
              .eq('user_id', body.userId)
              .eq('role', 'admin');

            if (roleError) {
              console.error('Remove admin role error:', roleError);
            }
          }
        }

        console.log('User updated successfully:', body.userId);
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        if (!body.userId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Prevent deleting yourself
        if (body.userId === user.id) {
          return new Response(
            JSON.stringify({ error: 'Cannot delete your own account' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Delete from auth (this will cascade to users table via trigger)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(body.userId);

        if (deleteError) {
          console.error('Delete user error:', deleteError);
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('User deleted successfully:', body.userId);
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
