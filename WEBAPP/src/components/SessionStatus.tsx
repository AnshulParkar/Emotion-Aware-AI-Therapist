'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import SessionManager from '../lib/sessionManager';

interface SessionStatusProps {
  className?: string;
}

const SessionStatus: React.FC<SessionStatusProps> = ({ className = '' }) => {
  const { data: session } = useSession();
  const [sessionInfo, setSessionInfo] = useState({
    timeRemaining: '',
    expiringSoon: false,
    isIncognito: false,
    daysRemaining: 0,
    hoursRemaining: 0
  });

  useEffect(() => {
    if (session) {
      const updateSessionInfo = async () => {
        const timeRemaining = SessionManager.getSessionTimeRemaining(session);
        const expiringSoon = SessionManager.isSessionExpiringSoon(session);
        const isIncognito = await SessionManager.isIncognitoMode();
        
        // Calculate exact time remaining
        const expiryTime = new Date(session.expires).getTime();
        const now = Date.now();
        const msRemaining = expiryTime - now;
        const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        setSessionInfo({
          timeRemaining,
          expiringSoon,
          isIncognito,
          daysRemaining,
          hoursRemaining
        });
      };
      
      updateSessionInfo();
      const interval = setInterval(updateSessionInfo, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleManualSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const getStatusColor = () => {
    if (sessionInfo.daysRemaining <= 1) return 'text-red-600 dark:text-red-400';
    if (sessionInfo.daysRemaining <= 7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getStatusIcon = () => {
    if (sessionInfo.daysRemaining <= 1) return '🔴';
    if (sessionInfo.daysRemaining <= 7) return '🟡';
    return '🟢';
  };

  if (!session) return null;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transition-colors duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">🔐</span>
          Session Status
        </h3>
        <span className="text-sm">{getStatusIcon()}</span>
      </div>

      <div className="space-y-4">
        {/* Current Session Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Current Session</div>
          <div className={`text-lg font-medium ${getStatusColor()}`}>
            Expires in {sessionInfo.timeRemaining}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(session.expires).toLocaleString()}
          </div>
        </div>

        {/* Session Deletion Scenarios */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your session will be deleted when:
          </div>
          
          <div className="space-y-2 text-sm">
            {/* 30 day expiration */}
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">✅</span>
              <div>
                <div className={`font-medium ${getStatusColor()}`}>
                  30 days pass (automatic expiration)
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">
                  Current: {sessionInfo.daysRemaining} days, {sessionInfo.hoursRemaining} hours remaining
                </div>
              </div>
            </div>

            {/* Manual logout */}
            <div className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">✅</span>
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  You click &quot;Sign Out&quot; (manual logout)
                </div>
                <button 
                  onClick={handleManualSignOut}
                  className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded mt-1 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Sign Out Now
                </button>
              </div>
            </div>

            {/* Browser cookies cleared */}
            <div className="flex items-start space-x-2">
              <span className="text-orange-500 mt-0.5">✅</span>
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  Browser cookies are cleared (manual deletion)
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">
                  Via browser settings or privacy tools
                </div>
              </div>
            </div>

            {/* Browser closes in incognito */}
            <div className="flex items-start space-x-2">
              <span className={`${sessionInfo.isIncognito ? 'text-red-500' : 'text-gray-400'} mt-0.5`}>
                {sessionInfo.isIncognito ? '🔥' : '✅'}
              </span>
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  Browser closes (in private/incognito mode)
                </div>
                <div className={`text-xs ${sessionInfo.isIncognito ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {sessionInfo.isIncognito ? 'Currently in private browsing mode!' : 'Currently in normal browsing mode'}
                </div>
              </div>
            </div>

            {/* JWT token invalid */}
            <div className="flex items-start space-x-2">
              <span className="text-purple-500 mt-0.5">✅</span>
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  JWT token becomes invalid (server-side validation fails)
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">
                  Corruption, tampering, or server security changes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-4 pt-4 border-t dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <div className="font-medium mb-1">💡 Security Tips:</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>Sign out when using shared computers</li>
              <li>Session refreshes automatically when you&apos;re active</li>
              <li>Private browsing sessions end when browser closes</li>
              <li>Your session is encrypted and secure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionStatus;