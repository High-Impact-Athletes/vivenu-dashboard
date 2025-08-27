#!/usr/bin/env python3
"""
Main validation runner - runs all validation checks
Orchestrates the complete validation process

Usage:
    python validate_charity_tickets.py NICE
    python validate_charity_tickets.py FRANKFURT
"""

import os
import sys
import subprocess
from pathlib import Path
from datetime import datetime

def run_validation_step(script_name: str, region: str, description: str):
    """Run a validation script and return success status"""
    print(f"\n{'='*60}")
    print(f"🔄 {description}")
    print(f"{'='*60}")
    
    script_path = Path(__file__).parent / script_name
    
    try:
        # Run the validation script
        result = subprocess.run([
            sys.executable, 
            str(script_path), 
            region
        ], capture_output=True, text=True, timeout=300)  # 5 minute timeout
        
        # Print the output
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(f"STDERR: {result.stderr}")
        
        if result.returncode == 0:
            print(f"✅ {description} - COMPLETED")
            return True
        else:
            print(f"❌ {description} - FAILED (exit code: {result.returncode})")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"⏰ {description} - TIMED OUT (5 minutes)")
        return False
    except Exception as e:
        print(f"❌ {description} - ERROR: {e}")
        return False

def validate_charity_tickets(region: str):
    """Run complete validation process"""
    
    print(f"🎯 CHARITY TICKETS VALIDATION")
    print(f"Region: {region}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")
    
    # Validation steps
    steps = [
        ("get_ticket_types_from_event.py", "Getting ticket types from event endpoint"),
        ("get_purchased_tickets_summary.py", "Getting purchased tickets summary"),
    ]
    
    results = {}
    
    # Run validation steps
    for script, description in steps:
        success = run_validation_step(script, region, description)
        results[script] = success
        
        if not success:
            print(f"\n⚠️  Step failed but continuing with remaining validations...")
    
    # Run comparison (with special handling for NICE)
    print(f"\n{'='*60}")
    print(f"🔍 COMPARING ALL SOURCES")
    print(f"{'='*60}")
    
    compare_script = Path(__file__).parent / "compare_ticket_sources.py"
    
    try:
        # For NICE, we know the UI count is 143
        if region == "NICE":
            result = subprocess.run([
                sys.executable, 
                str(compare_script), 
                region,
                "143"
            ], capture_output=True, text=True, timeout=60)
        else:
            result = subprocess.run([
                sys.executable, 
                str(compare_script), 
                region
            ], capture_output=True, text=True, timeout=60)
        
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(f"STDERR: {result.stderr}")
        
        comparison_success = result.returncode == 0
        results["compare_ticket_sources.py"] = comparison_success
        
        if comparison_success:
            print(f"✅ Comparison - PASSED")
        else:
            print(f"❌ Comparison - FAILED")
    
    except Exception as e:
        print(f"❌ Comparison - ERROR: {e}")
        results["compare_ticket_sources.py"] = False
    
    # Final summary
    print(f"\n{'='*60}")
    print(f"📋 VALIDATION SUMMARY")
    print(f"{'='*60}")
    
    total_steps = len(results)
    successful_steps = sum(results.values())
    
    print(f"Region: {region}")
    print(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Success rate: {successful_steps}/{total_steps} steps")
    
    print(f"\nStep Results:")
    for script, success in results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        script_name = script.replace(".py", "")
        print(f"  - {script_name}: {status}")
    
    # Recommendations
    print(f"\n💡 RECOMMENDATIONS:")
    if all(results.values()):
        print("🎉 All validations passed!")
        print("✅ Data is consistent across all sources")
        print("🚀 Safe to proceed with historical sync")
    else:
        print("⚠️  Some validations failed:")
        failed_steps = [script for script, success in results.items() if not success]
        
        if "get_ticket_types_from_event.py" in failed_steps:
            print("  - Check event endpoint access and permissions")
        if "get_purchased_tickets_summary.py" in failed_steps:
            print("  - Check tickets API pagination and rate limits")
        if "compare_ticket_sources.py" in failed_steps:
            print("  - Review data discrepancies in validation files")
        
        print("  - Run individual scripts for detailed debugging")
        print("  - Check .env configuration for API keys and event IDs")
    
    # File locations
    print(f"\n📁 VALIDATION FILES:")
    validation_dir = Path("validation")
    if validation_dir.exists():
        for file in validation_dir.glob(f"*{region}*"):
            print(f"  - {file}")
    
    print(f"\n{'='*60}")
    
    return all(results.values())

def main():
    if len(sys.argv) < 2:
        print("🎫 CHARITY TICKETS VALIDATION")
        print("\nUsage: python validate_charity_tickets.py <REGION>")
        print("\nExamples:")
        print("  python validate_charity_tickets.py NICE")
        print("  python validate_charity_tickets.py FRANKFURT")
        print("  python validate_charity_tickets.py PARIS")
        print("\nThis script will:")
        print("  1. Get ticket types from event endpoint")
        print("  2. Get purchased tickets summary")
        print("  3. Compare all sources for consistency")
        print("  4. Generate validation report")
        sys.exit(1)
    
    region = sys.argv[1].upper()
    
    # Ensure validation directory exists
    validation_dir = Path("validation")
    validation_dir.mkdir(exist_ok=True)
    
    print(f"🎯 Starting complete validation for {region}...")
    
    success = validate_charity_tickets(region)
    
    if success:
        print(f"\n🎉 VALIDATION SUCCESSFUL for {region}!")
        sys.exit(0)
    else:
        print(f"\n❌ VALIDATION FAILED for {region}!")
        sys.exit(1)

if __name__ == "__main__":
    main()