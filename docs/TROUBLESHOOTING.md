# 🔧 TROUBLESHOOTING GUIDE

**Common issues and solutions for Mythology Builder Platform**

---

## 🚨 AUTHENTICATION ISSUES

### **"I can't log in"**

**Possible Causes:**
1. Incorrect email or password
2. Account not yet verified
3. Session expired
4. Browser cache issue

**Solutions:**

**Step 1: Verify Email/Password**
- Check for typos (email is case-sensitive)
- Try copying/pasting from a document
- Check Caps Lock is off

**Step 2: Reset Password**
- Click **"Forgot Password"** on login page
- Check email for reset link (check spam folder)
- Create new password (min 8 characters)
- Try logging in again

**Step 3: Clear Browser Cache**
```
Chrome: Ctrl+Shift+Delete → Clear browsing data
Firefox: Ctrl+Shift+Delete → Clear Now
Safari: Cmd+Option+E
```

**Step 4: Try Different Browser**
- If Chrome doesn't work, try Firefox or Edge
- Sometimes browser extensions block login

**For Teachers:**
- Reset student password: Dashboard → Students → [Student] → "Reset Password"

---

### **"Email verification link expired"**

**Solution:**
1. Go to login page
2. Click **"Resend Verification Email"**
3. Check email (including spam folder)
4. Click new verification link within 24 hours

---

### **"Join code not working" (Students)**

**Possible Causes:**
1. Join code expired or deactivated
2. Typo in code (0 vs O, 1 vs I)
3. Already used

**Solutions:**
- Ask teacher for new join code
- Verify code exactly (case-sensitive)
- Teacher check: Dashboard → Classrooms → Verify code is active

---

## 🗄️ DATABASE / CONTENT ISSUES

### **"My mythology disappeared"**

**Possible Causes:**
1. Accidentally deleted
2. Viewing wrong account
3. Content hidden by visibility settings

**Solutions:**

**Step 1: Check Account**
- Verify logged into correct account
- Check email address in profile

**Step 2: Check Deleted Items**
- Dashboard → **"Trash"** (if feature exists)
- Items deleted within 30 days can be restored

**Step 3: Contact Teacher**
- Teachers can restore content from backups
- Provide mythology name and date created

---

### **"Character/creature won't save"**

**Possible Causes:**
1. Content moderation rejection
2. Missing required fields
3. Network connection issue
4. Server error

**Solutions:**

**Step 1: Check Error Message**
- Read error carefully
- Common errors:
  - "Name is required"
  - "Content violates guidelines" (see moderation)
  - "Network error"

**Step 2: Content Moderation**
If "Content violates guidelines":
- Remove inappropriate language
- Simplify violent descriptions ("defeated" not "brutally killed")
- Check [CONTENT_POLICY.md](./CONTENT_POLICY.md)
- Try saving again

**Step 3: Network Check**
- Verify internet connection
- Try refreshing page (F5)
- Copy content to clipboard (Ctrl+C) before refreshing

**Step 4: Try Again**
- Wait 30 seconds
- Try saving again
- If still fails, report to teacher

---

### **"Content keeps getting flagged"**

**Why:**
- AI moderation is cautious (sometimes over-flags mythology content)

**Solutions:**

**For Students:**
1. Review content for inappropriate language
2. Simplify violent descriptions
3. Ask teacher to manually review

**For Teachers:**
1. Dashboard → **"Flagged Content"**
2. Review student submission
3. If mythology-appropriate: Click **"Approve"**
4. If truly inappropriate: Click **"Reject"** with feedback

---

## 🖼️ IMAGE ISSUES

### **"Image upload failed"**

**Possible Causes:**
1. File too large (>10MB)
2. Wrong file format
3. Network issue

**Solutions:**

**Step 1: Check File Size**
- Right-click image → Properties → Check size
- If >10MB, compress image:
  - Use https://tinypng.com
  - OR resize in image editor

**Step 2: Check File Format**
- Supported: JPG, PNG, GIF, WEBP
- Not supported: BMP, TIFF, RAW
- Convert if needed (use free online converter)

**Step 3: Try Different Image**
- Test with small image (< 1MB)
- If works, original image has issue

---

### **"AI image generation not working"**

**Possible Causes:**
1. Daily limit reached (10 per day)
2. Prompt contains blocked terms
3. OpenAI API error
4. Feature disabled by teacher

**Solutions:**

**Step 1: Check Daily Limit**
- Profile → **"AI Usage"** → Check generations today
- If 10/10, wait until tomorrow (resets at midnight)

