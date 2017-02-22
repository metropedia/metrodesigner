import * as helper from "../../../vendor/metrojs/helpers";

export function implement() {
    this.app.inputMode = this.metro.setInputMode('implement');
    var el = this.metro.getElements();
    el.pointer.
      classed('hide', true)
    ;
    el.shade.
      classed('hide', true)
    ;
    el.svg.
      classed('input-mode-select', false)
    ;
};

export function addStation() {
    var metroLine = this.metro.getCurrentMetroLine();
  
    if (this.metro.getPathString(metroLine) == '') {
      throw 'Empty Metro Line';
      return;
    } else {
      this.implement();
    }
  
    var layerStations = metroLine.layers.stations;
    var station = this.metro.newStation();
        station.id = metroLine.stations.length;
  
    this.drawStation(layerStations, station, this.metro);
  
    this.metro.addStationObject(station);
    this.moveStation(metroLine, station);
};

export function moveStation(line, station) {
    station.position = parseFloat(station.position);
    var metroLine = this.metro.getMetroLineById(line.id);
    var layerStations = metroLine.layers.stations;
    var guide = metroLine.guide.node();
  
    var d = guide.getPointAtLength(station.position/100*guide.getTotalLength());
    layerStations.select('.svg-station[station-id="'+station.id+'"]')
      .attr('x', d.x)
      .attr('y', d.y)
    ;
};

export function drawStation (container, station, def) {
  return container.append('rect')
    .attr('station-id', station.id)
    .attr('rx', 6)
    .attr('ry', 6)
    .attr('x', helper.round(.5 * def.width, def.resolution))
    .attr('y', helper.round(.5 * def.height, def.resolution))
    .attr('width', 22)
    .attr('height', 22)
    .attr('transform', 'translate(-11, -11)')
    .attr('stroke-width', 2)
    .classed('svg-station', true)
  ;
};

