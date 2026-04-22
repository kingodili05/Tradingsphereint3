'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useBalances } from '@/hooks/use-balances';
import { AlertTriangle, Wallet, TrendingUp, CreditCard, ArrowUpFromLine } from 'lucide-react';
import Link from 'next/link';

interface BalanceValidationProps {
  tradeAmount: number;
  onValidationChange: (isValid: boolean, errorMessage: string | null) => void;
}

export function BalanceValidationSystem({ tradeAmount, onValidationChange }: BalanceValidationProps) {
  const { user, profile } = useAuth();
  const { balances, getTotalBalanceUSD, getBalanceByCurrency } = useBalances();
  
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    errorType: 'none' | 'zero_balance' | 'insufficient' | 'unverified' | 'pending';
    errorMessage: string | null;
    suggestion: string | null;
  }>({
    isValid: true,
    errorType: 'none',
    errorMessage: null,
    suggestion: null
  });

  useEffect(() => {
    validateTrade();
  }, [tradeAmount, balances, profile]);

  const validateTrade = () => {
    const usdBalance = getBalanceByCurrency('USD');
    
    // Account not verified
    if (!profile?.is_email_verified) {
      const status = {
        isValid: false,
        errorType: 'unverified' as const,
        errorMessage: 'Your account email is not verified',
        suggestion: 'Please verify your email address before trading'
      };
      setValidationStatus(status);
      onValidationChange(status.isValid, status.errorMessage);
      return;
    }

    // Account pending
    if (profile?.account_status !== 'active') {
      const status = {
        isValid: false,
        errorType: 'pending' as const,
        errorMessage: 'Your account is pending approval',
        suggestion: 'Please wait for admin approval or contact support'
      };
      setValidationStatus(status);
      onValidationChange(status.isValid, status.errorMessage);
      return;
    }

    // Zero balance
    if (usdBalance === 0) {
      const status = {
        isValid: false,
        errorType: 'zero_balance' as const,
        errorMessage: 'You have no available funds to trade',
        suggestion: 'Deposit funds to your account to start trading'
      };
      setValidationStatus(status);
      onValidationChange(status.isValid, status.errorMessage);
      return;
    }

    // Insufficient balance for trade
    if (tradeAmount > 0 && tradeAmount > usdBalance) {
      const deficit = tradeAmount - usdBalance;
      const status = {
        isValid: false,
        errorType: 'insufficient' as const,
        errorMessage: `Insufficient funds. You need $${deficit.toFixed(2)} more to execute this trade`,
        suggestion: `Your available balance: $${usdBalance.toFixed(2)}`
      };
      setValidationStatus(status);
      onValidationChange(status.isValid, status.errorMessage);
      return;
    }

    // Valid trade
    const status = {
      isValid: true,
      errorType: 'none' as const,
      errorMessage: null,
      suggestion: null
    };
    setValidationStatus(status);
    onValidationChange(status.isValid, status.errorMessage);
  };

  const getAlertIcon = () => {
    switch (validationStatus.errorType) {
      case 'zero_balance': return <Wallet className="h-4 w-4" />;
      case 'insufficient': return <AlertTriangle className="h-4 w-4" />;
      case 'unverified': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getAlertColor = () => {
    switch (validationStatus.errorType) {
      case 'zero_balance': return 'border-orange-200 bg-orange-50';
      case 'insufficient': return 'border-red-200 bg-red-50';
      case 'unverified': return 'border-yellow-200 bg-yellow-50';
      case 'pending': return 'border-blue-200 bg-blue-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  const getTextColor = () => {
    switch (validationStatus.errorType) {
      case 'zero_balance': return 'text-orange-800';
      case 'insufficient': return 'text-red-800';
      case 'unverified': return 'text-yellow-800';
      case 'pending': return 'text-blue-800';
      default: return 'text-green-800';
    }
  };

  const getRemainingBalance = () => {
    const usdBalance = getBalanceByCurrency('USD');
    return Math.max(0, usdBalance - tradeAmount);
  };

  const getBalanceUtilization = () => {
    const usdBalance = getBalanceByCurrency('USD');
    if (usdBalance === 0) return 0;
    return Math.min(100, (tradeAmount / usdBalance) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Balance Validation Alert */}
      {!validationStatus.isValid && (
        <Alert className={getAlertColor()}>
          <div className={getTextColor()}>
            {getAlertIcon()}
          </div>
          <AlertDescription className={getTextColor()}>
            <div className="space-y-2">
              <div className="font-semibold">{validationStatus.errorMessage}</div>
              {validationStatus.suggestion && (
                <div className="text-sm">{validationStatus.suggestion}</div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-2 mt-3">
                {validationStatus.errorType === 'zero_balance' && (
                  <Link href="/finance">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <ArrowUpFromLine className="h-4 w-4 mr-1" />
                      Deposit Funds
                    </Button>
                  </Link>
                )}
                
                {validationStatus.errorType === 'insufficient' && (
                  <>
                    <Link href="/finance">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <ArrowUpFromLine className="h-4 w-4 mr-1" />
                        Add Funds
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // Auto-adjust trade to available balance
                        const maxAffordable = Math.floor(getBalanceByCurrency('USD') * 100) / 100;
                        if (maxAffordable > 0) {
                          // This would need to be handled by parent component
                          console.log('Adjust trade to:', maxAffordable);
                        }
                      }}
                    >
                      Use Max Available
                    </Button>
                  </>
                )}
                
                {validationStatus.errorType === 'unverified' && (
                  <Link href="/profile">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <CreditCard className="h-4 w-4 mr-1" />
                      Verify Account
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Balance Utilization Display */}
      {tradeAmount > 0 && validationStatus.isValid && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Balance Utilization</span>
                <span>{getBalanceUtilization().toFixed(1)}%</span>
              </div>
              <Progress value={getBalanceUtilization()} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-muted-foreground">Trade Cost</div>
                  <div className="font-semibold">${tradeAmount.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Available</div>
                  <div className="font-semibold">${getBalanceByCurrency('USD').toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Remaining</div>
                  <div className="font-semibold">${getRemainingBalance().toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}