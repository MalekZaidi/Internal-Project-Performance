  import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  IconButton,
  MenuItem,
  Container,
  Box
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores/store';

const PositionRates = () => {
  const [positions, setPositions] = useState([
    {
      id: 1,
      position: 'Frontend Developer',
      experienceRanges: [
        { id: 1, minYears: 0, maxYears: 2, rate: 35 },
        { id: 2, minYears: 3, maxYears: 5, rate: 49 },
        { id: 3, minYears: 6, maxYears: 10, rate: 65 }
      ]
    },
    {
      id: 2,
      position: 'Backend Developer',
      experienceRanges: [
        { id: 4, minYears: 0, maxYears: 2, rate: 38 },
        { id: 5, minYears: 3, maxYears: 5, rate: 52 }
      ]
    }
  ]);

  const [newPosition, setNewPosition] = useState('');
  const [newExperience, setNewExperience] = useState({ min: '', max: '', rate: '' });

  const commonPositions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'DevOps Engineer',
    'QA Engineer'
  ];

  const handleAddPosition = () => {
    if (newPosition) {
      setPositions([
        ...positions,
        {
          id: positions.length + 1,
          position: newPosition,
          experienceRanges: []
        }
      ]);
      setNewPosition('');
    }
  };

  const handleAddExperience = (positionId) => {
    setPositions(positions.map(pos => {
      if (pos.id === positionId) {
        return {
          ...pos,
          experienceRanges: [
            ...pos.experienceRanges,
            {
              id: pos.experienceRanges.length + 1,
              minYears: parseInt(newExperience.min),
              maxYears: parseInt(newExperience.max),
              rate: parseInt(newExperience.rate)
            }
          ]
        };
      }
      return pos;
    }));
    setNewExperience({ min: '', max: '', rate: '' });
  };
 

const {user} = useSelector((state:RootState)=>state.auth)
  

 if (!user || user.role!=='admin') {

  return null
 }





  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 , width:1000}}>
        <Typography variant="h4" gutterBottom>
          Hourly Rate Configuration
        </Typography>
        
        {/* Add New Position Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Add New Position</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              label="Select Position"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              sx={{ minWidth: 250 }}
            >
              {commonPositions.map((pos) => (
                <MenuItem key={pos} value={pos}>{pos}</MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              onClick={handleAddPosition}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Position
            </Button>
          </Box>
        </Paper>

        {/* Rate Configuration Table */}
        {positions.map((position) => (
          <Paper key={position.id} sx={{ mb: 3, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{position.position}</Typography>
              <IconButton color="error">
                <DeleteOutlineIcon />
              </IconButton>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Experience Range (Years)</TableCell>
                    <TableCell>Hourly Rate (TND)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {position.experienceRanges.map((range) => (
                    <TableRow key={range.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <TextField
                            type="number"
                            value={range.minYears}
                            size="small"
                            sx={{ width: 100 }}
                          />
                          <Typography>-</Typography>
                          <TextField
                            type="number"
                            value={range.maxYears}
                            size="small"
                            sx={{ width: 100 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={range.rate}
                          size="small"
                          sx={{ width: 150 }}
                          InputProps={{
                            endAdornment: <Typography variant="body2">TND</Typography>
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="error">
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          type="number"
                          placeholder="Min"
                          value={newExperience.min}
                          onChange={(e) => setNewExperience({ ...newExperience, min: e.target.value })}
                          size="small"
                          sx={{ width: 100 }}
                        />
                        <Typography>-</Typography>
                        <TextField
                          type="number"
                          placeholder="Max"
                          value={newExperience.max}
                          onChange={(e) => setNewExperience({ ...newExperience, max: e.target.value })}
                          size="small"
                          sx={{ width: 100 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        placeholder="Rate"
                        value={newExperience.rate}
                        onChange={(e) => setNewExperience({ ...newExperience, rate: e.target.value })}
                        size="small"
                        sx={{ width: 150 }}
                        InputProps={{
                          endAdornment: <Typography variant="body2">TND</Typography>
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        onClick={() => handleAddExperience(position.id)}
                        startIcon={<AddCircleOutlineIcon />}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" size="large" sx={{ px: 5 }}>
            Save All Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PositionRates;