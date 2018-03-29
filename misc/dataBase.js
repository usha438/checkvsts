var connection = require( "../database/dbConnection" );
var sqlQuery = require( "../database/sqlQuerys" );
var reqValidation = require( "../validation/reqValid" );
var joiSchemas = require( "../validation/joiSchemas" );
var statusCode = require( '../validation/statusCodes' );




module.exports.queryResolveBeacons = function( reqBody, callback ) {
  reqValidation( reqBody, joiSchemas.resolveBeacons, function( sts, msg ) {
    if ( sts == statusCode.success ) {

      function checkBeaconAssigned( Major, Minor ) {
        return new Promise( function( resolve, reject ) {
          sqlQuery.queryResolveBeaconsCheck( Major, Minor, function( response ) {
            connection.GetDBData( response, function( stat, rasp ) {
              if ( stat == statusCode.success ) {
                resolve( rasp )
              } else {
                reject( rasp );
              }
            } )
          } )
        } )
      }
      checkBeaconAssigned( msg.Major, msg.Minor ).then( function( data ) {
          if ( data[ 0 ].length != 0 ) {
            Hooked = "true"
          } else {
            Hooked = "false"
          }

          sqlQuery.queryResolveBeacons( msg.Major, msg.Minor, function( sqlEx ) {
            connection.GetDBData( sqlEx, function( stat, rasp ) {
              rasp[ 0 ][ 0 ][ "Hooked" ] = Hooked
              callback( stat, rasp );
            } )
          } )

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


module.exports.queryDataBaseBeacons = function( callback ) {
  connection.GetDBData( sqlQuery.queryDataBaseBeacons, function( stat, rasp ) {
    if ( stat == statusCode.success ) {
      callback( stat, rasp[ 0 ] );
    } else {
      callback( stat, {
        "status": "Unable to Process the Data"
      } )
    }
  } )
}

module.exports.queryDataBaseBeaconsId = function( reqParams, callback ) {
  reqValidation( reqParams, joiSchemas.queryDataBaseBeaconsId, function( sts, msg ) {
    if ( sts == statusCode.success ) {
      sqlQuery.queryDataBaseBeaconsId( msg.beaconID, function( response ) {
        connection.GetDBData( response, function( stat, rasp ) {
          if ( stat == statusCode.success ) {
            callback( stat, rasp[ 0 ] );
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