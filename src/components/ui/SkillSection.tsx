import { useState, useEffect, useCallback } from 'react';
import { 
  Typography, 
  Divider, 
  Box, 
  TextField, 
  Chip, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Avatar,
  Stack,
  InputAdornment,
  Tooltip,
  Fade,
  Grow,
  Skeleton,
  Alert,
  useMediaQuery,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { useSearchSkillsQuery } from '../../features/skills/api/skillsApi';
import { useAssignSkillMutation, useRemoveSkillMutation } from '../../features/users/api/usersApi';
import { Skill } from '../../features/skills/types/skillTypes';
import { matchSorter } from 'match-sorter';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadIcon from '@mui/icons-material/Upload';
import CustomButton from './CustomButton';
import { Style } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { RootState, AppDispatch } from "../../stores/store";
import { useSelector } from 'react-redux';


interface EscoSkillResult {
  uri: string;
  name: string;
  description?: string;
  category?: string;
}

interface SkillsSectionProps {
  userId: string;
  userSkills: Skill[];
  refetchUser: () => void;
}

const MotionChip = motion.create(Chip);
const MotionListItem = motion.create(ListItem);

const SkillsSection = ({ userId, userSkills, refetchUser }: SkillsSectionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: searchResults = [], isLoading: isSearching } = useSearchSkillsQuery(searchQuery, {
    skip: searchQuery.length < 2
  });
  const [assignSkill] = useAssignSkillMutation();
  const [removeSkill] = useRemoveSkillMutation();


  ////
  const [cvResults, setCvResults] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showCvDialog, setShowCvDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };
  //

 const {user}= useSelector((state: RootState) => state.auth)

    if (!user || user.role !=="team_member") {

      return null;
    }

  //
