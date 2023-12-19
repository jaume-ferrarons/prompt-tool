// components/GDPRWarning.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

const GDPRWarning = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(!localStorage.getItem('gdprAccepted'));

  const handleCloseDialog = () => {
    localStorage.setItem('gdprAccepted', 'true');
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Cookie Usage Notice</DialogTitle>
      <DialogContent>
        <p>
          We use Google Analytics to improve user experience. By continuing, you agree to our use of cookies.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GDPRWarning;
