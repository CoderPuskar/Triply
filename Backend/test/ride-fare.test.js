const test = require('node:test');
const assert = require('node:assert/strict');

const rideService = require('../services/ride.service');
const mapsService = require('../services/maps.service');
const rideModel = require('../models/ride.models');

test('rideService.getFare returns a selected vehicle fare when vehicleType is provided', async () => {
  const original = mapsService.getDistanceAndTime;
  mapsService.getDistanceAndTime = async () => ({ distance: '10.00', time: '20' });

  try {
    const result = await rideService.getFare('Howrah', 'Salt Lake', 'car');

    assert.equal(result.distance, 10);
    assert.equal(result.duration, 24);
    assert.equal(result.fare, 272);
  } finally {
    mapsService.getDistanceAndTime = original;
  }
});

test('rideService.createRide stores the selected vehicle fare', async () => {
  const originalDistanceTime = mapsService.getDistanceAndTime;
  const originalCreate = rideModel.create;
  mapsService.getDistanceAndTime = async () => ({ distance: '10.00', time: '20' });
  rideModel.create = async (ride) => ride;

  try {
    const ride = await rideService.createRide({
      user: '64a7b2d9f1c2d3e4f5a6b7c8',
      pickup: 'Howrah',
      destination: 'Salt Lake',
      vehicleType: 'car',
    });

    assert.equal(ride.fare, 272);
    assert.equal(ride.distance, 10);
    assert.equal(ride.duration, 24);
    assert.match(ride.otp, /^\d{6}$/);
  } finally {
    mapsService.getDistanceAndTime = originalDistanceTime;
    rideModel.create = originalCreate;
  }
});