const handleConfirmSkills = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_API_URL_USERS}/${userId}/confirm-cv-skills`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ skillIds: selectedSkills }),
      }
    );
    
    if (!response.ok) throw new Error('Confirmation failed');
    
    setShowCvDialog(false);
    setSelectedSkills([]);
    setCvResults([]); // Clear CV results
    refetchUser(); // Refresh user data
  } catch (error) {
    setError(error.message);
  }
};
const { getRootProps, getInputProps } = useDropzone({
  accept: {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  multiple: false,
  onDragEnter: () => setIsDragging(true),
  onDragLeave: () => setIsDragging(false),
  onDrop: async (acceptedFiles) => {
    setIsDragging(false);
    if (acceptedFiles.length > 0) {
      await handleCvUpload(acceptedFiles[0]);
    }
  }
});

const handleCvUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_API_URL_USERS}/${userId}/upload-cv`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      }
    );
    
    if (!response.ok) throw new Error('Upload failed');
    
    const result = await response.json();
    setCvResults(result.skills);
    setShowCvDialog(true);
    setSelectedSkills([]);
  } catch (error) {
    setError(error.message);
  }
};




  // Debounce search input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError(null);
    setSearchQuery(value);
    setIsSearchOpen(value.length > 0);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };
  

  const handleAssignSkill = async (skillUri: string) => {
    try {
      await assignSkill({ userId, escoUri: skillUri }).unwrap();
      refetchUser();
      clearSearch();
    } catch (err) {
      setError('Failed to add skill. Please try again.');
      console.error('Failed to assign skill:', err);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await removeSkill({ userId, skillId }).unwrap();
      refetchUser();
    } catch (err) {
      setError('Failed to remove skill. Please try again.');
      console.error('Failed to remove skill:', err);
    }
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return 'primary.main';
    const hash = category.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main
    ];
    return colors[hash % colors.length];
  };

  // Improved search results with match highlighting
  const getHighlightedText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} style={{ fontWeight: 700, color: theme.palette.primary.main }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  const iconButtonStyles = {
    color: '#ffffff',
    backgroundColor: '#333333',
    '&:hover': {
      backgroundColor: '#1a1a1a',
      color: '#ffffff'
    }
  };
  // Sort results by relevance
  const sortedResults = matchSorter(searchResults, searchQuery, {
    keys: ['name', 'description', 'category'],
    threshold: matchSorter.rankings.CONTAINS
  });

  return (
    <Paper elevation={0} sx={{
      p: { xs: 2, md: 4 },
      borderRadius: 4,
      background: 'linear-gradient(to bottom right, #f9fafb 0%, #f3f4f6 100%)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Search Results Panel */}
      <AnimatePresence>
  {isSearchOpen && (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 2,
        mt: 2,
        background: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 3,
        maxHeight: 400,
        overflowY: 'auto' // Add scrolling
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="subtitle1">
          Search Results ({sortedResults.length})
        </Typography>
        <IconButton onClick={clearSearch} size="small">
          <ClearIcon fontSize="small" />
        </IconButton>
      </Box>
      {/* Add the results list here */}
      <List disablePadding>
        {sortedResults.map((skill) => (
          <MotionListItem 
            key={skill.uri}
            divider
            sx={{ px: 2, py: 1.5 }}
          >
            {/* ... existing list item content ... */}
          </MotionListItem>
        ))}
      </List>
    </Box>
  )}
</AnimatePresence>

      {/* Main Content */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ 
          color: 'text.primary',
          fontSize: { xs: '1.8rem', md: '2.125rem' }
        }}>
          Skills Portfolio
          <StarIcon sx={{ 
            color: 'warning.main',
            ml: 1.5,
            fontSize: { xs: '1.5rem', md: '2rem' },
            verticalAlign: 'middle'
          }} />
        </Typography>
      </Box>

      {/* Current Skills Section */}
      <Box mb={5}>
        <Box display="flex" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h6" fontWeight={700}>
            Your Skills Inventory
          </Typography>
          <Chip 
            label={`${userSkills?.length || 0} skills`}
            size="small"
            sx={{ 
              backgroundColor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <AnimatePresence>
          {userSkills?.length > 0 ? (
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {userSkills.map((skill, index) => (
                <Grow in key={skill._id} timeout={(index + 1) * 150}>
                  <Box>
                    <Tooltip 
                      title={
                        <Box>
                          <Typography variant="subtitle2">{skill.name}</Typography>
                          <Typography variant="caption">{skill.description || 'No description available'}</Typography>
                        </Box>
                      }
                      arrow
                    >
                      <MotionChip
                        avatar={
                          <Avatar sx={{ 
                            bgcolor: getCategoryColor(skill.category),
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}>
                            {skill.name.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        label={skill.name}
                        onDelete={() => handleRemoveSkill(skill._id)}
                        deleteIcon={<DeleteIcon />}
                        variant="outlined"
                        sx={{
                          mb: 1.5,
                          pr: 1,
                          borderWidth: 2,
                          '& .MuiChip-label': { 
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: isMobile ? '120px' : '200px'
                          },
                          '& .MuiChip-deleteIcon': {
                            color: 'text.secondary',
                            transition: '0.2s all',
                            '&:hover': { color: 'error.main' }
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      />
                    </Tooltip>
                  </Box>
                </Grow>
              ))}
            </Stack>
          ) : (
            <Fade in>
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight={150}
                border="2px dashed"
                borderColor="divider"
                borderRadius={2.5}
                sx={{ 
                  background: 'rgba(255,255,255,0.4)',
                  position: 'relative'
                }}
              >
                <Typography variant="body2" color="text.secondary" align="center">
                  No skills added yet
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Start building your portfolio below
                  </Typography>
                </Typography>
              </Box>
            </Fade>
          )}
        </AnimatePresence>
      </Box>

      <Divider sx={{ 
        my: 4, 
        borderWidth: 1, 
        borderColor: 'divider',
        opacity: 0.5 
      }} />

      {/* Enhanced Search Section */}
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Typography variant="h6" fontWeight={700}>
            Add New Skills
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={clearSearch}
            disabled={!searchQuery}
            startIcon={<ClearIcon />}
            sx={{ 
              color: '#333333',
              borderColor: '#333333',
              '&:hover': {
                borderColor: '#1a1a1a',
                backgroundColor: 'rgba(51, 51, 51, 0.04)'
              }
            }}
          >
            Clear Search
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="filled"
          size="medium"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1.5 }}>
                <SearchIcon sx={{ 
                  color: 'text.secondary', 
                  fontSize: 26,
                  transition: '0.3s all'
                }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} edge="end">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              '& .MuiFilledInput-input': { 
                py: 2.5,
                fontSize: { xs: '0.9rem', md: '1rem' }
              },
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }
            }
          }}
        />

        <Box mt={3}>
          {isSearching ? (
            <Box display="flex" flexDirection="column" gap={2}>
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={72}
                  sx={{ 
                    borderRadius: 2,
                    animation: 'pulse 2s infinite',
                  }}
                />
              ))}
            </Box>
          ) : sortedResults.length > 0 ? (
            <Paper elevation={0} sx={{ 
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
              maxHeight: 400,
              overflowY: 'auto'
            }}>
              <List disablePadding>
                <AnimatePresence>
                  {sortedResults.map((skill, index) => (
                    <MotionListItem 
                      key={skill.uri}
                      divider
                      sx={{
                        px: { xs: 2, md: 3 },
                        py: 2,
                        '&:hover': { 
                          backgroundColor: 'action.hover',
                          transform: 'translateX(4px)'
                        },
                        transition: '0.2s all'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        type: 'spring',
                        stiffness: 100,
                        delay: index * 0.05 
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Typography fontWeight={600} sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                              {getHighlightedText(skill.name, searchQuery)}
                            </Typography>
                            {skill.category && (
                              <Chip 
                                label={skill.category}
                                size="small"
                                sx={{ 
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: 0.5,
                                  bgcolor: getCategoryColor(skill.category),
                                  color: 'common.white'
                                }}
                              />
                            )}
                          </Box>
                        } 
                        secondary={
                          <Box
                            sx={{
                              display: 'block',
                              width: '100%', // Add explicit width
                              maxHeight: '4.5em', // 3 lines * 1.5 line-height
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 3,
                            }}
                          >
                            <Typography
                              component="div"
                              variant="body2"
                              sx={{
                                display: '-webkit-box',
                                lineHeight: 1.5,
                                color: theme.palette.text.secondary
                              }}
                            >
                              {getHighlightedText(skill.description || 'No description available', searchQuery)}
                            </Typography>
                          </Box>
                        }
                      />
                      <IconButton 
                        onClick={() => handleAssignSkill(skill.uri!)}
                        sx={iconButtonStyles} // Apply updated styles
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </MotionListItem>
                  ))}
                </AnimatePresence>
              </List>
            </Paper>
          ) : searchQuery.length >= 2 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={4}
              border="2px dashed"
              borderColor="divider"
              borderRadius={3}
            >
              <CheckCircleIcon sx={{ 
                fontSize: 48, 
                mb: 2, 
                color: 'text.disabled'
              }} />
              <Typography variant="body1" color="text.secondary" align="center">
                No matches found for "{searchQuery}"
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
      <Box mt={3} mb={5}>
      <Box
    {...getRootProps()}
    sx={{
      border: `3px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
      borderRadius: 4,
      p: 6,
      textAlign: 'center',
      backgroundColor: isDragging ? alpha(theme.palette.primary.light, 0.05) : 'background.paper',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[4]
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
        background: isDragging 
          ? `repeating-linear-gradient(
              45deg,
              ${alpha(theme.palette.primary.main, 0.1)},
              ${alpha(theme.palette.primary.main, 0.1)} 10px,
              transparent 10px,
              transparent 20px
            )`
          : 'none',
        animation: isDragging ? 'slide 3s linear infinite' : 'none',
        zIndex: 0
      }
    }}
  >
          <input {...getInputProps()} />
          
          <Box sx={{ 
      position: 'relative',
      zIndex: 1,
      color: isDragging ? 'primary.main' : 'text.secondary'
    }}>
      <Box
        component={motion.div}
        animate={{ 
          y: isDragging ? [-5, 5, -5] : 0,
          scale: isDragging ? 1.05 : 1
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <CloudUploadIcon sx={{ 
          fontSize: 64,
          mb: 2,
          filter: `drop-shadow(0 4px 8px ${alpha(theme.palette.primary.main, 0.2)})`
        }} />
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 700,
        letterSpacing: '-0.5px',
        mb: 1.5
      }}>
        {isDragging ? 'Drop to Upload CV' : 'Drag & Drop CV Here'}
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ 
        mb: 3,
        maxWidth: 480,
        mx: 'auto',
        lineHeight: 1.6
      }}>
        Supported formats: PDF, DOCX (Max 5MB)
        <br />
        <Box component="span" fontSize="0.9em" color="text.disabled">
          We'll analyze your CV and suggest relevant skills
        </Box>
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component="span"
        startIcon={<CloudUploadIcon />}
        sx={{  backgroundColor: '#333333',
          px: 4,
          py: 1.5,
          borderRadius: 50,
          fontWeight: 700,
          letterSpacing: '0.5px',
          transform: 'translateZ(0)',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: theme.shadows[6]
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 50,
            background: alpha(theme.palette.primary.contrastText, 0.1),
            opacity: 0,
            transition: 'opacity 0.3s'
          },
          '&:hover::before': {
            opacity: 1
          }
        }}
      >
        Browse Files
      </Button>

      {cvResults.length > 0 && (
        <Box mt={4} sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          animation: 'fadeIn 0.5s ease'
        }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="body1" fontWeight={500}>
              {cvResults.length} skills detected
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Ready to map to your profile
            </Typography>
          </Box>
        </Box>
      )}
    </Box>


        </Box>

        {/* File preview section */}
        {cvResults.length > 0 && (
    <Box mt={2} sx={{ 
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2.5,
      borderRadius: 2,
      backgroundColor: alpha(theme.palette.primary.main, 0.03),
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
    }}>
      <InsertDriveFileIcon sx={{ 
        color: theme.palette.primary.main,
        fontSize: 32 
      }} />
      <Box>
        <Typography variant="body1" fontWeight={500}>
          CV Analysis Complete
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Found {cvResults.length} relevant skills
        </Typography>
      </Box>
    </Box>
  )}

        {/* CV Skills Dialog */}
        {showCvDialog && (
          <Dialog 
            open={showCvDialog} 
            onClose={() => {
              setShowCvDialog(false);
              setCvResults([]);
              setSelectedSkills([]);
            }}
            fullWidth 
            maxWidth="md"
          >
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <CloudUploadIcon fontSize="large" />
                <Typography variant="h6">Detected Skills from CV</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                {cvResults.length} skills found. Select which ones to add:
              </Typography>
              
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {cvResults.map(skill => (
                  <ListItem 
                    key={skill._id}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={selectedSkills.includes(skill._id)}
                        onChange={() => handleSkillToggle(skill._id)}
                      />
                    }
                  >
                    <ListItemText
                      primary={skill.name}
                      secondary={skill.description || 'No description available'}
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowCvDialog(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleConfirmSkills}
                disabled={selectedSkills.length === 0}
              >
                Add Selected ({selectedSkills.length})
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Paper>
    
  );
};

export default SkillsSection;