**Step 2: Check Prompt**
- Blocked terms: nude, naked, gore, blood, graphic
- Use mythology-appropriate terms: god, hero, warrior, monster

**Step 3: Simplify Prompt**
- Try shorter prompt: "Zeus, god of thunder, Greek style"
- Remove complex details
- Try different style preset

**Step 4: Check Teacher Settings**
- Teacher may have disabled AI generation
- Ask teacher to enable: Dashboard → Settings → AI Features

---

### **"Generated image is inappropriate"**

**Solution:**
1. Don't save it
2. Click **"Regenerate"** with different prompt
3. If keeps happening, report to teacher
4. Upload own image instead

---

## 🗺️ MAP / CANVAS ISSUES

### **"Map won't load / Canvas is blank"**

**Possible Causes:**
1. Browser compatibility
2. Canvas data corrupted
3. Slow internet

**Solutions:**

**Step 1: Check Browser**
- Maps use Konva.js (requires modern browser)
- Update browser to latest version
- Try different browser (Chrome recommended)

**Step 2: Refresh Page**
- Ctrl+F5 (hard refresh)
- Clear cache
- Try again

**Step 3: Start New Map**
- If old map corrupted, create new one
- Copy elements manually if needed

---

### **"Drawing tools not working"**

**Solutions:**
- Check mouse/trackpad is working
- Try different tool (pencil vs brush)
- Zoom out (map might be zoomed in)
- Restart browser

---

## 📝 STORY EDITOR ISSUES

### **"Rich text editor not loading"**

**Possible Causes:**
1. TipTap editor script blocked
2. Browser extension conflict
3. Slow connection

**Solutions:**

**Step 1: Disable Extensions**
- Ad blockers sometimes block editor
- Try incognito/private mode
- If works, disable extensions one by one

**Step 2: Check Console**
- F12 → Console tab
- Look for red errors
- Screenshot and send to teacher/support

---

### **"AI writing assist not working"**

**Solutions:**
- Check daily limit (20 requests per day)
- Simplify prompt
- Provide more context (paste previous paragraph)
- Try again in 30 seconds

---

## 🤝 COLLABORATION ISSUES

### **"Can't invite collaborator"**

**Possible Causes:**
1. Wrong email address
2. Student not in same classroom
3. Permissions issue

**Solutions:**
- Verify classmate's email address
- Ask them to check their email (including spam)
- Try different classmate
- Ask teacher to manually add collaborator

---

### **"Real-time editing not working"**

**Possible Causes:**
1. WebSocket connection blocked
2. Network firewall
3. Server issue

**Solutions:**

**Step 1: Refresh Page**
- Both students refresh (F5)
- Wait 10 seconds
- Try typing again

**Step 2: Check Connection**
- Look for "Connected" indicator
- If "Disconnected," refresh page

**Step 3: Check Network**
- School network may block WebSockets
- Try at home or ask IT admin

---

### **"Chat messages not sending"**

**Solutions:**
- Verify internet connection
- Refresh page
- Check message length (<1000 characters)
- Try again in 30 seconds

---

## 🎮 GAMIFICATION ISSUES

### **"Points not updating"**

**Possible Causes:**
1. Delay in calculation
2. Cache issue
3. Database sync issue

**Solutions:**

**Step 1: Wait & Refresh**
- Points update every 30 seconds
- Refresh page (F5)
- Check again

**Step 2: Check Point Log**
- Profile → **"Points History"**
- Verify recent actions logged

**Step 3: Report to Teacher**
- If points clearly wrong, teacher can manually adjust

---

### **"Badge not unlocking"**

**Possible Causes:**
1. Didn't meet requirements
2. Progress tracker not updated
3. Already unlocked (check "Earned" tab)

**Solutions:**

**Step 1: Check Requirements**
- Badges → [Badge] → View requirements
- Example: "Epic Worldbuilder" = 10 characters (check you have 10)

**Step 2: Verify Progress**
- Profile → **"Badges"** → Check progress bar
- May need one more action to unlock

**Step 3: Wait**
- Badge calculation runs every 5 minutes
- Refresh in 5 minutes

---

## 🎓 PRESENTATION ISSUES

### **"Presentation won't generate"**

**Possible Causes:**
1. No content selected
2. Missing narration
3. Server error

**Solutions:**

**Step 1: Select Content**
- Need at least 1 character OR 1 creature OR 1 story
- Check boxes for content to include

**Step 2: Verify Content Exists**
- Ensure selected characters/creatures exist
- Check they have descriptions

