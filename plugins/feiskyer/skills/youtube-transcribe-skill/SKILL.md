---
name: youtube-transcribe-skill
description: Extract subtitles/transcripts from YouTube videos. Triggers: "youtube transcript", "extract subtitles", "video captions", "视频字幕", "字幕提取", "YouTube转文字", "提取字幕".
allowed-tools: Read, Write, Glob, Grep, Task, Bash(cat:*), Bash(ls:*), Bash(tree:*), Bash(yt-dlp:*), Bash(which:*), mcp__plugin_superpowers-chrome_chrome__use_browser
---

# YouTube Transcript Extraction

Extract subtitles/transcripts from a YouTube video URL and save them as a local file.

Input YouTube URL: $ARGUMENTS

## Step 1: Verify URL and Get Video Information

1. **Verify URL Format**: Confirm the input is a valid YouTube URL (supports `youtube.com/watch?v=` or `youtu.be/` formats).

2. **Get Video Information**: Use WebFetch or firecrawl to fetch the page and extract the video title for subsequent file naming.

## Step 2: CLI Quick Extraction (Priority Attempt)

Use command-line tools to quickly extract subtitles.

1. **Check Tool Availability**:
   Execute `which yt-dlp`.

   - If `yt-dlp` is **found**, proceed to subtitle download.
   - If `yt-dlp` is **NOT found**, skip immediately to **Step 3**.

2. **Execute Subtitle Download** (Only if `yt-dlp` is found):

   - **Tip**: Always add `--cookies-from-browser` to avoid sign-in restrictions. Default to `chrome`.
   - **Retry Logic**: If `yt-dlp` fails with a browser error (e.g., "Could not open Chrome"), ask the user to specify their available browser (e.g., `firefox`, `safari`, `edge`) and retry.

   ```bash
   # Get the title first (try chrome first)
   yt-dlp --cookies-from-browser=chrome --get-title "[VIDEO_URL]"

   # Download subtitles
   yt-dlp --cookies-from-browser=chrome --write-auto-sub --write-sub --sub-lang zh-Hans,zh-Hant,en --skip-download --output "<Video Title>.%(ext)s" "[VIDEO_URL]"
   ```

3. **Verify Results**:
   - Check the command exit code.
   - **Exit code 0 (Success)**: Subtitles have been saved locally, task complete.
   - **Exit code non-0 (Failure)**:
     - If error is related to browser/cookies, ask user for correct browser and retry Step 2.
     - If other errors (e.g., video unavailable), proceed to **Step 3**.

## Step 3: Browser Automation (Fallback)

When the CLI method fails or `yt-dlp` is missing, use `superpowers-chrome` browser automation to extract subtitles.

### 3.1 Check Tool Availability

- Check if `use_browser` MCP tool is available (`mcp__plugin_superpowers-chrome_chrome__use_browser`).
- **CRITICAL CHECK**: If `use_browser` is **NOT** available AND `yt-dlp` was **NOT** found in Step 2:
  - **STOP** execution.
  - **Notify the User**: "Unable to proceed. Please either install `yt-dlp` (for fast CLI extraction) OR enable `superpowers-chrome` plugin (for browser automation)."

### 3.2 Navigate to Video Page

Use `use_browser` with `navigate` action to open the video URL:

```json
{
  "action": "navigate",
  "payload": "[VIDEO_URL]"
}
```

Then wait for page to load:

```json
{
  "action": "await_element",
  "selector": "#description",
  "timeout": 10000
}
```

### 3.3 Expand Video Description

_Reason: The "Show transcript" button is usually hidden within the collapsed description area._

1. Click the "...more" / "...更多" / "Show more" button to expand description:

```json
{
  "action": "click",
  "selector": "tp-yt-paper-button#expand"
}
```

Or use the alternative selector:

```json
{
  "action": "click",
  "selector": "#description-inline-expander #expand"
}
```

2. Wait for expansion:

```json
{
  "action": "await_element",
  "selector": "ytd-video-description-transcript-section-renderer",
  "timeout": 5000
}
```

### 3.4 Open Transcript Panel

1. Click the "Show transcript" / "显示转录稿" / "内容转文字" button:

```json
{
  "action": "click",
  "selector": "ytd-video-description-transcript-section-renderer button"
}
```

2. Wait for transcript panel to load:

```json
{
  "action": "await_element",
  "selector": "ytd-transcript-segment-renderer",
  "timeout": 10000
}
```

### 3.5 Extract Content via DOM

_Reason: Directly reading the accessibility tree for long lists is slow and consumes many tokens; DOM injection is more efficient._

Use `eval` action to execute JavaScript and extract transcript:

```json
{
  "action": "eval",
  "payload": "(() => { const segments = document.querySelectorAll('ytd-transcript-segment-renderer'); if (!segments.length) return 'BUFFERING'; return Array.from(segments).map(seg => { const time = seg.querySelector('.segment-timestamp')?.innerText.trim(); const text = seg.querySelector('.segment-text')?.innerText.trim(); return `${time} ${text}`; }).join('\\n'); })()"
}
```

If it returns `"BUFFERING"`, wait 2-3 seconds and retry.

### 3.6 Save and Cleanup

1. Use the Write tool to save the extracted text as a local file (e.g., `<Video Title>.txt`).

2. Close the browser tab to release resources:

```json
{
  "action": "close_tab"
}
```

## Output Requirements

- Save the subtitle file to the current working directory.
- Filename format: `<Video Title>.txt`
- File content format: Each line should be `Timestamp Subtitle Text`.
- Report upon completion: File path, subtitle language, total number of lines.
