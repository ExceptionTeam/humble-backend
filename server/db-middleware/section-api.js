const { Section } = require('../models/testing/section');

const generalApi = require('./general-api');

const apiModule = {};

apiModule.getAllSections = function () {
  return Section 
  .find()
  .populate('name','sectionId');
};

apiModule.getSectionByName = function (name) {
  return Section
  .find({ name })
  .populate('name','sectionId');
};

apiModule.getSectionById = function (sectionId) {
  return Section
  .findById(sectionId)
  .populate('name','sectionId');
};

module.exports = apiModule;
