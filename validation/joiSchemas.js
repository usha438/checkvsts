const JoiBase = require( 'joi' );
const Extension = require( 'joi-date-extensions' );
const Joi = JoiBase.extend( Extension );

module.exports.trailerCreate = {
  BeaconId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  TrailerNumber: Joi.string().min( 1 ).max( 50 ).required(),
  TrailerTypeID: Joi.number().min( 1 ).max( 50 ).required(),
  PO_STO: Joi.string().alphanum().min( 1 ).max( 50 ).required(),
  Carrier: Joi.string().alphanum().min( 1 ).max( 50 ).required(),
  Dock: Joi.string().alphanum().min( 1 ).max( 50 ).required(),
  LoadTypeId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  TrailerStatusID: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  EntryTimeStamp: Joi.date().format( 'YYYY-MM-DD hh:mm:ss.sss' ).raw().required(),
  Comments: Joi.string().required(),
  YardId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  ExitTimeStamp: Joi.any()
}

module.exports.trailerCheckout = {
  BeaconId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  TrailerNumber: Joi.string().min( 1 ).max( 50 ).required(),
  TrailerTypeID: Joi.number().min( 1 ).max( 50 ).required(),
  PO_STO: Joi.string().alphanum().min( 1 ).max( 50 ).required(),
  Carrier: Joi.string().alphanum().min( 1 ).max( 50 ).required(),
  LoadTypeId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  TrailerStatusID: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  ExitTimeStamp: Joi.date().format( 'YYYY-MM-DD hh:mm:ss.sss' ).raw().required(),
  Comments: Joi.string().required()

}

module.exports.queryDataBaseListById = {
  trailerID: Joi.number().integer().positive().required()
}

module.exports.queryDataBaseBeaconsId = {
  beaconID: Joi.number().integer().positive().required()
}

module.exports.queryDataBaseJobsListById = {
  jobID: Joi.number().integer().positive().required()
}

module.exports.jobsCreate = {
  TrailerId: Joi.number().integer().positive().required(),
  Dock: Joi.string().alphanum().min( 1 ).max( 50 ).required(),
  JobPriorityId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  JobStatusId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  PublishedTimeStamp: Joi.date().format( 'YYYY-MM-DD hh:mm:ss.sss' ).raw().required(),
  SchedulerId: Joi.number().integer().positive().required(),
  SwitcherId: Joi.number().integer().positive().required(),
  YardId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  CompletedTimeStamp: Joi.any()
}

module.exports.updateJob = {
  Status: Joi.string().valid( "Pending", "In-Progress", "Completed" ),
  SwitcherId: Joi.number().integer().positive(),
  JobPriorityId: Joi.number().integer().min( 1 ).max( 4000 ),
  YardId: Joi.number().integer().min( 1 ).max( 4000 ),
  Dock: Joi.string().alphanum().min( 1 ).max( 50 )
}

module.exports.updateTrailerById = {
  TrailerTypeId: Joi.number().min( 1 ).max( 50 ).required(),
  PO_STO: Joi.string().alphanum().min( 1 ).max( 50 ).required(),
  Carrier: Joi.string().min( 1 ).max( 50 ).required(),
  LoadTypeId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  TrailerStatusId: Joi.number().integer().min( 1 ).max( 4000 ).required(),
  PresentYard: Joi.number().integer().min( 1 ).max( 4000 ).required()
}

module.exports.resolveBeacons = {
  Major: Joi.number().integer().valid( 1 ).required(),
  Minor: Joi.number().integer().positive().required()
}