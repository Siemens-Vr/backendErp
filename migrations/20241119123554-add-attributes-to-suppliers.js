"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            { schema: "projects", tableName: "Suppliers" }, // Specify schema and table name
            "invoiceDate",
            {
                type: Sequelize.DATE,
                allowNull: true,
            }
        );
        await queryInterface.addColumn(
            { schema: "projects", tableName: "Suppliers" },
            "invoicePath",
            {
                type: Sequelize.STRING,
                allowNull: true,
            }
        );
        await queryInterface.addColumn(
            { schema: "projects", tableName: "Suppliers" },
            "invoiceName",
            {
                type: Sequelize.STRING,
                allowNull: true,
            }
        );
        await queryInterface.addColumn(
            { schema: "projects", tableName: "Suppliers" },
            "paymentDate",
            {
                type: Sequelize.DATE,
                allowNull: true,
            }
        );
        await queryInterface.addColumn(
            { schema: "projects", tableName: "Suppliers" },
            "paymentVoucherPath",
            {
                type: Sequelize.STRING,
                allowNull: true,
            }
        );
        await queryInterface.addColumn(
            { schema: "projects", tableName: "Suppliers" },
            "paymentVoucherName",
            {
                type: Sequelize.STRING,
                allowNull: true,
            }
        );
        await queryInterface.addColumn(
            { schema: "projects", tableName: "Suppliers" },
            "approvalDate",
            {
                type: Sequelize.DATE,
                allowNull: true,
            }
        );
        await queryInterface.addColumn(
            { schema: "projects", tableName: "Suppliers" },
            "approvalPath",
            {
                type: Sequelize.STRING,
                allowNull: true,
            }
        );
        await queryInterface.addColumn(
            { schema: "projects", tableName: "Suppliers" },
            "approvalName",
            {
                type: Sequelize.STRING,
                allowNull: true,
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn({ schema: "projects", tableName: "Suppliers" }, "invoiceDate");
        await queryInterface.removeColumn({ schema: "projects", tableName: "Suppliers" }, "invoicePath");
        await queryInterface.removeColumn({ schema: "projects", tableName: "Suppliers" }, "invoiceName");
        await queryInterface.removeColumn({ schema: "projects", tableName: "Suppliers" }, "paymentDate");
        await queryInterface.removeColumn({ schema: "projects", tableName: "Suppliers" }, "paymentVoucherPath");
        await queryInterface.removeColumn({ schema: "projects", tableName: "Suppliers" }, "paymentVoucherName");
        await queryInterface.removeColumn({ schema: "projects", tableName: "Suppliers" }, "approvalDate");
        await queryInterface.removeColumn({ schema: "projects", tableName: "Suppliers" }, "approvalPath");
        await queryInterface.removeColumn({ schema: "projects", tableName: "Suppliers" }, "approvalName");
    },
};
