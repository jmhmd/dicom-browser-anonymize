/* eslint-disable no-shadow */
/* eslint-disable no-continue */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import { cornerstoneTools } from './cornerstone-setup';

const { external, getToolState, toolColors } = cornerstoneTools;

const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool');

const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const draw = cornerstoneTools.import('drawing/draw');
const fillBox = cornerstoneTools.import('drawing/fillBox');
const setShadow = cornerstoneTools.import('drawing/setShadow');
const drawHandles = cornerstoneTools.import('drawing/drawHandles');
const drawRect = cornerstoneTools.import('drawing/drawRect');

// Util
// const throttle = cornerstoneTools.import('util/throttle');
// const getLogger = cornerstoneTools.import('util/logger');
// const triggerEvent = cornerstoneTools.import('util/triggerEvent');
/* const getPixelSpacing = cornerstoneTools.import('util/getPixelSpacing'); */

// const { rectangleRoiCursor } = cornerstoneTools.import('cursors/index');

// const { logger } = getLogger('tools:annotation:RectangleRoiTool');

/**
 * @public
 * @class RectangleRoiTool
 * @memberof Tools.Annotation
 * @classdesc Tool for drawing rectangular regions of interest, and measuring
 * the statistics of the enclosed pixels.
 * @extends Tools.Base.BaseAnnotationTool
 */
