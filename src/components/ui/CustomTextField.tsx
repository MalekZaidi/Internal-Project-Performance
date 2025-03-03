import { TextField, TextFieldProps } from '@mui/material';

const CustomTextField = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      fullWidth
      variant="outlined"
      margin="normal"
      InputLabelProps={{ style: { fontSize: '14px', color: '#333333' } }}
      inputProps={{ style: { fontSize: '14px', color: '#333333' } }}
    />
  );
};

export default CustomTextField;