**Step 3: Try Again**
- Wait 30 seconds
- Click **"Generate"** again

---

### **"TTS narration not playing"**

**Possible Causes:**
1. Browser doesn't support Web Speech API
2. Audio blocked
3. Volume muted

**Solutions:**

**Step 1: Check Browser**
- Chrome, Edge, Safari support TTS
- Firefox has limited support

**Step 2: Check Audio**
- Verify computer volume not muted
- Check browser site permissions (allow audio)

**Step 3: Try Different Voice**
- Presentation → Settings → Change voice
- Try different voice option

---

### **"Export to PowerPoint failed"**

**Possible Causes:**
1. Too many slides (>50)
2. Large images
3. Network timeout

**Solutions:**

**Step 1: Reduce Content**
- Try exporting fewer slides
- Remove some characters/creatures

**Step 2: Compress Images**
- Large images slow export
- Use AI-generated images (optimized)

**Step 3: Try PDF Instead**
- PDF export faster than PowerPoint
- Can convert PDF → PowerPoint later

---

## 🌐 BROWSER / NETWORK ISSUES

### **"Site won't load / Blank page"**

**Solutions:**

**Step 1: Basic Troubleshooting**
```
1. Refresh page (F5 or Ctrl+F5)
2. Clear browser cache
3. Try different browser
4. Restart computer
```

**Step 2: Check Network**
```
1. Verify internet connection
2. Try different website (google.com)
3. If school network: Ask IT
4. Try at home
```

**Step 3: Check Server Status**
- Visit status.mythologybuilder.com
- If "All Systems Operational," issue is local

---

### **"Very slow / Laggy"**

**Solutions:**

**Step 1: Close Other Tabs**
- Browser uses memory
- Close unnecessary tabs
- Restart browser

**Step 2: Check Extensions**
- Disable ad blockers temporarily
- Disable video downloaders

**Step 3: Check Device**
- Close other applications
- Check RAM usage (Task Manager)
- Restart computer

---

## 👨‍🏫 TEACHER-SPECIFIC ISSUES

### **"Can't see student work"**

**Solutions:**
- Verify student published (not draft)
- Check visibility settings
- Use impersonation to see student view
- Ask student to share mythology ID

---

### **"Grading queue empty but students submitted"**

**Solutions:**
- Refresh page
- Check filters (showing "all" not just "pending")
- Verify students clicked "Submit" not just "Save"

---

### **"Impersonation not working"**

**Solutions:**
- Verify student account exists
- Try different student
- Log out and log back in
- Clear browser cache

---

## 🆘 EMERGENCY PROCEDURES

### **"Lost all my work!"**

**DO NOT PANIC. Solutions:**

1. **Check Trash/Deleted Items**
2. **Check Other Account** (logged into wrong email?)
3. **Check Drafts** (maybe wasn't published)
4. **Contact Teacher IMMEDIATELY**
   - Teachers can restore from backups
   - Backups run daily
   - Can restore content from up to 7 days ago

---

### **"Site is completely broken"**

**Escalation Path:**

1. **Try basic troubleshooting** (refresh, different browser)
2. **Check with classmates** (is it just you?)
3. **Report to teacher**
4. **Teacher contacts support:** support@mythologybuilder.com

**Include in report:**
- What were you doing when it broke?
- Error message (screenshot)
- Browser + version
- Device (Chromebook, Windows, Mac, iPad)

---

## 📞 SUPPORT CONTACTS

### **For Students:**
1. Ask your teacher first
2. Check this troubleshooting guide
3. Ask classmate

### **For Teachers:**
- **Email:** support@mythologybuilder.com
- **Phone:** (555) 123-4567 (Mon-Fri 8am-5pm EST)
- **Docs:** mythologybuilder.com/docs

### **Response Times:**
- Critical issues (site down): 1 hour
- High priority (can't log in): 4 hours
- Normal issues: 24 hours
- Feature requests: 1 week

---

## 📊 ERROR CODES REFERENCE

| Code | Meaning | Solution |
|------|---------|----------|
| **401** | Not authenticated | Log in again |
| **403** | No permission | Check you own this content |
| **404** | Not found | Content deleted or wrong ID |
| **429** | Rate limit | Wait and try again |
| **500** | Server error | Try again in 5 min, report if persists |

---

**Still stuck? Contact support with:**
1. Screenshot of error
2. What you were trying to do
3. Browser + device info
4. Your account email

---

*Troubleshooting guide complete* ✅
