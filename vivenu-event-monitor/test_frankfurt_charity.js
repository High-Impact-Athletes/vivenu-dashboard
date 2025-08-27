#!/usr/bin/env node

/**
 * Standalone Frankfurt Charity Calculation Test
 * 
 * This script validates that the comprehensive ticket scraping approach
 * correctly calculates Frankfurt charity tickets as 46% sold (95/205)
 * instead of the incorrect 8% from proportional estimation.
 * 
 * Usage: node test_frankfurt_charity.js
 */

import { AvailabilityService } from './src/services/availability.js';
import { TicketScraper } from './src/services/ticket-scraper.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Frankfurt event details
const FRANKFURT_EVENT_ID = '688893B5193E98F877D838E0';
const REGION = 'DACH';
const API_KEY = process.env.DACH_API || process.env.DACH_API_KEY;

console.log('🎯 FRANKFURT CHARITY CALCULATION TEST');
console.log('=====================================');
console.log(`Event ID: ${FRANKFURT_EVENT_ID}`);
console.log(`Region: ${REGION}`);
console.log(`API Key: ${API_KEY ? 'Found' : 'MISSING!'}`);
console.log();

if (!API_KEY) {
  console.error('❌ Missing DACH_API environment variable');
  console.error('Please set DACH_API=your_api_key_here');
  process.exit(1);
}

// Mock environment object
const mockEnv = {
  DACH_API: API_KEY,
  KV: null // No caching for this test
};

async function saveProgress(filename, data) {
  const filepath = join(__dirname, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`📁 Saved: ${filename}`);
}

