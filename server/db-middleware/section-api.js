const { Section } = require('../models/testing/section');

const apiModule = {};

apiModule.getAllSections = function () {
  return Section
    .find();
};

apiModule.getSectionByName = function (name) {
  return Section
    .find({ name });
};

apiModule.getSectionById = function (sectionId) {
  return Section
    .findById(sectionId);
};

module.exports = apiModule;
