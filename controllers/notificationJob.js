const { BorrowedComponent, Notification } = require('../models');
const { Op } = require('sequelize');

module.exports.checkForUpcomingReturnDates = async () => {
  try {
    const upcomingBorrows = await BorrowedComponent.findAll({
      where: {
        expectedReturnDate: {
          [Op.between]: [new Date(), new Date(new Date().setDate(new Date().getDate() + 3))]
        }
      }
    });
    console.log(upcomingBorrows)

    for (const borrow of upcomingBorrows) {
      // const message = `Return date for ${borrow.fullName} is approaching on ${borrow.expectedReturnDate.replace(/ \(.*\)/, '')}.`;
      const message = `Return date for ${borrow.fullName} is approaching on ${borrow.expectedReturnDate}.`;
      await Notification.create({ message, isRead: false });
    }
  } catch (error) {
    console.error('Error checking for upcoming return dates:', error);
  }
};

// Run the function immediately
// checkForUpcomingReturnDates();

// Run daily
// setInterval(checkForUpcomingReturnDates, 24 * 60 * 60 * 1000);
