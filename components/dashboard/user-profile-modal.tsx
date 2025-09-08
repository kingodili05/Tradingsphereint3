'use client';

import { Button } from '@/components/ui/button';
import { X, User, CreditCard, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfileModalProps {
  onClose: () => void;
}

export function UserProfileModal({ onClose }: UserProfileModalProps) {
  const handleProfile = () => {
    toast.info('Opening profile settings...');
    onClose();
  };

  const handleDeposit = () => {
    toast.info('Opening deposit page...');
    onClose();
  };

  const handleWithdraw = () => {
    toast.info('Opening withdrawal page...');
    onClose();
  };

  const handleVerifyEmail = () => {
    toast.success('Email verification sent!');
  };

  const handleVerifyIdentity = () => {
    toast.info('Opening identity verification...');
  };

  const handleVerifyAddress = () => {
    toast.info('Opening address verification...');
  };

  const handleMoreDetails = () => {
    toast.info('Opening detailed profile...');
    onClose();
  };

  const verificationItems = [
    { label: 'Email Status', status: 'VERIFIED', verified: true, handler: handleVerifyEmail },
    { label: 'Identity Status', status: 'NOT VERIFIED', verified: false, handler: handleVerifyIdentity },
    { label: 'Address Status', status: 'NOT VERIFIED', verified: false, handler: handleVerifyAddress },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-96 max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-lg font-semibold">User Profile</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-green-400 font-semibold">Lloyd Branco</div>
              <div className="text-gray-400 text-sm">Stock Trading</div>
              <div className="text-gray-400 text-sm">$ 0.</div>
              <div className="text-gray-400 text-sm">🟢 0 BTC</div>
            </div>
          </div>

          {/* Trading Plan */}
          <div className="bg-red-900 border-2 border-red-500 border-dashed rounded-lg p-4 mb-6 text-center">
            <div className="text-white font-bold">Current Trading Plan: STARTER</div>
          </div>

          {/* Verification Status with buttons side by side */}
          <div className="space-y-3 mb-6">
            {verificationItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-gray-400">{item.label} :</span>
                <div className="flex items-center space-x-2">
                  <span className={item.verified ? 'text-green-400' : 'text-red-400'}>
                    {item.verified ? '✓' : '✗'} {item.status}
                  </span>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
                    onClick={item.handler}
                  >
                    Verify Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm flex items-center justify-center"
              onClick={handleProfile}
            >
              <User className="h-4 w-4 mr-1" />
              Profile
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white py-2 text-sm flex items-center justify-center"
              onClick={handleDeposit}
            >
              <Download className="h-4 w-4 mr-1" />
              Deposit
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white py-2 text-sm flex items-center justify-center"
              onClick={handleWithdraw}
            >
              <Upload className="h-4 w-4 mr-1" />
              Withdraw
            </Button>
          </div>

          {/* More Details */}
          <Button
            variant="outline"
            className="w-full border-gray-600 text-gray-400 hover:text-white"
            onClick={handleMoreDetails}
          >
            More Details
          </Button>
        </div>
      </div>
    </div>
  );
}
