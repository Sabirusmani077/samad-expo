import os
import sys
import json
import time
from datetime import datetime, timezone
import requests

COMPOSIO_URL = "https://connect.composio.dev/mcp"
COMPOSIO_API_KEY = os.environ.get("COMPOSIO_API_KEY", "ck__T_ze5xVZbUYRsXeBeAl")
IG_USER_ID = os.environ.get("IG_USER_ID", "30117369684532329")
IG_ACCOUNT_SLUG = os.environ.get("IG_ACCOUNT_SLUG", "instagram_hurry-buri")
VIDEO_URL = os.environ.get("VIDEO_URL", "https://samad-expo.vercel.app/story_video.mp4")
FALLBACK_VIDEO_URL = "https://backend.composio.dev/api/v3/sl/P1t41K094e"
LOG_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "story_log.json")

def call_composio_mcp(tool_slug, arguments, call_id=1):
    headers = {
        "x-consumer-api-key": COMPOSIO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
    }
    payload = {
        "jsonrpc": "2.0",
        "id": call_id,
        "method": "tools/call",
        "params": {
            "name": "COMPOSIO_MULTI_EXECUTE_TOOL",
            "arguments": {
                "sync_response_to_workbench": False,
                "tools": [
                    {
                        "tool_slug": tool_slug,
                        "account": IG_ACCOUNT_SLUG,
                        "arguments": arguments
                    }
                ]
            }
        }
    }
    resp = requests.post(COMPOSIO_URL, json=payload, headers=headers, timeout=120)
    if resp.status_code != 200:
        raise Exception(f"Composio MCP HTTP Error {resp.status_code}: {resp.text}")
    
    # Parse SSE events
    for line in resp.text.splitlines():
        if line.startswith("data:"):
            raw_data = json.loads(line[5:].strip())
            content_str = raw_data.get("result", {}).get("content", [{}])[0].get("text", "{}")
            parsed_content = json.loads(content_str)
            tool_res = parsed_content.get("data", {}).get("results", [{}])[0].get("response", {})
            return tool_res
            
    raise Exception(f"Could not parse tool execution from response: {resp.text[:300]}")

def check_already_posted_today():
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, "r", encoding="utf-8") as f:
                logs = json.load(f)
                for entry in logs:
                    if entry.get("date") == today_str and entry.get("status") == "SUCCESS":
                        return True
        except Exception as e:
            print(f"Warning reading log file: {e}")
    return False

def record_log(entry):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    logs = []
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, "r", encoding="utf-8") as f:
                logs = json.load(f)
        except Exception:
            logs = []
    logs.append(entry)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(logs, f, indent=2)

def main():
    print(f"[{datetime.now()}] Starting 365-Day Instagram Story Autonomous Publisher...")
    
    # Check if already posted today
    if check_already_posted_today():
        print("Story already published for today! Skipping duplicate run.")
        return

    # 1. Test video URL accessibility, fallback if needed
    active_url = VIDEO_URL
    try:
        head_resp = requests.head(active_url, timeout=10)
        if head_resp.status_code != 200:
            print(f"Warning: Primary video URL returned {head_resp.status_code}. Using fallback CDN URL.")
            active_url = FALLBACK_VIDEO_URL
    except Exception:
        print("Using fallback permanent CDN video URL.")
        active_url = FALLBACK_VIDEO_URL

    print(f"Publishing Story using video URL: {active_url}")

    # 2. Create Story Container
    print("Step 1: Creating Instagram Story media container...")
    create_args = {
        "ig_user_id": IG_USER_ID,
        "media_type": "STORIES",
        "video_url": active_url
    }
    create_res = call_composio_mcp("INSTAGRAM_POST_IG_USER_MEDIA", create_args, call_id=101)
    if not create_res.get("successful"):
        raise Exception(f"Failed to create story container: {create_res}")
        
    container_id = create_res.get("data", {}).get("id")
    print(f"Container created successfully! ID: {container_id}")

    # 3. Publish Story Container (with status poll)
    print("Step 2: Publishing Story container...")
    publish_args = {
        "ig_user_id": IG_USER_ID,
        "creation_id": container_id,
        "max_wait_seconds": 120,
        "poll_interval_seconds": 3
    }
    
    pub_res = call_composio_mcp("INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH", publish_args, call_id=102)
    
    # If initial publish times out waiting for container, retry once after short delay
    if not pub_res.get("successful"):
        print("Container processing... Waiting 10 seconds before final publish retry...")
        time.sleep(10)
        pub_res = call_composio_mcp("INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH", publish_args, call_id=103)

    if not pub_res.get("successful"):
        err_msg = pub_res.get("error") or pub_res.get("data", {}).get("message")
        log_entry = {
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "FAILED",
            "error": str(err_msg)
        }
        record_log(log_entry)
        raise Exception(f"Failed to publish story: {err_msg}")

    story_id = pub_res.get("data", {}).get("id")
    print(f"🎉 Instagram Story Published Successfully! Live Story ID: {story_id}")

    # Record success log
    log_entry = {
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "SUCCESS",
        "story_id": story_id,
        "account": "@samad_expo_07",
        "video_url": active_url
    }
    record_log(log_entry)
    print("Logged to data/story_log.json successfully.")

if __name__ == "__main__":
    main()
