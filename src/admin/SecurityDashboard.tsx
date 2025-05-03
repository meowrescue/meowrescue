/**
 * Admin Security Dashboard
 * 
 * This component provides security monitoring features for administrators.
 * It displays audit logs, security events, and system status.
 * 
 * IMPORTANT: This component is only accessible to users with admin permissions
 * and does not affect the visual appearance of the main application.
 */

import React, { useEffect, useState } from 'react';
import { getClient } from '@/utils/supabaseClient';
import { AuditImpact } from '@/services/auditLogging';

// Types for audit log entries
interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id: string;
  impact: AuditImpact;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
  profiles?: {
    email: string;
    username: string;
  };
}

const SecurityDashboard: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [impactFilter, setImpactFilter] = useState<AuditImpact | 'all'>('all');
  
  const supabase = getClient();
  
  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      
      try {
        // Calculate date range based on timeframe
        const now = new Date();
        let startDate = new Date();
        
        switch (timeframe) {
          case '24h':
            startDate.setDate(now.getDate() - 1);
            break;
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
        }
        
        // Build the query
        let query = supabase
          .from('audit_logs')
          .select(`
            *,
            profiles:user_id (
              email,
              username
            )
          `)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false })
          .limit(100);
        
        // Apply impact filter if not 'all'
        if (impactFilter !== 'all') {
          query = query.eq('impact', impactFilter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setAuditLogs(data || []);
      } catch (err) {
        setError('Failed to load audit logs');
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuditLogs();
  }, [timeframe, impactFilter]);
  
  // Get color for impact level
  const getImpactColor = (impact: AuditImpact): string => {
    switch (impact) {
      case AuditImpact.LOW:
        return 'text-green-600';
      case AuditImpact.MEDIUM:
        return 'text-yellow-600';
      case AuditImpact.HIGH:
        return 'text-orange-600';
      case AuditImpact.CRITICAL:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8" aria-label="Security Dashboard (Admin Only)">
      <h1 className="text-2xl font-bold mb-4">Security Dashboard</h1>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">Timeframe</label>
          <select
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '24h' | '7d' | '30d')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="impact" className="block text-sm font-medium text-gray-700">Impact Level</label>
          <select
            id="impact"
            value={impactFilter}
            onChange={(e) => setImpactFilter(e.target.value as AuditImpact | 'all')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Impacts</option>
            <option value={AuditImpact.LOW}>Low</option>
            <option value={AuditImpact.MEDIUM}>Medium</option>
            <option value={AuditImpact.HIGH}>High</option>
            <option value={AuditImpact.CRITICAL}>Critical</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p>Loading security logs...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No audit logs found for the selected criteria.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.profiles?.username || log.profiles?.email || log.user_id || 'System'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.resource} {log.resource_id ? `(${log.resource_id})` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getImpactColor(log.impact as AuditImpact)}>
                        {log.impact}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ip_address}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
