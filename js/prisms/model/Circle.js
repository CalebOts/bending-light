// Copyright 2002-2015, University of Colorado Boulder

/**
 * Circle implementation for use in prisms
 *
 * @author Chandrashekar Bemagoni (Actual Concepts)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Intersection = require( 'BENDING_LIGHT/prisms/model/Intersection' );
  var Ray2 = require( 'DOT/Ray2' );

  /**
   *
   * @param {Vector2} center - center of the circle
   * @param {number} radius - radius of the circle
   * @constructor
   */
  function Circle( center, radius ) {

    this.center = center;
    this.radius = radius;

    // Creates a shape
    this.shape = new Shape().ellipticalArcPoint( this.center, this.radius, this.radius, 0, 0, Math.PI * 2, false );
  }

  return inherit( Object, Circle, {

    /**
     * Create a new Circle translated by the specified amount
     * @public
     * @param {number} deltaX - amount of space to be translate in x direction
     * @param {number} deltaY - amount of space to be translate in y direction
     * @returns {Circle}
     */
    getTranslatedInstance: function( deltaX, deltaY ) {
      return new Circle( this.center.plusXY( deltaX, deltaY ), this.radius );
    },

    /**
     * Finds the intersections between the edges of the circle and the specified ray
     * @public
     * @param {Ray} ray - model of the ray
     * @returns {Array}
     */
    getIntersections: function( ray ) {
      var intersectionArray = this.shape.intersection( new Ray2( ray.tail, ray.directionUnitVector ) );
      var intersectionList = [];
      var self = this;
      intersectionArray.forEach( function( intersectionPoint ) {

        // Filter out getLineCircleIntersection nulls, which are returned if there is no intersection
        if ( intersectionPoint !== null ) {

          // Only consider intersections that are in front of the ray
          if ( ((intersectionPoint.point.x - ray.tail.x) * ray.directionUnitVector.x +
                (intersectionPoint.point.y - ray.tail.y) * ray.directionUnitVector.y) > 0 ) {
            var normalVector = intersectionPoint.point.minus( self.center ).normalize();
            if ( normalVector.dot( ray.directionUnitVector ) > 0 ) {
              normalVector = normalVector.negate();
            }
            intersectionList.push( new Intersection( normalVector, intersectionPoint.point ) );
          }
        }
      } );
      return intersectionList;
    },

    /**
     * Create a new Circle rotated by the specified angle
     * @public
     * @param {number} angle - angle to be rotated
     * @param {Vector2} rotationPoint - point around which circle to be rotated
     * @returns {Circle}
     */
    getRotatedInstance: function( angle, rotationPoint ) {

      // we create a new circle with a rotated center point
      var vectorAboutCentroid = this.getRotationCenter().subtract( rotationPoint );
      var rotated = vectorAboutCentroid.rotate( angle );
      return new Circle( rotated.add( rotationPoint ), this.radius );
    },

    /**
     * Computes the centroid of the corner points
     * @public
     * @returns {Vector2}
     */
    getRotationCenter: function() {
      return this.center;
    },

    /**
     * Signify that the circle can't be rotated
     * @public
     * @returns {null}
     */
    getReferencePoint: function() {
      return null;
    },

    /**
     * Determines whether shape contains given point or not
     * @public
     * @param {Vector2} point
     * @returns {boolean}
     */
    containsPoint: function( point ) {
      return point.distance( this.center ) <= this.radius;
    }
  } );
} );