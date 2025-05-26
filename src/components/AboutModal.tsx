import { useState } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { WHEEL_DIAMETER_M } from '../utils/utils';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 540,
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  color: 'text.primary',
};

export const AboutModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton
        color="info"
        onClick={handleOpen}
        aria-label="About"
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        <InfoIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="about-modal-title"
        aria-describedby="about-modal-description"
      >
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
            size="small"
          >
            <CloseIcon />
          </IconButton>

          <Typography id="about-modal-title" variant="h6" component="h2" gutterBottom>
            About This Project
          </Typography>
          <Typography id="about-modal-description" sx={{ mt: 2 }}>
            This dashboard is built to monitor and visualize the running activity of Mooey Maria
            Hazel the hamster.
            <br />
            <br />
            <Box sx={{ width: '100%', mb: 2 }}>
              <img
                src="/images/mooey.jpg"
                alt="Mooey Maria Hazel"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 200,
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            </Box>
            The project started because Mooey was running so much every night that we got curious
            about how much distance she would actually cover!
            <br />
            <br />
            The system uses a Raspberry Pi with two Keyestudio sensors: a KS0020 Hall Effect sensor
            to count wheel rotations, and a DHT22 sensor to record temperature and humidity. All
            data is sent via a backend to a PostgreSQL database and visualized here.
            <br />
            <br />
            The dashboard records wheel sessions, calculates distance based on a{' '}
            {Math.round(WHEEL_DIAMETER_M * 100)}cm diameter wheel, and tracks temperature and
            humidity. Use the filters and charts to explore the data!
          </Typography>
        </Box>
      </Modal>
    </>
  );
};
