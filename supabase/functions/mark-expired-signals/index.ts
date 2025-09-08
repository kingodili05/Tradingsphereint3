import { createClient } from 'npm:@supabase/supabase-js@2.56.1'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

    // Mark expired signals
    const { data: expiredSignals, error: markError } = await supabase
      .from('signals')
      .update({ 
        status: 'expired', 
        updated_at: new Date().toISOString() 
      })
      .eq('status', 'open')
      .lte('expiry', new Date().toISOString())
      .select('id')

    if (markError) {
      throw markError
    }

    // For each expired signal, return funds to users
    if (expiredSignals && expiredSignals.length > 0) {
      for (const signal of expiredSignals) {
        // Get all pending signal usage for this expired signal
        const { data: pendingUsages, error: usageError } = await supabase
          .from('signal_usage')
          .select('*')
          .eq('signal_id', signal.id)
          .eq('status', 'pending')

        if (usageError || !pendingUsages) continue

        // Return funds to users and mark as cancelled
        for (const usage of pendingUsages) {
          // Get current balance
          const { data: currentBalance } = await supabase
            .from('balances')
            .select('balance, available_balance, locked_balance')
            .eq('user_id', usage.user_id)
            .eq('currency', 'USD')
            .single()

          if (currentBalance) {
            // Return locked funds to available balance
            await supabase
              .from('balances')
              .update({
                available_balance: currentBalance.available_balance + usage.amount,
                locked_balance: Math.max(0, currentBalance.locked_balance - usage.amount),
                updated_at: new Date().toISOString()
              })
              .eq('user_id', usage.user_id)
              .eq('currency', 'USD')
          }

          // Mark signal usage as cancelled
          await supabase
            .from('signal_usage')
            .update({
              status: 'cancelled',
              settled_at: new Date().toISOString()
            })
            .eq('id', usage.id)
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Expired signals processed',
        expired_count: expiredSignals?.length || 0
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Mark expired signals error:', error)
    
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