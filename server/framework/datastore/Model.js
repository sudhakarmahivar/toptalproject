/**
 * Base model class from where all entities inherit
 * Injects audit fields common across
 */
module.exports = class Model {
  createdDate;
  createdBy;
  updatedDate;
  updatedBy;
  deleted;
};
