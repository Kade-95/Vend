let starLevel, star;
let favoured = 300000;
let addFrequency = 33;
let addPeriod = 20;
let ratings = 50;
let conversionRate = 45;
let responseRate = 63;
let uploadRate = 23;
let duration = 300;

starLevel = Math.round((favoured/duration + addFrequency + addPeriod + ratings + conversionRate + responseRate + uploadRate) / 7 / 10);

let starRatings = {
    patron: 90,
    inferno: 80,
    wild: 70,
    virgo: 60,
    blaze: 50,
    flame: 40,
    flare: 30,
    ember: 20,
    spark: 10,
    fresh: 0
}
let starLevels = [
    'Fresh',
    'Spark',
    'Ember',
    'Flare',
    'Flame',
    'Blaze',
    'Virgo',
    'Wild',
    'Inferno',
    'Patron',
];

star = starLevels[starLevel] || 'Universal'

console.log(star, starLevel)