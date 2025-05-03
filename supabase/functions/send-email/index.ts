import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Check if this is an authenticated request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if the user is an admin or staff
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Admin or staff role required.' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get request body
    const { messageId, reply } = await req.json()
    
    if (!messageId || !reply) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the contact message
    const { data: message, error: messageError } = await supabase
      .from('contact_messages')
      .select('email, name, subject')
      .eq('id', messageId)
      .single()
    
    if (messageError || !message) {
      return new Response(
        JSON.stringify({ error: 'Message not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update the message as responded
    const { error: updateError } = await supabase
      .from('contact_messages')
      .update({
        response: reply,
        responded_at: new Date().toISOString(),
        status: 'Replied'
      })
      .eq('id', messageId)
    
    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update message status' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // TODO: Implement actual email sending here
    // For now, we'll just log the data and return success
    console.log('Would send email to:', message.email)
    console.log('Subject:', `Re: ${message.subject || 'Your message to Meow Rescue'}`)
    console.log('Reply:', reply)

    // In a real implementation, you would use a service like SendGrid, SMTP, etc.
    // Example with a hypothetical email service:
    // await emailService.send({
    //   to: message.email,
    //   from: 'support@meowrescue.org',
    //   subject: `Re: ${message.subject || 'Your message to Meow Rescue'}`,
    //   text: reply,
    // })

    return new Response(
      JSON.stringify({ success: true, message: 'Reply sent' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
