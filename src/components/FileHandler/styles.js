import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

export const FileHandlerContainer = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiButton-root': {
    color: theme.palette.primary.main,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
}));
