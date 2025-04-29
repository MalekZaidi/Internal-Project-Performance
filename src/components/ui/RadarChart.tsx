import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Typography, Paper, Avatar, Box } from '@mui/material';
const getInitials=(fullName: string): string => {
  if (!fullName) return "";

  const names = fullName.trim().split(" ");
  const initials = names.slice(0, 2).map(name => name.charAt(0).toUpperCase());

  return initials.join("");
}
const colors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', 
  '#00C49F', '#FFBB28', '#a05195', '#d45087',
  '#f95d6a', '#ff7c43', '#ffa600'
];

type Skill = {
  _id: string;
  name: string;
  level?: number;
};

type MemberSkill = {
  userId: string;
  fullName: string;
  skills: Skill[];
};

type RadarChartProps = {
  projectSkills: Skill[];
  memberSkills: MemberSkill[];
};

const CustomTooltip = ({ active, payload, memberSkills }: any) => {
  const theme = useTheme();
  
  if (active && payload?.length) {
    return (
      <Paper sx={{ 
        p: 2, 
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[3],
        minWidth: 200
      }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {payload[0].payload.skill}
        </Typography>
        {payload.map((entry: any, index: number) => {
          const member = memberSkills.find((m: MemberSkill) => m.fullName === entry.name);
          return (
            <Box key={index} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              mb: 1,
              borderLeft: `3px solid ${entry.color}`
            }}>
              <Avatar sx={{ 
                width: 28, 
                height: 28, 
                bgcolor: entry.color,
                fontSize: '0.8rem'
              }}>
                {getInitials(entry.name)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {entry.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Match: {entry.value}%
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Paper>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 2, 
      justifyContent: 'center',
      p: 2
    }}>
      {payload.map((entry: any, index: number) => (
        <Box key={index} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          px: 1.5,
          py: 0.5,
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            bgcolor: entry.color,
            borderRadius: '50%' 
          }} />
          <Typography variant="caption" fontWeight={500}>
            {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function TeamRadarChart({ projectSkills, memberSkills }: RadarChartProps) {
  const theme = useTheme();

  // Get unique skill names from project
  const skillNames = [...new Set(projectSkills.map(skill => skill.name))];

  // Build data points
  const chartData = skillNames.map(skillName => {
    const point: any = { skill: skillName };
    memberSkills.forEach(member => {
      const hasSkill = member.skills.some(s => s.name === skillName);
      point[member.fullName] = hasSkill ? 100 : 0;
    });
    return point;
  });

  return (
    <Box sx={{ 
      position: 'relative',
      height: 400,
      width: '100%',
      '& .recharts-polar-angle-axis-tick-value': {
        fill: `${theme.palette.text.primary} !important`,
        fontSize: '0.8rem !important'
      }
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius="80%"
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          data={chartData}
        >
          <PolarGrid 
            stroke={theme.palette.divider}
            strokeOpacity={0.5}
          />
          <PolarAngleAxis  width={'100%'}
            dataKey="skill" 
            tickLine={{ stroke: theme.palette.divider }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]}
            tick={{ fill: theme.palette.text.secondary }}
            axisLine={{ stroke: theme.palette.divider }}
          />
          <Tooltip 
            content={<CustomTooltip memberSkills={memberSkills} />}
            wrapperStyle={{ outline: 'none' }}
          />
          <Legend 
            content={<CustomLegend />}
            wrapperStyle={{ paddingTop: 20 }}
          />
          {memberSkills.map((member, index) => (
            <Radar
              key={member.userId}
              name={member.fullName}
              dataKey={member.fullName}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              strokeWidth={2}
              fillOpacity={0.15}
              dot={{ fill: colors[index % colors.length], strokeWidth: 0 }}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Watermark */}
      <Typography variant="caption" 
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 16,
          color: theme.palette.text.disabled,
          opacity: 0.5,
          pointerEvents: 'none'
        }}
      >
        Skill Compatibility Radar
      </Typography>
    </Box>
  );
}