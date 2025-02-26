const { BorrowedComponent, Notification } = require('../models');
const express = require('express')
const { Op } = require('sequelize');


module.exports.getUnreadNotification =  async (req, res) => {
  try {
    const notifications = await Notification.findAndCountAll({
        where: { isRead: false },
        order: [['createdAt', 'DESC']]
    });
    // console.log(notifications)
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch read notifications' });
  }
};
module.exports.getNotification =  async (req, res) => {

    try {
      const notifications = await Notification.findAndCountAll({
        order: [['createdAt', 'DESC']]
      });
      console.log(notifications)
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  };

module.exports.getNotificationRead =  async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.update({ isRead: true }, { where: { id } });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

