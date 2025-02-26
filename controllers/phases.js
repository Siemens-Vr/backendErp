const { Project, Phase, Deliverable, sequelize } = require('../models'); 


const validatePhase = require('../validation/phaseValidation');
const validateDeliverable = require('../validation/deliverableValidation');

module.exports.createPhase = async (req, res) => {
  const { uuid } = req.params;
  const phases = req.body.phases;

  const transaction = await sequelize.transaction(); 

  try {
    // Find the project by UUID
    const project = await Project.findOne({ where: { uuid } }, { transaction });
    if (!project) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Project not found' });
    }

    // Loop through each phase, validate, and create it along with its deliverables
    const createdPhases = await Promise.all(
      phases.map(async (phaseData) => {
        const { name, startDate, endDate, status, deliverables } = phaseData;

        // Validate phase data
        const { error: phaseError } = validatePhase({ name, startDate, endDate, status });
        if (phaseError) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Phase validation error', details: phaseError.details });
        }

        // Create the phase associated with the project ID
        const phase = await Phase.create(
          {
            name,
            startDate,
            endDate,
            status,
            projectId: project.uuid,
          },
          { transaction }
        );

        // If deliverables are provided, validate and create each associated with the phase ID
        if (deliverables && Array.isArray(deliverables)) {
          const validDeliverables = [];
          for (const deliverable of deliverables) {
            const { error: deliverableError } = validateDeliverable(deliverable);
            if (deliverableError) {
              await transaction.rollback();
              return res.status(400).json({ message: 'Deliverable validation error', details: deliverableError.details });
            }
            validDeliverables.push({
              name: deliverable.name,
              status: deliverable.status,
              startDate: deliverable.startDate,
              expectedFinish: deliverable.expectedFinish,
              phaseId: phase.uuid,
            });
          }

          const createdDeliverables = await Deliverable.bulkCreate(validDeliverables, { transaction });
          phase.dataValues.deliverables = createdDeliverables;
        }

        return phase;
      })
    );

    // Commit the transaction if all operations succeed
    await transaction.commit();
    res.status(201).json({ message: 'Phases and deliverables created successfully', phases: createdPhases });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();
    res.status(500).json({ message: 'Failed to create phases and deliverables', error: error.message });
  }
};

module.exports.getAllPhases = async (req, res) => {
    const { uuid } = req.params;
  
    try {
      // Find the project and associated phases
      const project = await Project.findOne({
        where: { uuid },
        include: [{ model: Phase, as: 'phases' }]
      });
  
      if (!project) return res.status(404).json({ message: 'Project not found' });
  
      res.status(200).json({ phases: project.phases });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve phases', error: error.message });
    }
  };
  

  module.exports.getPhaseById = async (req, res) => {
    const { uuid, phaseId } = req.params;
  
    try {
      // Find the project and specific phase
      const project = await Project.findOne({
        where: { uuid },
        include: [{ model: Phase, as: 'phases', where: { uuid: phaseId } }]
      });
  
      if (!project || !project.phases.length) return res.status(404).json({ message: 'Phase not found for this project' });
  
      res.status(200).json({ phase: project.phases[0] });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve phase', error: error.message });
    }
  };

  module.exports.updatePhase = async (req, res) => {
    const { uuid } = req.params; 
    const { phases } = req.body; 
  
    const transaction = await sequelize.transaction();
  
    try {
      // Find the project by UUID
      const project = await Project.findOne({ where: { uuid } });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Loop through each phase to update
      for (const phaseData of phases) {
        const { phaseId, name, startDate, endDate, status, deliverables } = phaseData;
  
        // Validate phase data
        const { error: phaseError } = validatePhase({ name, startDate, endDate, status });
        if (phaseError) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Phase validation error', details: phaseError.details });
        }
  
        // Find and update the phase
        const phase = await Phase.findOne({ where: { uuid: phaseId, projectId: project.uuid }, transaction });
        if (!phase) {
          await transaction.rollback();
          return res.status(404).json({ message: `Phase with id ${phaseId} not found` });
        }
  
        // Update phase details
        await phase.update({ name, startDate, endDate, status }, { transaction });
  
        // If deliverables are provided, validate and update each deliverable
        if (deliverables && Array.isArray(deliverables)) {
          for (const deliverableData of deliverables) {
            const { deliverableId, name, status, startDate, expectedFinish } = deliverableData;
  
            // Validate deliverable data
            const { error: deliverableError } = validateDeliverable({ name, status, startDate, expectedFinish });
            if (deliverableError) {
              await transaction.rollback();
              return res.status(400).json({ message: 'Deliverable validation error', details: deliverableError.details });
            }
  
            // Find and update each deliverable
            const deliverable = await Deliverable.findOne({
              where: { uuid: deliverableId, phaseId: phase.uuid },
              transaction
            });
            if (!deliverable) {
              await transaction.rollback();
              return res.status(404).json({ message: `Deliverable with id ${deliverableId} not found` });
            }
  
            await deliverable.update({ name, status, startDate, expectedFinish }, { transaction });
          }
        }
      }
  
      // Commit the transaction if all updates succeed
      await transaction.commit();
      res.status(200).json({ message: 'Phases and deliverables updated successfully' });
    } catch (error) {
      // Rollback the transaction in case of any failure
      await transaction.rollback();
      res.status(500).json({ message: 'Failed to update phases and deliverables', error: error.message });
    }
  };
  
  module.exports.deletePhase = async (req, res) => {
    const { uuid } = req.params;
    const { phaseId } = req.body;
  
    try {
      // Find the project
      const project = await Project.findOne({ where: { uuid } });
      if (!project) return res.status(404).json({ message: 'Project not found' });
  
      // Find and delete the phase
      const phase = await Phase.findOne({ where: { uuid: phaseId, projectId: project.uuid } });
      if (!phase) return res.status(404).json({ message: 'Phase not found' });
  
      await phase.destroy();
      res.status(200).json({ message: 'Phase deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete phase', error: error.message });
    }
  };

  
  