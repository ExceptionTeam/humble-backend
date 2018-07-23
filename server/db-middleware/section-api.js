const { Section } = require('../models/testing/section');

const apiModule = {};

apiModule.getAllSections = function () {
  return Section 
  .find()
  .populate('name','-_id');
};

apiModule.getSectionByName = function (name) {
  return Section
  .find({ name })
  .populate('name','-_id');
};

apiModule.getSectionById = function (sectionId) {
  return Section
  .findById(sectionId)
  .populate('name','-_id');
};

module.exports = apiModule;
