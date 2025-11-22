"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up(queryInterface, Sequelize) {
    await queryInterface.createTable("regalos_comprados", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    userId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
    },
    giftId: {
        type: Sequelize.INTEGER,
    },
    nombre: {
        type: Sequelize.STRING,
    },
    costo: {
        type: Sequelize.INTEGER,
    },
    puntos: {
        type: Sequelize.INTEGER,
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
    },
    });
},
async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("regalos_comprados");
},
};
