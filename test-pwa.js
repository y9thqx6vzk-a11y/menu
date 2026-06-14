import assert from 'assert';
import fs from 'fs';
import { getOptimizedCloudinaryUrl } from './src/utils/cloudinary.js';

const itineraryData = JSON.parse(
  fs.readFileSync('./src/data/itinerary.json', 'utf8')
);

// Utility to calculate current day index from standard date
function calculateTripDayForDate(testDateStr, startDateStr, endDateStr, totalDays) {
  const now = new Date(testDateStr);
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (now >= start && now <= end) {
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(Math.max(diffDays, 1), totalDays);
  }
  return 1;
}

function runPwaTests() {
  console.log('--- RUNNING CLOUDINARY OPTIMIZER TESTS ---');

  // Test case 1: Standard upload URL
  const url1 = 'https://res.cloudinary.com/sri-lanka-women/image/upload/v1700000001/colombo_skyline.jpg';
  const opt1 = getOptimizedCloudinaryUrl(url1, 600);
  assert.strictEqual(
    opt1, 
    'https://res.cloudinary.com/sri-lanka-women/image/upload/f_auto,q_auto,w_600,c_limit/v1700000001/colombo_skyline.jpg',
    'Standard upload url should be correctly optimized'
  );
  console.log('✅ [PASS] Standard Cloudinary URL optimization');

  // Test case 2: External URLs (should remain untouched)
  const url2 = 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800';
  const opt2 = getOptimizedCloudinaryUrl(url2, 600);
  assert.strictEqual(opt2, url2, 'External URLs should not be modified');
  console.log('✅ [PASS] External image URL (Unsplash) bypasses optimizer');

  // Test case 3: Already transformed URL (should replace previous transformations)
  const url3 = 'https://res.cloudinary.com/sri-lanka-women/image/upload/w_200,c_scale/v1700000002/sigiriya_rock.jpg';
  const opt3 = getOptimizedCloudinaryUrl(url3, 500);
  assert.strictEqual(
    opt3,
    'https://res.cloudinary.com/sri-lanka-women/image/upload/f_auto,q_auto,w_500,c_limit/v1700000002/sigiriya_rock.jpg',
    'Pre-existing inline transformations should be stripped and updated'
  );
  console.log('✅ [PASS] Legacy Cloudinary transforms correctly stripped and updated');


  console.log('\n--- RUNNING TRIP CALENDAR CALCULATION TESTS ---');

  const startStr = itineraryData.startDate; // "2026-10-15T00:00:00.000Z"
  const endStr = itineraryData.endDate;     // "2026-10-24T23:59:59.000Z"
  const totalDays = itineraryData.days.length;

  // Test case 4: Pre-trip date (e.g. August 25th)
  const preDay = calculateTripDayForDate('2026-08-25T12:00:00.000Z', startStr, endStr, totalDays);
  assert.strictEqual(preDay, 1, 'Dates prior to trip should default to Day 1');
  console.log('✅ [PASS] Pre-trip date returns Day 1');

  // Test case 5: Day 1 of the trip (August 30th)
  const day1 = calculateTripDayForDate('2026-08-30T10:00:00.000Z', startStr, endStr, totalDays);
  assert.strictEqual(day1, 1, 'August 30th should resolve to Day 1');
  console.log('✅ [PASS] Day 1 date resolves correctly');

  // Test case 6: Day 5 of the trip (September 3rd)
  const day5 = calculateTripDayForDate('2026-09-03T14:30:00.000Z', startStr, endStr, totalDays);
  assert.strictEqual(day5, 5, 'September 3rd should resolve to Day 5');
  console.log('✅ [PASS] Day 5 date resolves correctly');

  // Test case 7: Post-trip date (e.g. September 15th)
  const postDay = calculateTripDayForDate('2026-09-15T08:00:00.000Z', startStr, endStr, totalDays);
  assert.strictEqual(postDay, 1, 'Dates after the trip ends should default to Day 1 (or handle in UI)');
  console.log('✅ [PASS] Post-trip date defaults safely');

  console.log('\nAll utility tests passed successfully! 🚀\n');
}

runPwaTests();
