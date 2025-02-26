const { Items } = require('../models');
const validateItem = require('../validation/itemsValidation');

exports.getItems = async (req, res) => {
  try {
    const items = await Items.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createItem = async (req, res) => {
  const { error } = validateItem(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }

  try {
    const item = await Items.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Items.findByPk(id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { error } = validateItem(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }

  try {
    const item = await Items.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.update(req.body);
    res.status(200).json({ message: 'Item successfully updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Items.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
