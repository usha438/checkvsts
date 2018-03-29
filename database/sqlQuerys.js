module.exports.trailerList = "select * from TrailersInYard"

module.exports.queryDataBaseBeacons = "SELECT * from CCBCC_YARD_BeaconDetails"

module.exports.jobsList = "select * from AllJobs where CompletedTimeStamp IS NULL"

module.exports.jobsListValues = "select LoadTypeId,Name from LoadType select TrailerTypeId,Name from TrailerType select Yardid,Name from CCBCC_YARD_Yards select TrailerStatusId,Name from TrailerStatus select JobPriorityId,Priority from JobPriority"

module.exports.users = "select Email,Role from CCBCC_YARD_Users where Role = 'SWITCHER' OR Role = 'GUARD'"

module.exports.trailerCreate = function( val, beaconId, yardId, callback ) {
  var res = "INSERT INTO dbo.CCBCC_YARD_Trailers( BeaconId, TrailerNumber, TrailerTypeID, PO_STO, Carrier, Dock, LoadTypeId, TrailerStatusID, EntryTimeStamp, ExitTimeStamp,Comments,PresentYard) values(" + val + ") update [CCBCC_YARD_BeaconDetails] set [Latitude] = (select Loc_Lat from CCBCC_YARD_Yards where YardId=" + yardId + "), [Longitude] =(select Loc_Lng from CCBCC_YARD_Yards where YardId=" + yardId + ") where Id=" + beaconId;
  callback( res );
}

module.exports.trailerCreateCheck = function( beaconId, callback ) {
  var res = "select BeaconId from CCBCC_YARD_Trailers where BeaconId=" + beaconId;
  callback( res );
}

module.exports.queryDataBaseListById = function( trailerId, callback ) {
  var res = "SELECT * FROM TrailersInYard WHERE TrailerId = " + trailerId;
  callback( res );
}

module.exports.queryDataBaseBeaconsId = function( beaconId, callback ) {
  var res = "SELECT * FROM TrailersInYard WHERE BeaconId =" + beaconId;
  callback( res );
}

module.exports.queryDataBaseCheckout = function( CheckoutTrailer, callback ) {
  var res = "update [CCBCC_YARD_Trailers] set TrailerNumber = " + "'" + CheckoutTrailer.TrailerNumber + "'" + ",ExitTimeStamp=" + "'" + CheckoutTrailer.ExitTimeStamp + "'" + ",PO_STO='" + CheckoutTrailer.PO_STO + "',Carrier='" + CheckoutTrailer.Carrier + "',TrailerStatusID=" + CheckoutTrailer.TrailerStatusID + ",TrailerTypeID=" + CheckoutTrailer.TrailerTypeID + ",LoadTypeId=" + CheckoutTrailer.LoadTypeId + ",Comments=" + "'" + CheckoutTrailer.Comments + "'" + " where BeaconId=" + CheckoutTrailer.BeaconId + " update [CCBCC_YARD_Trailers] set BeaconId=NULL where BeaconId=" + CheckoutTrailer.BeaconId;
  callback( res );
}

module.exports.queryDataBaseCheckoutCheck = function( beaconId, callback ) {
  var res = "select BeaconId from CCBCC_YARD_Trailers where BeaconId = " + beaconId;
  callback( res );
}

module.exports.queryDataBaseJobsListById = function( jobID, callback ) {
  var res = "select * from AllJobs where JobId=" + jobID;
  callback( res );
}

module.exports.queryDataBaseJobsCreate = function( JobPayload, callback ) {
  var res = "INSERT INTO CCBCC_YARD_Jobs(TrailerId,YardId,JobPriorityId,Dock,JobStatusId,SwitcherId,SchedulerId,PublishedTimeStamp,CompletedTimeStamp) VALUES(" + JobPayload.TrailerId + "," + JobPayload.YardId + "," + JobPayload.JobPriorityId + ",'" + JobPayload.Dock + "'," + JobPayload.JobStatusId + "," + JobPayload.SwitcherId + "," + JobPayload.SchedulerId + "," + "CURRENT_TIMESTAMP" + "," + "NULL" + ")"
  callback( res );
}

module.exports.queryDataBaseJobsCreateCheck = function( trailerId, callback ) {
  var res = "select TrailerId from AllJobs where TrailerId=" + trailerId;
  callback( res );
}

module.exports.queryDataBaseSwitcherUpdate = function( payload, jobID, callback ) {
  var res = "update [CCBCC_YARD_Jobs] set [JobStatusId] = (select [JobStatusId] from [dbo].[JobStatus] where name =" + "'" + payload.Status + "'" + "),[SwitcherId] = " + payload.SwitcherId + " where JobId=" + jobID
  callback( res )
}

module.exports.switcherCheck = function( jobID, callback ) {
  var res = "select Name from JobStatus where JobStatusId = (select JobStatusId from AllJobs where JobId = " + jobID + ") select SwitcherId from AllJobs where JobId = " + jobID
  callback( res );
}

module.exports.statusCheck = function( jobID, callback ) {
  var res = "select Name from JobStatus where JobStatusId = (select JobStatusId from AllJobs where JobId = " + jobID + ")"
  callback( res );
}

module.exports.queryDataBaseStatUpdate = function( Status, jobID, callback ) {
  var res = "update [CCBCC_YARD_Jobs] set [JobStatusId] = (select [JobStatusId] from [dbo].[JobStatus] where name =" + "'" + Status + "'" + ") where JobId=" + jobID
  callback( res );
}

module.exports.queryDataBaseStatComplete = function( jobID, callback ) {
  var res = "update [CCBCC_YARD_Jobs] set [JobStatusId] = (select [JobStatusId] from [dbo].[JobStatus] where name = 'Completed'),[CompletedTimeStamp]=CURRENT_TIMESTAMP where JobId=" + jobID + " UPDATE CCBCC_YARD_Trailers Set PresentYard = (Select YardId from CCBCC_YARD_Jobs where JobId =" + jobID + ") where TrailerId = (Select TrailerId from CCBCC_YARD_Jobs where JobId =" + jobID + ")"
  callback( res );
}

module.exports.checkYard = function( jobID, callback ) {
  var res = "select Dock,YardId,JobPriorityId from AllJobs where JobId = " + jobID
  callback( res );
}

module.exports.updateYardData = function( msg, jobID, callback ) {
  var res = "update [CCBCC_YARD_Jobs] set JobPriorityId = " + msg.JobPriorityId + ",[YardId]=" + msg.YardId + ",Dock =" + "'" + msg.Dock + "'" + " where JobId=" + jobID
  callback( res );
}

module.exports.updateTrailer = function( msg, trailerId, callback ) {
  var res = "UPDATE dbo.CCBCC_YARD_Trailers SET TrailerTypeId=" + msg.TrailerTypeId + ",PO_STO=" + "'" + msg.PO_STO + "'" + ",Carrier=" + "'" + msg.Carrier + "'" + ",LoadTypeId=" + msg.LoadTypeId + ",TrailerStatusId=" + msg.TrailerStatusId + ",PresentYard=" + msg.PresentYard + " where TrailerId=" + trailerId
  callback( res );
}

module.exports.checkTrailerById = function( trailerId, callback ) {
  var res = "select TrailerTypeId,PO_STO,Carrier,LoadTypeId,TrailerStatusId,PresentYard from AllTrailers where TrailerId =" + trailerId
  callback( res );
}

module.exports.deleteJob = function( jobID, callback ) {
  var res = "delete from [dbo].[CCBCC_YARD_Jobs] where JobId=" + jobID
  callback( res );
}

module.exports.queryResolveBeaconsCheck = function( Major, Minor, callback ) {
  var res = "select BeaconId from CCBCC_YARD_Trailers where BeaconId=(select Id from CCBCC_YARD_BeaconDetails where Major=" + Major + " and Minor=" + Minor + ")"
  callback( res );
}
module.exports.queryResolveBeacons = function( Major, Minor, callback ) {
  var res = "select * from CCBCC_YARD_BeaconDetails where Major=" + Major + " and Minor=" + Minor
  callback( res );
}