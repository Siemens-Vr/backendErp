const { Deliverable, Phase, Project, sequelize } = require('../models');

const validateDeliverable = require('../validation/deliverableValidation');
const Joi = require('joi');


// Create Deliverables
module.exports.createDeliverable = async (req, res) => {
    const { uuid, phaseId } = req.params;
    const { deliverables } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Find the project by UUID
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Find the phase by ID
        const phase = await Phase.findOne({ where: { uuid: phaseId, projectId: project.uuid } });
        if (!phase) return res.status(404).json({ message: 'Phase not found' });

        // Validate each deliverable
        const validDeliverables = [];
        for (const deliverable of deliverables) {
            const { error } = validateDeliverable(deliverable);
            if (error) {
                return res.status(400).json({ message: 'Validation error', details: error.details });
            }
            validDeliverables.push({ ...deliverable, phaseId });
        }

        // Create deliverables if validation passes
        await Deliverable.bulkCreate(validDeliverables, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Deliverables created successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to create deliverables', error: error.message });
    }
};


// Get all Deliverables
module.exports.getAllDeliverables = async (req, res) => {
    const { uuid, phaseId } = req.params;

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const phase = await Phase.findOne({ where: { uuid: phaseId, projectId: project.uuid } });
        if (!phase) return res.status(404).json({ message: 'Phase not found' });

        const deliverables = await Deliverable.findAll({ where: { phaseId } });
        res.status(200).json(deliverables);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch deliverables', error: error.message });
    }
};

// Get Deliverable by ID
module.exports.getDeliverableById = async (req, res) => {
    const { uuid, phaseId, deliverableId } = req.params;

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const phase = await Phase.findOne({ where: { uuid: phaseId, projectId: project.uuid } });
        if (!phase) return res.status(404).json({ message: 'Phase not found' });

        const deliverable = await Deliverable.findOne({ where: { uuid: deliverableId, phaseId } });
        if (!deliverable) return res.status(404).json({ message: 'Deliverable not found' });

        res.status(200).json(deliverable);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch deliverable', error: error.message });
    }
};
module.exports.getAllDeliverablesInProject = async (req, res) => {
    const { uuid }  = req.params;

    try {
        // Find the project first
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Find all phases in the project
        const phases = await Phase.findAll({ 
            where: { projectId: project.uuid }
        });

        // If no phases exist
        if (phases.length === 0) {
            return res.status(200).json([]);
        }

        // Collect deliverables for each phase
        let deliverables = [];
        for (const phase of phases) {
            const phaseDeliverables = await Deliverable.findAll({ 
                where: { phaseId: phase.uuid },
                raw: true 
            });

            // Append phase name to each deliverable
            const deliverableWithPhaseName = phaseDeliverables.map(deliverable => ({
                ...deliverable,
                phaseName: phase.name
            }));

            deliverables.push(...deliverableWithPhaseName);
        }

        res.status(200).json(deliverables);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch project deliverables', 
            error: error.message 
        });
    }
};

// Update Deliverable
module.exports.updateDeliverable = async (req, res) => {
    const { uuid, phaseId, deliverableId } = req.params;
    const { name, status, startDate, expectedFinish } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const phase = await Phase.findOne({ where: { uuid: phaseId, projectId: project.uuid } });
        if (!phase) return res.status(404).json({ message: 'Phase not found' });

        const deliverable = await Deliverable.findOne({ where: { uuid: deliverableId, phaseId } });
        if (!deliverable) return res.status(404).json({ message: 'Deliverable not found' });

        await deliverable.update({ name, status, startDate, expectedFinish }, { transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Deliverable updated successfully', deliverable });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to update deliverable', error: error.message });
    }
};

// Delete Deliverable
module.exports.deleteDeliverable = async (req, res) => {
    const { uuid, phaseId, deliverableId } = req.params;

    const transaction = await sequelize.transaction();

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const phase = await Phase.findOne({ where: { uuid: phaseId, projectId: project.uuid } });
        if (!phase) return res.status(404).json({ message: 'Phase not found' });

        const deliverable = await Deliverable.findOne({ where: { uuid: deliverableId, phaseId } });
        if (!deliverable) return res.status(404).json({ message: 'Deliverable not found' });

        await deliverable.destroy({ transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Deliverable deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to delete deliverable', error: error.message });
    }
};