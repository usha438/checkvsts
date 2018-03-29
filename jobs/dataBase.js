var connection = require( "../database/dbConnection" );
var sqlQuery = require( "../database/sqlQuerys" );
var reqValidation = require( "../validation/reqValid" );
var joiSchemas = require( "../validation/joiSchemas" );
var statusCode = require( '../validation/statusCodes' );

module.exports.queryDataBaseJobsList = function( callback ) {
  connection.GetDBData( sqlQuery.jobsList, function( stat, resp ) {
    if ( stat == statusCode.success ) {
      callback( stat, resp[ 0 ] );
    } else {
      callback( stat, {
        "status": "Unable to Process the Data"
      } )
    }

  } )
}

module.exports.queryDataBaseListById = function( reqParams, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseJobsListById, function( sts, msg ) {

    if ( sts == statusCode.success ) {
      sqlQuery.queryDataBaseJobsListById( msg.jobID, function( response ) {
        connection.GetDBData( response, function( stat, resp ) {
          if ( stat == statusCode.success ) {
            callback( stat, resp[ 0 ] );
          } else {
            callback( stat, {
              "status": "Unable to Process the Data"
            } )
          }
        } )
      } )
    } else {
      callback( statusCode.clientError, msg )
    }
  } )
}

module.exports.queryDataBaseListValues = function( callback ) {
  connection.GetDBData( sqlQuery.jobsListValues, function( stat, resp ) {
    if ( stat == statusCode.success ) {
      callback( stat, resp );
    } else {
      callback( stat, {
        "status": "Unable to Process the Data"
      } )
    }
  } )
}

module.exports.queryDataBaseJobsCreate = function( reqBody, callback ) {
  reqValidation( reqBody, joiSchemas.jobsCreate, function( sts, msg ) {
    if ( sts == statusCode.success ) {

      function checkJobAssigned( TrailerId ) {
        return new Promise( function( resolve, reject ) {
          sqlQuery.queryDataBaseJobsCreateCheck( TrailerId, function( response ) {
            connection.GetDBData( response, function( stat, resp ) {
              if ( stat == statusCode.success ) {
                resolve( resp )
              } else {
                reject( resp );
              }
            } )
          } )
        } )
      }


      checkJobAssigned( msg.TrailerId ).then( function( data ) {
          if ( data[ 0 ].length == 0 ) {
            sqlQuery.queryDataBaseJobsCreate( msg, function( sqlEx ) {
              connection.GetDBData( sqlEx, function( stat, resp ) {
                if ( stat == statusCode.success ) {
                  callback( stat, {
                    "status": "Record Inserted Successfully"
                  } );
                } else {
                  callback( stat, {
                    "status": "Unable to Process Given Body Data, Check the Body Data that you are trying to send"
                  } )
                }
              } )
            } )
          } else {
            callback( statusCode.clientError, {
              "status": "Job already created By this TrailerId, Choose another TrailerId to add"
            } )
          }
        } )
        .catch( function( err ) {
          callback( statusCode.clientError, {
            "status": "Unable to parse Req Body"
          } )
        } )
    } else {
      callback( statusCode.clientError, msg );
    }
  } )
}