async function testFrankfurtCharity() {
  try {
    console.log('🔄 Initializing services...');
    
    // Create services
    const ticketScraper = new TicketScraper(REGION, mockEnv);
    const availabilityService = new AvailabilityService(REGION, API_KEY, 'PROD', null, mockEnv);
    
    console.log('✅ Services initialized');
    console.log();
    
    // Step 1: Get event with ticket types
    console.log('📋 Step 1: Fetching event and ticket types...');
    const event = await availabilityService.getEventWithTickets(FRANKFURT_EVENT_ID);
    
    console.log(`Event: ${event.name}`);
    console.log(`Total ticket types: ${event.tickets?.length || 0}`);
    
    // Filter primary tickets
    const allTicketTypes = event.tickets || [];
    const primaryTicketTypes = ticketScraper.filterPrimaryTicketTypes(allTicketTypes);
    
    console.log(`Primary ticket types (after filtering): ${primaryTicketTypes.length}`);
    console.log();
    
    // Step 2: Comprehensive ticket scraping
    console.log('🎫 Step 2: Comprehensive ticket scraping...');
    console.log('This may take several minutes for 18,000+ tickets...');
    
    const scrapingResult = await ticketScraper.scrapeAllTickets(FRANKFURT_EVENT_ID);
    
    // Save scraping progress
    await saveProgress('frankfurt_scraping_progress.json', {
      eventId: FRANKFURT_EVENT_ID,
      totalFetched: scrapingResult.totalFetched,
      expectedTotal: scrapingResult.expectedTotal,
      completionRate: scrapingResult.completionRate,
      scrapedAt: scrapingResult.scrapedAt
    });
    
    console.log(`📊 Scraping complete: ${scrapingResult.totalFetched}/${scrapingResult.expectedTotal} tickets (${scrapingResult.completionRate.toFixed(1)}%)`);
    console.log();
    
    // Step 3: Analyze ticket type counts
    console.log('🔍 Step 3: Analyzing ticket types...');
    
    const ticketTypeCounts = ticketScraper.getTicketTypeCounts(scrapingResult);
    
    console.log('Primary ticket types found:');
    ticketTypeCounts.forEach(type => {
      console.log(`  - ${type.ticketName}: ${type.soldCount} sold`);
    });
    console.log();
    
    // Step 4: Focus on charity tickets
    console.log('🎯 Step 4: Charity ticket analysis...');
    
    // Find charity-related tickets
    const charityTickets = ticketTypeCounts.filter(type => 
      type.ticketName.toLowerCase().includes('charity')
    );
    
    if (charityTickets.length === 0) {
      console.log('❌ No charity tickets found in scraped data');
      console.log('Available ticket types:');
      ticketTypeCounts.slice(0, 10).forEach(type => {
        console.log(`  - ${type.ticketName}`);
      });
      return;
    }
    
    // Find charity ticket type in event configuration
    const charityTicketType = primaryTicketTypes.find(tt => 
      tt.name.toLowerCase().includes('charity')
    );
    
    if (!charityTicketType) {
      console.log('❌ No charity ticket type found in event configuration');
      return;
    }
    
    const charityCapacity = charityTicketType.amount || 0;
    const charitySold = ticketScraper.getSoldCountForTicketType(scrapingResult, charityTicketType.name);
    const charityAvailable = Math.max(0, charityCapacity - charitySold);
    const charityPercentSold = charityCapacity > 0 ? (charitySold / charityCapacity) * 100 : 0;
    
    const charityResults = {
      ticketTypeName: charityTicketType.name,
      capacity: charityCapacity,
      sold: charitySold,
      available: charityAvailable,
      percentSold: Math.round(charityPercentSold * 100) / 100,
      status: charityPercentSold >= 100 ? 'soldout' : charityPercentSold >= 80 ? 'limited' : 'available'
    };
    
    // Save detailed results
    await saveProgress('frankfurt_charity_tickets.json', {
      eventId: FRANKFURT_EVENT_ID,
      eventName: event.name,
      charityResults,
      allCharityTicketsFound: charityTickets,
      scrapingStats: {
        totalFetched: scrapingResult.totalFetched,
        completionRate: scrapingResult.completionRate
      }
    });
    
    // Step 5: Final validation
    console.log('📊 CHARITY CALCULATION RESULTS:');
    console.log('================================');
    console.log(`Ticket Type: ${charityResults.ticketTypeName}`);
    console.log(`Capacity: ${charityResults.capacity}`);
    console.log(`Sold: ${charityResults.sold}`);
    console.log(`Available: ${charityResults.available}`);
    console.log(`Percent Sold: ${charityResults.percentSold}%`);
    console.log(`Status: ${charityResults.status}`);
    console.log();
    
    // Validation against expected result
    console.log('🎯 VALIDATION:');
    console.log('==============');
    console.log('Expected (from manual calculation): 95 sold / 205 total = 46.3% sold');
    console.log(`Actual (from comprehensive scraping): ${charityResults.sold} sold / ${charityResults.capacity} total = ${charityResults.percentSold}% sold`);
    
    const isCorrect = Math.abs(charityResults.percentSold - 46.3) < 2.0; // Allow 2% tolerance
    
    if (isCorrect) {
      console.log('✅ SUCCESS: Charity calculation matches expected result!');
      console.log('✅ The comprehensive ticket scraping approach is working correctly.');
      console.log('✅ Secondary tickets with inflated capacity have been filtered out.');
    } else {
      console.log('❌ MISMATCH: Charity calculation does not match expected result.');
      console.log('❌ Further investigation needed.');
    }
    
    // Save final summary
    const finalResults = {
      success: isCorrect,
      expected: {
        sold: 95,
        capacity: 205,
        percentSold: 46.3
      },
      actual: charityResults,
      message: isCorrect ? 
        'Comprehensive ticket scraping is working correctly' : 
        'Results do not match expected calculation'
    };
    
    await saveProgress('frankfurt_results.json', finalResults);
    
    console.log();
    console.log('📁 Output files saved:');
    console.log('  - frankfurt_scraping_progress.json');
    console.log('  - frankfurt_charity_tickets.json');
    console.log('  - frankfurt_results.json');
    console.log();
    
    return isCorrect;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    
    await saveProgress('frankfurt_error.json', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return false;
  }
}

// Run the test
testFrankfurtCharity()
  .then(success => {
    console.log(success ? '🎉 Test completed successfully!' : '💥 Test failed!');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });