const express = require('express');
const router = express.Router();
const {checkForUpcomingReturnDates} = require("../controllers/notificationJob")

router.post('/trigger-notification-check', async (req, res) => {
   try {
    await checkForUpcomingReturnDates();
    res.status(200).send('Notification check triggered successfully');
  } catch (error) {
    console.error('Error triggering notification check:', error.message);
    res.status(500).send('Failed to trigger notification check');
  }
});

module.exports = router;
