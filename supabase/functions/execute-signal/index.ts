import { createClient } from 'npm:@supabase/supabase-js@2.56.1'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface SignalExecutionRequest {
  signal_id: string
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

    const { signal_id }: SignalExecutionRequest = await req.json()

    if (!signal_id) {
      return new Response(
        JSON.stringify({ error: 'Signal ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get signal details
    const { data: signal, error: signalError } = await supabase
      .from('signals')
      .select('*')
      .eq('id', signal_id)
      .eq('status', 'open')
      .single()

    if (signalError || !signal) {
      return new Response(
        JSON.stringify({ error: 'Signal not found or not active' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get all users who joined this signal
    const { data: signalUsages, error: usageError } = await supabase
      .from('signal_usage')
      .select('*')
      .eq('signal_id', signal_id)
      .eq('status', 'pending')

    if (usageError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch signal usage' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!signalUsages || signalUsages.length === 0) {
      // No users joined, just mark signal as executed
      await supabase
        .from('signals')
        .update({ status: 'executed', updated_at: new Date().toISOString() })
        .eq('id', signal_id)

      return new Response(
        JSON.stringify({ 
          message: 'Signal executed with no participants',
          participants: 0
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Simulate signal outcome (in real implementation, this would be based on actual market data)
    // For demo purposes, we'll randomly determine if the signal hit profit target or loss limit
    const random = Math.random()
    const hitProfitTarget = random > 0.4 // 60% chance of hitting profit target
    
    const resultMultiplier = hitProfitTarget ? signal.profit_target : -signal.loss_limit
    
    // Process each user's position
    const updates = []
    const balanceUpdates = []
    
    for (const usage of signalUsages) {
      const result = usage.amount * resultMultiplier
      const finalAmount = usage.amount + result
      
      updates.push({
        id: usage.id,
        result: result,
        status: 'settled',
        settled_at: new Date().toISOString()
      })

      // Get current balance
      const { data: currentBalance } = await supabase
        .from('balances')
        .select('balance, available_balance, locked_balance')
        .eq('user_id', usage.user_id)
        .eq('currency', 'USD')
        .single()

      if (currentBalance) {
        balanceUpdates.push({
          user_id: usage.user_id,
          new_balance: currentBalance.balance + result,
          new_available_balance: currentBalance.available_balance + finalAmount,
          new_locked_balance: Math.max(0, currentBalance.locked_balance - usage.amount)
        })
      }
    }

    // Update signal usage records
    for (const update of updates) {
      await supabase
        .from('signal_usage')
        .update({
          result: update.result,
          status: update.status,
          settled_at: update.settled_at
        })
        .eq('id', update.id)
    }

    // Update user balances
    for (const balanceUpdate of balanceUpdates) {
      await supabase
        .from('balances')
        .update({
          balance: balanceUpdate.new_balance,
          available_balance: balanceUpdate.new_available_balance,
          locked_balance: balanceUpdate.new_locked_balance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', balanceUpdate.user_id)
        .eq('currency', 'USD')
    }

    // Mark signal as executed
    await supabase
      .from('signals')
      .update({ 
        status: 'executed', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', signal_id)

    return new Response(
      JSON.stringify({
        message: 'Signal executed successfully',
        participants: signalUsages.length,
        outcome: hitProfitTarget ? 'profit_target_hit' : 'loss_limit_hit',
        result_multiplier: resultMultiplier
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Signal execution error:', error)
    
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