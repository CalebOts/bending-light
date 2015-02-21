// Copyright 2002-2015, University of Colorado
/**
 * View for the "prism break" tab.
 *
 * @author Sam Reid
 * @author Chandrashekar  Bemagoni(Actual Concepts)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var BendingLightView = require( 'BENDING_LIGHT/common/view/BendingLightView' );
  var MediumControlPanel = require( 'BENDING_LIGHT/common/view/MediumControlPanel' );
  // var Shape = require( 'KITE/Shape' );
  // var Path = require( 'SCENERY/nodes/Path' );
  //var MediumNode = require( 'BENDING_LIGHT/common/view/MediumNode' );
  //var LaserView = require( 'BENDING_LIGHT/common/view/LaserView' );
  // var NormalLine = require( 'BENDING_LIGHT/intro/view/NormalLine' );
  var Node = require( 'SCENERY/nodes/Node' );
  //var ToolboxNode = require( 'BENDING_LIGHT/common/view/ToolboxNode' );
  var LaserControlPanelNode = require( 'BENDING_LIGHT/prisms/view/LaserControlPanelNode' );
  var LaserTypeControlPanel = require( 'BENDING_LIGHT/prisms/view/LaserTypeControlPanel' );
  //var Property = require( 'AXON/Property' );
  //var WAVELENGTH_RED = BendingLightModel.WAVELENGTH_RED;//static
  var inset = 10;

  /**
   *
   * @param model
   * @constructor
   */
  function PrismBreakView( model ) {

    this.prismLayer = new Node();

    //Specify how the drag angle should be clamped
    function clampDragAngle( angle ) {
      return angle;
    }

    //Indicate if the laser is not at its max angle,
    // and therefore can be dragged to larger angles
    function clockwiseArrowNotAtMax( laserAngle ) {
      return laserAngle < Math.PI;
    }

    //Indicate if the laser is not at its min angle,
    // and can therefore be dragged to smaller angles.
    function ccwArrowNotAtMax( laserAngle ) {
      return laserAngle > Math.PI / 2;
    }

    //rotation if the user clicks top on the object
    function rotationRegionShape( full, back ) {
      return back;
    }


    function translationRegion( fullShape, backShape ) {
      //empty shape since shouldn't be rotatable in this tab
      return fullShape;
    }

    BendingLightView.call( this, model,
      clampDragAngle,
      clockwiseArrowNotAtMax,
      ccwArrowNotAtMax,
      true,
      translationRegion,
      rotationRegionShape, 'laserKnob',
      10 );


    var IndexOfRefractionDecimals = 2;
    //Add control panels for setting the index of refraction for each medium
    var environmentMediumMaterialListParent = new Node();
    var environmentMediumControlPanel = new MediumControlPanel( model, this, model.environmentMedium,
      'Environment', true, model.wavelengthProperty, IndexOfRefractionDecimals, environmentMediumMaterialListParent );
    environmentMediumControlPanel.setTranslation( this.layoutBounds.right - inset - environmentMediumControlPanel.width, this.layoutBounds.top + inset );
    this.afterLightLayer2.addChild( environmentMediumControlPanel );
    this.afterLightLayer2.addChild( environmentMediumMaterialListParent );
    var laserControlPanelNode = new LaserControlPanelNode( model.laser.colorProperty,
      model.wavelengthPropertyProperty, {
        bottom: this.layoutBounds.bottom - 200,
        right:  this.layoutBounds.right - inset
      } );
    this.addChild( laserControlPanelNode );


    var laserTypeControlPanel = new LaserTypeControlPanel( model.manyRays, {
      top:  this.layoutBounds.top - inset,
      left: this.layoutBounds.left + inset
    } );
    this.addChild( laserTypeControlPanel );

    //Add the reset all button
    var resetAllButton = new ResetAllButton(
      {
        listener: function() {

        },
        bottom: this.layoutBounds.bottom - inset,
        right:  this.layoutBounds.right - inset
      } );

    this.afterLightLayer2.addChild( resetAllButton );

    //Put the laser control panel node where it leaves enough vertical space for reset button between it and prism control panel

    //When the user unchecks "show normal" repropagate the model so that the graphics will sync up (showing or not showing the normal lines, as appropriate)

    //Optionally show the normal lines at each intersection

    this.beforeLightLayer.addChild( this.prismLayer );
    //Add the protractor node

  }

  return inherit( BendingLightView, PrismBreakView, {
    resetAll: function() {
      this.prismLayer.removeAllChildren();
    }
  } );
} );

