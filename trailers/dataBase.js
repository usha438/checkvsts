var connection = require( "../database/dbConnection" );
var sqlQuery = require( "../database/sqlQuerys" );
var reqValidation = require( "../validation/reqValid" );
var joiSchemas = require( "../validation/joiSchemas" );
var statusCode = require( '../validation/statusCodes' );

module.exports.queryDataBaseList = function( callback ) {
  connection.GetDBData( sqlQuery.trailerList, function( stat, resp ) {
    if ( stat == statusCode.success ) {
      callback( stat, resp[ 0 ] );
    } else {
      callback( stat, {
        "status": "Unable to Process the Data"
      } )
    }

  } )
}

module.exports.queryDataBaseCreate = function( reqBody, callback ) {
  reqValidation( reqBody, joiSchemas.trailerCreate, function( sts, msg ) {
    if ( sts == statusCode.success ) {
      var col = msg.BeaconId + ",'" + msg.TrailerNumber + "'," + msg.TrailerTypeID + ",'" + msg.PO_STO + "','" + msg.Carrier + "','" + msg.Dock + "'," + msg.LoadTypeId + "," + msg.TrailerStatusID + ",'" + msg.EntryTimeStamp + "',NULL," + "'" + msg.Comments + "'," + msg.YardId;

      function testBeaconAttached( Beacon ) {
        return new Promise( function( resolve, reject ) {
          sqlQuery.trailerCreateCheck( Beacon, function( response ) {
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


      testBeaconAttached( msg.BeaconId ).then( function( data ) {
          if ( data[ 0 ].length == 0 ) {
            sqlQuery.trailerCreate( col, msg.BeaconId, msg.YardId, function( sqlEx ) {
              connection.GetDBData( sqlEx, function( stat, resp ) {
                if ( stat == statusCode.success ) {
                  callback( stat, {
                    "status": "Record Inserted Successfully"
                  } )
                } else {
                  callback( stat, {
                    "status": "Unable to Process Given Body Data, Check the Body Data that you are trying to send"
                  } )
                }
              } )
            } )
          } else {
            callback( statusCode.clientError, {
              "status": "Beacon already associated with another Trailer,Choose another beacon to add"
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

module.exports.queryDataBaseListById = function( reqParams, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseListById, function( sts, msg ) {
    if ( sts == statusCode.success ) {
      sqlQuery.queryDataBaseListById( msg.trailerID, function( response ) {
        connection.GetDBData( response, function( stat, resp ) {
          if ( stat == statusCode.success ) {
            callback( stat, resp[ 0 ] )
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


module.exports.updateDataBaseTrailerById = function( reqParams, reqBody, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseListById, function( stat, message ) {

    if ( stat == statusCode.success ) {

      reqValidation( reqBody, joiSchemas.updateTrailerById, function( sts, msg ) {
        if ( sts == statusCode.success ) {

          function checkTrailer( trailerId ) {
            return new Promise( function( resolve, reject ) {
              sqlQuery.checkTrailerById( trailerId, function( response ) {
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


          checkTrailer( message.trailerID ).then( function( data ) {

            if ( data[ 0 ].length != 0 ) {

              if ( data[ 0 ][ 0 ].TrailerTypeId != msg.TrailerTypeId || data[ 0 ][ 0 ].PO_STO != msg.PO_STO || data[ 0 ][ 0 ].Carrier != msg.Carrier || data[ 0 ][ 0 ].LoadTypeId != msg.LoadTypeId || data[ 0 ][ 0 ].TrailerStatusId != msg.TrailerStatusId || data[ 0 ][ 0 ].PresentYard != msg.PresentYard ) {

                sqlQuery.updateTrailer( msg, message.trailerID, function( sqlEx ) {
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
                  "status": "The Trailer is already associated with same data that you are trying to send, Try with different details"
                } )
              }

            } else {
              callback( statusCode.clientError, {
                "status": "Trailer Number Not Found"
              } )
            }

          } )
        }
      } )
    } else {
      callback( statusCode.clientError, msg );
    }
  } )
}


module.exports.queryDataBaseCheckout = function( reqBody, callback ) {
  reqValidation( reqBody, joiSchemas.trailerCheckout, function( sts, msg ) {
    if ( sts == statusCode.success ) {

      function testBeaconAttached( Beacon ) {

        return new Promise( function( resolve, reject ) {
          sqlQuery.queryDataBaseCheckoutCheck( Beacon, function( response ) {
            connection.GetDBData( response, function( stat, resp ) {
              if ( stat == statusCode.success ) {
                resolve( resp )
              } else {
                reject( resp )
              }
            } )
          } )
        } )
      }

      testBeaconAttached( msg.BeaconId ).then( function( data ) {
          if ( data[ 0 ].length != 0 ) {
            sqlQuery.queryDataBaseCheckout( msg, function( sqlEx ) {

              connection.GetDBData( sqlEx, function( stat, resp ) {
               
                if ( stat == statusCode.success ) {
                  callback( stat, {
                    "status": "Record Updated Successfully"
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
              "status": "Beacon is already checked out, Choose another beacon to checked out"
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