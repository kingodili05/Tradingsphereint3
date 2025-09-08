import { createClient } from 'npm:@supabase/supabase-js@2.56.1'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface StartTimerRequest {
  signal_id: string
  duration_minutes: number
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { signal_id, duration_minutes }: StartTimerRequest = await req.json()

    if (!signal_id || !duration_minutes) {
      return new Response(
        JSON.stringify({ error: 'Signal ID and duration are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if signal exists and is in created status
    const { data: signal, error: signalError } = await supabase
      .from('admin_trade_signals')
      .select('*')
      .eq('id', signal_id)
      .eq('status', 'created')
      .single()

    if (signalError || !signal) {
      return new Response(
        JSON.stringify({ error: 'Signal not found or already started' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const executionTime = new Date(Date.now() + duration_minutes * 60 * 1000)

    // Update signal to active with timer
    const { error: updateError } = await supabase
      .from('admin_trade_signals')
      .update({
        status: 'active',
        timer_start_time: new Date().toISOString(),
        execution_time: executionTime.toISOString(),
        timer_duration_minutes: duration_minutes,
        updated_at: new Date().toISOString()
      })
      .eq('id', signal_id)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        success: true,
        signal_id: signal_id,
        timer_start: new Date().toISOString(),
        execution_time: executionTime.toISOString(),
        duration_minutes: duration_minutes
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Start timer error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})