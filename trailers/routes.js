var trailerController = require( './controller' );

var trailerRoute = function( app, router ) {

  app.route( '/trailers' )
    .get( trailerController.trailerList )
    .post( trailerController.trailerCreate );

  app.route( '/trailers/:trailerID' )
    .get( trailerController.trailerListById );
	
  app.route( '/trailers/:trailerID' )
    .put( trailerController.trailerUpdateById );

  app.route( '/trailers/checkout' )
    .post( trailerController.trailerCheckout );
}

module.exports = trailerRoute;