import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Container } from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SecurityLog {
  id: string;
  timestamp: string;
  ip: string;
  action: string;
  user: string;
}

const AdminSecurity: React.FC = () => {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch security logs from API endpoint
    const fetchSecurityLogs = async () => {
      try {
        // Replace 'your-api-endpoint' with the actual API endpoint
        const response = await fetch('your-api-endpoint');
        const data = await response.json();
        setSecurityLogs(data);
      } catch (error) {
        console.error('Error fetching security logs:', error);
      }
    };

    fetchSecurityLogs();
  }, []);

  // Filter security logs based on search query
  const filteredLogs = securityLogs.filter(log =>
    log.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Convert Set to Array before iteration
  const uniqueIPs = Array.from(new Set(securityLogs.map(log => log.ip)));

  return (
    <Layout>
      <Container>
        <SectionHeading title="Admin Security" subtitle="Monitor security logs and user activity" centered={false} />

        <div className="mb-4">
          <Label htmlFor="search">Search Security Logs:</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search by IP, action, or user"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <h3>Unique IPs:</h3>
          <ul>
            {uniqueIPs.map((ip, index) => (
              <li key={index}>{ip}</li>
            ))}
          </ul>
        </div>

        <Table>
          <TableCaption>A list of recent security logs on your account.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Timestamp</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.timestamp}</TableCell>
                <TableCell>{log.ip}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button variant="outline" onClick={() => alert('Download logs functionality')}>Download Logs</Button>
      </Container>
    </Layout>
  );
};

export default AdminSecurity;
