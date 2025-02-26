const { Assignee, Project, sequelize } = require('../models');
const validateAssignee = require('../validation/assigneeValidation');
const Joi = require('joi');

// Create Assignees
module.exports.createAssignee = async (req, res) => {
    const { uuid } = req.params;
    const { assignees } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Find the project by UUID
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Validate each assignee
        const validAssignees = [];
        for (const assignee of assignees) {
            const { error } = validateAssignee(assignee);
            if (error) {
                return res.status(400).json({ message: 'Validation error', details: error.details });
            }
            validAssignees.push({ ...assignee, projectId: project.uuid });
        }

        // Create Assignees if validation passes
        await Assignee.bulkCreate(validAssignees, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Assignees created successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to create assignees', error: error.message });
    }
};

// Get all Assignees
module.exports.getAllAssignees = async (req, res) => {
    const { uuid } = req.params;

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const assignees = await Assignee.findAll({ where: { projectId: project.uuid } });
        res.status(200).json(assignees);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignees', error: error.message });
    }
};

// Get Assignee by ID
module.exports.getAssigneeById = async (req, res) => {
    const { uuid, assigneeId } = req.params;

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const assignee = await Assignee.findOne({ where: { uuid: assigneeId, projectId: project.uuid } });
        if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

        res.status(200).json(assignee);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignee', error: error.message });
    }
};


// Update Assignee
module.exports.updateAssignee = async (req, res) => {
    const { uuid, assigneeId } = req.params;
    const { name, gender, access, role, dateJoined } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Find the project by UUID
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Find the assignee by UUID and project ID
        const assignee = await Assignee.findOne({ where: { uuid: assigneeId, projectId: project.uuid } });
        if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

        // Validate the assignee update data
        const { error } = validateAssignee({ name, gender, access, role, dateJoined });
        if (error) return res.status(400).json({ message: 'Validation error', details: error.details });

        // Update the assignee if validation passes
        await assignee.update({ name, gender, access, role, dateJoined }, { transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Assignee updated successfully', assignee });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to update assignee', error: error.message });
    }
};

// Delete Assignee
module.exports.deleteAssignee = async (req, res) => {
    const { uuid, assigneeId } = req.params;

    const transaction = await sequelize.transaction();

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const assignee = await Assignee.findOne({ where: { uuid: assigneeId, projectId: project.uuid } });
        if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

        await assignee.destroy({ transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Assignee deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to delete assignee', error: error.message });
    }
};

