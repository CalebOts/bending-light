// Copyright 2015-2017, University of Colorado Boulder

/**
 * Base class for Bending Light
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chandrashekar Bemagoni (Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var bendingLight = require( 'BENDING_LIGHT/bendingLight' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LaserNode = require( 'BENDING_LIGHT/common/view/LaserNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RotationDragHandle = require( 'BENDING_LIGHT/common/view/RotationDragHandle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SingleColorLightCanvasNode = require( 'BENDING_LIGHT/common/view/SingleColorLightCanvasNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {BendingLightModel} bendingLightModel - main model of the simulations
   * @param {function} laserTranslationRegion - region that defines laser translation
   * @param {function} laserRotationRegion - region that defines laser rotation
   * @param {boolean} laserHasKnob - laser image
   * @param {Object} [options]
   * @constructor
   */
  function BendingLightView( bendingLightModel, laserTranslationRegion, laserRotationRegion, laserHasKnob, options ) {

    options = _.extend( {
      occlusionHandler: function() {}, // {function} moves objects out from behind a control panel if dropped there
      ccwArrowNotAtMax: function() {return true;}, // {function} shows whether laser at min angle
      clockwiseArrowNotAtMax: function() { return true; },// {function} shows whether laser at max angle, In prisms tab
      // laser node can rotate 360 degrees.so arrows showing all the times when laser node rotate
      clampDragAngle: function( angle ) { return angle; },// {function} function that limits the angle of laser to its bounds
      horizontalPlayAreaOffset: 0, // {number} in stage coordinates, how far to shift the play area horizontally
      verticalPlayAreaOffset: 0 // {number} in stage coordinates, how far to shift the play area vertically.  In the
                                // prisms screen, it is shifted up a bit to center the play area above the south control panel
    }, options );

    this.occlusionHandler = options.occlusionHandler;
    this.bendingLightModel = bendingLightModel;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 834, 504 ) } );

    var self = this;
    this.showProtractorProperty = new Property( false ); // @public (read-only)

    // In order to make controls (including the laser itself) accessible (not obscured by the large protractor), KP
    // suggested this layering order:
    // laser on top
    // Control boxes next
    // Protractor
    // Laser beam
    // To implement this, we specify 2 before light layers and 2 after light layers
    this.beforeLightLayer = new Node(); // @public (read-only)
    this.beforeLightLayer2 = new Node(); // @public (read-only)

    // in back of afterLightLayer2
    this.afterLightLayer = new Node(); // @public (read-only)
    this.afterLightLayer2 = new Node(); // @public (read-only)
    this.afterLightLayer3 = new Node(); // @public (read-only)

    var stageWidth = this.layoutBounds.width;
    var stageHeight = this.layoutBounds.height;

    // center the stage in the canvas, specifies how things scale up and down with window size, maps stage to pixels
    // create the transform from model (SI) to view (stage) coordinates
    var scale = stageHeight / bendingLightModel.modelHeight;

    // @public (read-only)
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( 0, 0 ),
      new Vector2( 388 - options.horizontalPlayAreaOffset, stageHeight / 2 + options.verticalPlayAreaOffset ),
      scale
    );

    // create and add the graphic for the environment medium
    this.mediumNode = new Node(); // @public (read-only)
    this.addChild( this.mediumNode );
    this.incidentWaveLayer = new Node(); // @public (read-only)

    this.singleColorLightNode = new SingleColorLightCanvasNode(
      this.modelViewTransform,
      stageWidth,
      stageHeight,
      bendingLightModel.rays
    );

    // layering
    this.addChild( this.beforeLightLayer2 );
    this.addChild( this.beforeLightLayer );
    this.addLightNodes(); // Nodes specific to that view
    this.addChild( this.singleColorLightNode );
    this.addChild( this.afterLightLayer );

    // This layer is to add laser view control panel
    // Note: this layer to make protractor behind laser view panel and laser node on top of laser view panel.
    this.laserViewLayer = new Node(); // @public (read-only)
    this.addChild( this.laserViewLayer );

    // add rotation for the laser that show if/when the laser can be rotated about its pivot
    var showRotationDragHandlesProperty = new Property( false );
    var showTranslationDragHandlesProperty = new Property( false );

    var laserNode = new LaserNode( this.modelViewTransform, bendingLightModel.laser, showRotationDragHandlesProperty,
      showTranslationDragHandlesProperty, options.clampDragAngle, laserTranslationRegion, laserRotationRegion,
      laserHasKnob, this.visibleBoundsProperty, this.occlusionHandler
    );

    // add laser node rotation and translation arrows in array, to move them to front of all other nodes in prism screen
    this.addLaserHandles(
      showRotationDragHandlesProperty,
      showTranslationDragHandlesProperty,
      options.clockwiseArrowNotAtMax,
      options.ccwArrowNotAtMax,
      laserNode.laserImageWidth
    );

    // add the laser
    this.addChild( laserNode );

    this.addChild( this.afterLightLayer2 );

    // Layer for the rightmost control panels, so that all sensors will go behind them
    this.addChild( this.afterLightLayer3 );

    // switches between ray and wave
    bendingLightModel.laserViewProperty.link( function( laserView ) {
      bendingLightModel.laser.waveProperty.value = (laserView === 'wave');
    } );

    Property.multilink( [ bendingLightModel.laser.colorModeProperty, bendingLightModel.laserViewProperty ],
      function( colorMode, laserView ) {
        self.singleColorLightNode.visible = laserView === 'ray' && colorMode !== 'white';
      }
    );

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      self.singleColorLightNode.setCanvasBounds( visibleBounds );
    } );
  }

  bendingLight.register( 'BendingLightView', BendingLightView );
  
  return inherit( ScreenView, BendingLightView, {

    reset: function() {
      this.showProtractorProperty.reset();
    },

    // @protected - intended to be overriden by subclasses
    step: function() {
      if ( this.singleColorLightNode.visible ) {
        this.singleColorLightNode.step();
      }
    },

    // @protected - overriden for IntroView to add the wave nodes
    addLightNodes: function() {},

    addLaserHandles: function( showRotationDragHandlesProperty, showTranslationDragHandlesProperty,
                               clockwiseArrowNotAtMax, ccwArrowNotAtMax, laserImageWidth ) {
      var bendingLightModel = this.bendingLightModel;

      // Shows the direction in which laser can be rotated
      // for laser left rotation
      var leftRotationDragHandle = new RotationDragHandle( this.modelViewTransform, bendingLightModel.laser,
        Math.PI / 23, showRotationDragHandlesProperty, clockwiseArrowNotAtMax, laserImageWidth * 0.58,
        bendingLightModel.rotationArrowAngleOffset );
      this.addChild( leftRotationDragHandle );

      // for laser right rotation
      var rightRotationDragHandle = new RotationDragHandle( this.modelViewTransform, bendingLightModel.laser,
        -Math.PI / 23,
        showRotationDragHandlesProperty, ccwArrowNotAtMax, laserImageWidth * 0.58,
        bendingLightModel.rotationArrowAngleOffset
      );
      this.addChild( rightRotationDragHandle );
    }
  } );
} );