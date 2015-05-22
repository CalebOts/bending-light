// Copyright 2002-2015, University of Colorado Boulder
/**
 * Graphic that depicts how the laser may be moved.
 * It is only shown when the cursor is over the laser and is non-interactive.
 *
 * @author Sam Reid
 * @author Chandrashekar bemagoni(Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );

  //images
  var laserImage = require( 'image!BENDING_LIGHT/laser.png' );

  /**
   *
   * @param {ModelViewTransform2} modelViewTransform to convert between model and view co-ordinate frames
   * @param {Laser} laser - model of laser
   * @param {number} dx
   * @param {number} dy
   * @param {Property<boolean>} showDragHandlesProperty
   * @constructor
   */
  function TranslationDragHandle( modelViewTransform, laser, dx, dy, showDragHandlesProperty ) {

    Node.call( this );
    var translationDragHandle = this;

    showDragHandlesProperty.linkAttribute( translationDragHandle, 'visible' );

    var image = new Image( laserImage );

    var counterClockwiseDragArrow = new ArrowNode( 0, 0, 0, 0, {
      headHeight: 16,
      headWidth: 16,
      tailWidth: 8,
      fill: '#33FF00'
    } );
    translationDragHandle.addChild( counterClockwiseDragArrow );

    // update the location when laser pivot or emission point change
    Property.multilink( [ laser.pivotProperty, laser.emissionPointProperty ],
      function( laserPivot, laserEmission ) {
        var laserAngle = -laser.getAngle();
        var magnitude = image.getWidth() * 0.35;
        var viewDeltaX = magnitude * Math.cos( laserAngle );
        var viewDeltaY = magnitude * Math.sin( laserAngle );
        var tailX = modelViewTransform.modelToViewX( laserEmission.x ) + viewDeltaX;
        var tailY = modelViewTransform.modelToViewY( laserEmission.y ) + viewDeltaY;
        counterClockwiseDragArrow.setTailAndTip( tailX, tailY, tailX + dx * 0.76, tailY + dy * 0.76 );
      } );
  }

  return inherit( Node, TranslationDragHandle );
} );