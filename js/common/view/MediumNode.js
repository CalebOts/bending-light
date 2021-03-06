// Copyright 2015-2017, University of Colorado Boulder
/**
 * Graphic that draws a medium such as air, water, glass, etc.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chandrashekar Bemagoni (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var bendingLight = require( 'BENDING_LIGHT/bendingLight' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   * @param {ModelViewTransform2} modelViewTransform - converts between model and view co-ordinates
   * @param {Property.<Medium>} mediumProperty - specifies medium
   * @constructor
   */
  function MediumNode( modelViewTransform, mediumProperty ) {
    Node.call( this, { pickable: false } ); // user can't interact with the medium except through control panels.

    // add the shape that paints the medium
    var mediumRectangleNode = new Path( modelViewTransform.modelToViewShape( mediumProperty.value.shape ), {
      stroke: 'gray',
      fill: mediumProperty.value.color
    } );
    this.addChild( mediumRectangleNode );

    // Update whenever the medium changes
    mediumProperty.link( function( medium ) {
      mediumRectangleNode.fill = medium.color;
    } );
  }

  bendingLight.register( 'MediumNode', MediumNode );
  
  return inherit( Node, MediumNode );
} );
