// src/components/ui/ChangePasswordForm.tsx
import { useState } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import CustomButton from './CustomButton'
import { useChangePasswordMutation } from '../../features/auth/api/authSlice'

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]           = useState('')
  const [confirmPassword, setConfirmPassword]   = useState('')

  // ⬅️ this is the RTK Query hook
  const [changePassword, { isLoading, error }] = useChangePasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap()
      alert('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      alert('Error changing password. Please check your current password.')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>

      <TextField
        fullWidth
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
        required
      />

      <Box mt={2}>
        <CustomButton type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? 'Changing…' : 'Change Password'}
        </CustomButton>
      </Box>

      {error && (
        <Typography color="error" variant="body2" mt={1}>
          Failed to change password.
        </Typography>
      )}
    </Box>
  )
}

export default ChangePasswordForm