export default class RectangleRoiTool extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'RectangleRedact',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        drawHandles: true,
        // showMinMax: false,
        // showHounsfieldUnits: true
      },
      // svgCursor: rectangleRoiCursor,
    };

    super(props, defaultProps);

    /* this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110); */
    /* this.throttledEmitCoords = throttle(this.emitCoords, 110); */
  }

  createNewMeasurement(eventData) {
    const goodEventData = eventData && eventData.currentPoints && eventData.currentPoints.image;

    if (!goodEventData) {
      console.error(`required eventData not supplied to tool ${this.name}'s createNewMeasurement`);

      return false;
    }

    return {
      visible: true,
      active: true,
      color: undefined,
      invalidated: true,
      handles: {
        start: {
          x: eventData.currentPoints.image.x,
          y: eventData.currentPoints.image.y,
          highlight: true,
          active: false,
        },
        end: {
          x: eventData.currentPoints.image.x,
          y: eventData.currentPoints.image.y,
          highlight: true,
          active: true,
        },
        initialRotation: eventData.viewport.rotation,
        textBox: {
          active: false,
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true,
        },
      },
    };
  }

  pointNearTool(element, data, coords, interactionType) {
    const hasStartAndEndHandles = data && data.handles && data.handles.start && data.handles.end;
    const validParameters = hasStartAndEndHandles;

    if (!validParameters) {
      console.warn(`invalid parameters supplied to tool ${this.name}'s pointNearTool`);
    }

    if (!validParameters || data.visible === false) {
      return false;
    }

    const distance = interactionType === 'mouse' ? 15 : 25;
    const startCanvas = external.cornerstone.pixelToCanvas(element, data.handles.start);
    const endCanvas = external.cornerstone.pixelToCanvas(element, data.handles.end);

    const rect = {
      left: Math.min(startCanvas.x, endCanvas.x),
      top: Math.min(startCanvas.y, endCanvas.y),
      width: Math.abs(startCanvas.x - endCanvas.x),
      height: Math.abs(startCanvas.y - endCanvas.y),
    };

    const distanceToPoint = external.cornerstoneMath.rect.distanceToPoint(rect, coords);

    return distanceToPoint < distance;
  }

  /* emitCoords(handles, element) {
    const coords = _getRectangleImageCoordinates(handles.start, handles.end);
    triggerEvent(element, 'RedactCoords', coords);
  } */

  // eslint-disable-next-line no-unused-vars
  updateCachedStats(image, element, data) {
    /* const seriesModule =
      external.cornerstone.metaData.get('generalSeriesModule', image.imageId) || {};
    const modality = seriesModule.modality;
    const pixelSpacing = getPixelSpacing(image);

    const stats = _calculateStats(image, element, data.handles, modality, pixelSpacing);

    data.cachedStats = stats;
    data.invalidated = false; */
  }

  renderToolData(evt) {
    const toolData = getToolState(evt.currentTarget, this.name);

    if (!toolData) {
      return;
    }

    const eventData = evt.detail;
    const { element } = eventData;
    /* const lineWidth = toolStyle.getToolWidth(); */
    const { handleRadius, drawHandlesOnHover } = this.configuration;
    const context = getNewContext(eventData.canvasContext.canvas);
    /* const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image); */

    /* // Meta
    const seriesModule =
      external.cornerstone.metaData.get('generalSeriesModule', image.imageId) || {}; */

    /* // Pixel Spacing
    const modality = seriesModule.modality;
    const hasPixelSpacing = rowPixelSpacing && colPixelSpacing; */

    draw(context, context => {
      // If we have tool data for this element - iterate over each set and draw it
      for (let i = 0; i < toolData.data.length; i += 1) {
        const data = toolData.data[i];

        if (data.visible === false) {
          continue;
        }

        /* // Emit coords
        this.emitCoords(data.handles, element); */

        // Configure
        // const color = toolColors.getColorIfActive(data);
        const color = data.active ? toolColors.getActiveColor() : toolColors.getToolColor();
        const handleOptions = {
          color,
          handleRadius,
          drawHandlesIfActive: drawHandlesOnHover,
        };

        setShadow(context, this.configuration);

        // Draw
        drawRect(
          context,
          element,
          data.handles.start,
          data.handles.end,
          {
            color,
          },
          'pixel',
          data.handles.initialRotation
        );

        // context.fillStyle = '#FF0000';
        // const boundingBox = _getRectangleImageCoordinates(data.handles.start, data.handles.end);
        // context.fillRect(boundingBox.left, boundingBox.top, boundingBox.width, boundingBox.height);

        fillBox(
          context,
          _getRectangleImageCoordinates(
            external.cornerstone.pixelToCanvas(element, data.handles.start),
            external.cornerstone.pixelToCanvas(element, data.handles.end)
          ),
          'rgba(0, 0, 0, 0.5)'
        );

        if (this.configuration.drawHandles) {
          drawHandles(context, eventData, data.handles, handleOptions);
        }

        /* // Update textbox stats
        if (data.invalidated === true) {
          if (data.cachedStats) {
            this.throttledUpdateCachedStats(image, element, data);
          } else {
            this.updateCachedStats(image, element, data);
          }
        } */

        /* // Default to textbox on right side of ROI
        if (!data.handles.textBox.hasMoved) {
          const defaultCoords = getROITextBoxCoords(eventData.viewport, data.handles);

          Object.assign(data.handles.textBox, defaultCoords);
        } */

        /* const textBoxAnchorPoints = handles => _findTextBoxAnchorPoints(handles.start, handles.end);
        const textBoxContent = _createTextBoxContent(
          context,
          image.color,
          data.cachedStats,
          modality,
          hasPixelSpacing,
          this.configuration
        );

        data.unit = _getUnit(modality, this.configuration.showHounsfieldUnits);

        drawLinkedTextBox(
          context,
          element,
          data.handles.textBox,
          textBoxContent,
          data.handles,
          textBoxAnchorPoints,
          color,
          lineWidth,
          10,
          true
        ); */
      }
    });
  }
}

/**
 * TODO: This is the same method (+ GetPixels) for the other ROIs
 * TODO: The pixel filtering is the unique bit
 *
 * @param {*} startHandle
 * @param {*} endHandle
 * @returns {{ left: number, top: number, width: number, height: number}}
 */
function _getRectangleImageCoordinates(startHandle, endHandle) {
  return {
    left: Math.min(startHandle.x, endHandle.x),
    top: Math.min(startHandle.y, endHandle.y),
    width: Math.abs(startHandle.x - endHandle.x),
    height: Math.abs(startHandle.y - endHandle.y),
  };
}
