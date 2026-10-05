import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const LoginDialog = ({ open, onClose, onLogin, onRegister }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const isRegistering = mode === 'register';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      const user = isRegistering ? await onRegister(form) : await onLogin({ email: form.email, password: form.password });
      if (user) onClose();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setPending(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isRegistering ? 'Create your Zave account' : 'Welcome back to Zave'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {isRegistering && (
              <TextField
                label="Name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                autoFocus
                fullWidth
              />
            )}
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              autoFocus={!isRegistering}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              inputProps={{ minLength: 8 }}
              helperText={isRegistering ? 'Use at least 8 characters.' : undefined}
              fullWidth
            />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          <Button type="button" onClick={() => { setMode(isRegistering ? 'login' : 'register'); setError(''); }}>
            {isRegistering ? 'Already have an account?' : 'Create an account'}
          </Button>
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? 'Please wait...' : isRegistering ? 'Register' : 'Log in'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
