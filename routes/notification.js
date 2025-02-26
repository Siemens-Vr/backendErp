const {Router} = require('express');
const { getNotificationRead, getNotification, getUnreadNotification } = require('../controllers/notification');

const notificationsRouter = Router();

notificationsRouter.get('/', getNotification)
notificationsRouter.get('/uread', getUnreadNotification)
notificationsRouter.get('/:id/read', getNotificationRead)

module.exports = notificationsRouter;