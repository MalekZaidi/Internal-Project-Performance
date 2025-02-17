import React from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const Reports: React.FC = () => {
  const reportsData = [
    { id: 1, project: 'Project 1', status: 'Completed', budget: '$5000', risk: 'Low' },
    { id: 2, project: 'Project 2', status: 'In Progress', budget: '$10000', risk: 'High' },
    { id: 3, project: 'Project 3', status: 'Not Started', budget: '$8000', risk: 'Medium' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Risk Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportsData.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.project}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>{report.budget}</TableCell>
                <TableCell>{report.risk}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Reports;