module.exports.queryDataBaseJobUpdate = function( reqParams, reqBody, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseJobsListById, function( statusParam, paramMsg ) {
    if ( statusParam == statusCode.success ) {
      reqValidation( reqBody, joiSchemas.updateJob, function( sts, msg ) {

        if ( sts == statusCode.success ) {


          function checkJobCreatedOrNot( jobID ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.queryDataBaseJobsListById( jobID, function( response ) {
                connection.GetDBData( response, function( stat, resp ) {
                  if ( stat == statusCode.success ) {
                    resolve( resp )
                  } else {
                    reject( resp );
                  }
                } )
              } )
            } )
          }

          function checkSwitcher( jobID ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.switcherCheck( jobID, function( response ) {
                connection.GetDBData( response, function( stat, resp ) {
                  if ( stat == statusCode.success ) {
                    resolve( resp )
                  } else {
                    reject( resp );
                  }
                } )
              } )
            } )
          }

          function checkStatus( jobID ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.statusCheck( jobID, function( response ) {
                connection.GetDBData( response, function( stat, resp ) {
                  if ( stat == statusCode.success ) {
                    resolve( resp )
                  } else {
                    reject( resp );
                  }
                } )
              } )
            } )
          }

          function checkYardId( jobID ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.checkYard( jobID, function( response ) {
                connection.GetDBData( response, function( stat, resp ) {
                  if ( stat == statusCode.success ) {
                    resolve( resp )
                  } else {
                    reject( resp );
                  }
                } )
              } )
            } )
          }

          checkJobCreatedOrNot( paramMsg.jobID ).then( function( data ) {

              if ( data[ 0 ].length != 0 ) {

                if ( msg.SwitcherId && msg.Status ) {

                  checkSwitcher( paramMsg.jobID ).then( function( data ) {
                        if ( data[ 0 ][ 0 ][ "Name" ] != msg.Status || data[ 1 ][ 0 ][ "SwitcherId" ] != msg.SwitcherId ) {

                          if ( msg.Status == "Completed" ) {
                            callback( statusCode.clientError, {
                              "status": "You Can't assign Job as Completed by Sending Switcher Id"
                            } )
                          } else {
                            sqlQuery.queryDataBaseSwitcherUpdate( msg, paramMsg.jobID, function( sqlEx ) {
                             
                              connection.GetDBData( sqlEx, function( stat, resp ) {
                                if ( stat == statusCode.success ) {
                                  callback( stat, {
                                    "status": "Record updated Successfully"
                                  } );
                                } else {
                                  callback( stat, resp );
                                }
                              } )
                            } )
                          }
                        } else {
                          callback( statusCode.clientError, {
                            "status": "The Job is already associated with same switcherId and Status that you are trying to send, Try with different details"
                          } )
                        }
                      }

                    )

                    .catch( function( err ) {
                      callback( statusCode.clientError, {
                        "status": "Unable to parse Req Body"
                      } )
                    } )

                } else if ( !msg.SwitcherId && msg.Status ) {

                  checkStatus( paramMsg.jobID ).then( function( data ) {
                        if ( data[ 0 ][ 0 ][ "Name" ] != msg.Status ) {
                          if ( msg.Status == "Completed" ) {
                            sqlQuery.queryDataBaseStatComplete( paramMsg.jobID, function( sqlEx ) {

                              connection.GetDBData( sqlEx, function( stat, resp ) {
                                if ( stat == statusCode.success ) {
                                  callback( stat, {
                                    "status": "Record updated Successfully"
                                  } );
                                } else {
                                  callback( stat, resp );
                                }
                              } )
                            } )
                          } else {
                            sqlQuery.queryDataBaseStatUpdate( msg.Status, paramMsg.jobID, function( sqlEx ) {
                              
                              connection.GetDBData( sqlEx, function( stat, resp ) {
                                if ( stat == statusCode.success ) {
                                  callback( stat, {
                                    "status": "Record updated Successfully"
                                  } );
                                } else {
                                  callback( stat, resp );
                                }
                              } )
                            } )
                          }

                        } else if ( data[ 0 ][ 0 ][ "Name" ] == "Completed" ) {
                          callback( statusCode.clientError, {
                            "status": "The Job is already Completed, You cann't perform twice"
                          } )
                        } else {
                          callback( statusCode.clientError, {
                            "status": "The Job is already associated with the same Status that you are trying to send, Try with different details"
                          } )
                        }
                      }

                    )

                    .catch( function( err ) {
                      callback( statusCode.clientError, {
                        "status": "Unable to parse Req Body"
                      } )
                    } )
                } else if ( msg.YardId && msg.JobPriorityId && msg.Dock ) {


                  checkYardId( paramMsg.jobID ).then( function( data ) {
                        if ( data[ 0 ][ 0 ][ "Dock" ] != msg.Dock || data[ 0 ][ 0 ][ "YardId" ] != msg.YardId || data[ 0 ][ 0 ][ "JobPriorityId" ] != msg.JobPriorityId ) {

                          sqlQuery.updateYardData( msg, paramMsg.jobID, function( sqlEx ) {
                            connection.GetDBData( sqlEx, function( stat, resp ) {
                              if ( stat == statusCode.success ) {
                                callback( stat, {
                                  "status": "Record updated Successfully"
                                } );
                              } else {
                                callback( stat, resp );
                              }
                            } )
                          } )

                        } else {
                          callback( statusCode.clientError, {
                            "status": "The Job is already associated with same Dock,Yard and Priority that you are trying to send, Try with different details"
                          } )
                        }
                      }

                    )

                    .catch( function( err ) {
                      callback( statusCode.clientError, {
                        "status": "Unable to parse Req Body"
                      } )
                    } )

                }


              } else {
                callback( statusCode.clientError, {
                  "status": "JobID is not present in Table"
                } );
              }
            } )

            .catch( function( err ) {
              callback( statusCode.clientError, {
                "status": "Unable to parse Req Body"
              } )
            } )
        } else {
          callback( statusCode.clientError, msg );
        }
      } )
    } else {
      callback( statusCode.clientError, msg );
    }
  } )
}

module.exports.deleteJobById = function( reqParams, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseJobsListById, function( stat, message ) {
    if ( stat == statusCode.success ) {

      function deleteJob( jobID ) {
        return new Promise( function( resolve, reject ) {
          sqlQuery.queryDataBaseJobsListById( jobID, function( response ) {
            connection.GetDBData( response, function( stat, resp ) {
              if ( stat == statusCode.success ) {
                resolve( resp )
              } else {
                reject( resp );
              }
            } )
          } )
        } )
      }

      deleteJob( message.jobID ).then( function( data ) {
        if ( data[ 0 ].length != 0 ) {

          sqlQuery.deleteJob( message.jobID, function( sqlEx ) {
            connection.GetDBData( sqlEx, function( stat, resp ) {
              if ( stat == statusCode.success ) {
                callback( stat, {
                  "status": "Record Deleted Successfully"
                } );
              } else {
                callback( stat, resp );
              }
            } )
          } )
        } else {
          callback( statusCode.clientError, {
            "status": "JobID is already deleted, Try with some other JobID"
          } )
        }
      } )


    }
  } )
}