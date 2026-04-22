import { createClient } from 'npm:@supabase/supabase-js@2.56.1'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",  
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface ExecuteSignalRequest {
  signal_id: string
  force_outcome?: 'profit' | 'loss' | null
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

    const { signal_id, force_outcome }: ExecuteSignalRequest = await req.json()

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
      .from('admin_trade_signals')
      .select('*')
      .eq('id', signal_id)
      .eq('status', 'active')
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

    // Get all participants
    const { data: participants, error: participantsError } = await supabase
      .from('signal_participants')
      .select('*')
      .eq('signal_id', signal_id)
      .is('settled_at', null)

    if (participantsError) {
      throw participantsError
    }

    const participantCount = participants?.length || 0
    const totalVolume = participants?.reduce((sum, p) => sum + p.investment_amount, 0) || 0

    // Determine outcome
    let outcome: string
    let profitMultiplier: number

    if (force_outcome) {
      outcome = force_outcome
    } else {
      // Use signal's win probability
      outcome = Math.random() < signal.win_probability ? 'profit' : 'loss'
    }

    if (outcome === 'profit') {
      profitMultiplier = signal.take_profit_percentage / 100
    } else {
      profitMultiplier = -(signal.stop_loss_percentage / 100)
    }

    // Process each participant
    if (participants && participants.length > 0) {
      for (const participant of participants) {
        const profitLossAmount = participant.investment_amount * profitMultiplier
        const finalBalance = participant.entry_balance + participant.investment_amount + profitLossAmount

        // Update participant record
        await supabase
          .from('signal_participants')
          .update({
            final_balance: finalBalance,
            profit_loss_amount: profitLossAmount,
            profit_loss_percentage: profitMultiplier * 100,
            settled_at: new Date().toISOString()
          })
          .eq('id', participant.id)

        // Get current balance
        const { data: currentBalance } = await supabase
          .from('balances')
          .select('*')
          .eq('user_id', participant.user_id)
          .eq('currency', 'USD')
          .single()

        if (currentBalance) {
          // Update user balance
          await supabase
            .from('balances')
            .update({
              balance: currentBalance.balance + profitLossAmount,
              available_balance: currentBalance.available_balance + participant.investment_amount + profitLossAmount,
              locked_balance: Math.max(0, currentBalance.locked_balance - participant.investment_amount),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', participant.user_id)
            .eq('currency', 'USD')
        }

        // Send notification to user
        await supabase
          .from('messages')
          .insert({
            user_id: participant.user_id,
            title: `Trade Signal Executed: ${signal.signal_name}`,
            content: `Your trade signal has been executed with a ${outcome} of $${Math.abs(profitLossAmount).toFixed(2)}. Your investment: $${participant.investment_amount}`,
            message_type: 'system',
            is_important: true
          })
      }
    }

    // Mark signal as executed
    await supabase
      .from('admin_trade_signals')
      .update({
        status: 'executed',
        execution_result: outcome,
        executed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', signal_id)

    // Log execution
    await supabase
      .from('trade_executions')
      .insert({
        signal_id: signal_id,
        executed_by: signal.created_by, // Admin who created the signal
        execution_type: force_outcome ? 'manual' : 'automatic',
        participants_count: participantCount,
        total_volume: totalVolume,
        outcome: outcome,
        profit_multiplier: profitMultiplier,
        execution_details: {
          signal_name: signal.signal_name,
          commodity: signal.commodity,
          direction: signal.trade_direction,
          execution_time: new Date().toISOString(),
          force_outcome: force_outcome || null
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        signal_id: signal_id,
        outcome: outcome,
        participants: participantCount,
        total_volume: totalVolume,
        profit_multiplier: profitMultiplier
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Execute signal error:', error)
    
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