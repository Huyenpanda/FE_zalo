# 🎨 ZALO CHAT INTERFACE - VISUAL REFERENCE GUIDE

## Desktop Layout (1200px+)

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER WINDOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┬───────────────────────────────────────┐   │
│  │                  │                                       │   │
│  │   SIDEBAR        │         CHAT WINDOW                  │   │
│  │   (360px)        │        (Flexible Width)              │   │
│  │                  │                                       │   │
│  │  ┌────────────┐  │  ┌─────────────────────────────────┐ │   │
│  │  │   HEADER   │  │  │     CHAT HEADER                 │ │   │
│  │  │            │  │  │  [Avatar] John Doe              │ │   │
│  │  │  Chat      │  │  │  Online • [Call] [Video] [Info] │ │   │
│  │  │  [+] [≡]   │  │  └─────────────────────────────────┘ │   │
│  │  └────────────┘  │                                       │   │
│  │                  │  ┌─────────────────────────────────┐ │   │
│  │  ┌────────────┐  │  │                                 │ │   │
│  │  │   SEARCH   │  │  │  Messages Container             │ │   │
│  │  │  [🔍 Type] │  │  │                                 │ │   │
│  │  └────────────┘  │  │  ┌─────────────────┐            │ │   │
│  │                  │  │  │ Received        │            │ │   │
│  │ Conversations    │  │  │ Hi there!       │            │ │   │
│  │ List:            │  │  └─────────────────┘            │ │   │
│  │                  │  │           ┌──────────┐          │ │   │
│  │ [Avatar] Jane    │  │           │  Sent    │          │ │   │
│  │ Last msg... ◄---→│  │           │  Hello!  │          │ │   │
│  │           10:30  │  │           └──────────┘          │ │   │
│  │                  │  │  ┌─────────────────┐            │ │   │
│  │ [Avatar] Mike    │  │  │ Received        │            │ │   │
│  │ Last msg... ◄---→│  │  │ How are you?    │            │ │   │
│  │ [2]       09:15  │  │  └─────────────────┘            │ │   │
│  │                  │  │                                 │ │   │
│  │ [Avatar] Team    │  │ ...more messages...             │ │   │
│  │ Last msg... ◄---→│  │                                 │ │   │
│  │           Yest.  │  │                                 │ │   │
│  │                  │  └─────────────────────────────────┘ │   │
│  │ ...more...       │                                       │   │
│  │                  │  ┌─────────────────────────────────┐ │   │
│  │                  │  │        INPUT BOX                │ │   │
│  │                  │  │ [+] [Aa....... 😊 ] [Send ➤]   │ │   │
│  │                  │  │                                 │ │   │
│  │                  │  └─────────────────────────────────┘ │   │
│  │                  │                                       │   │
│  └──────────────────┴───────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mobile Layout (<768px)

```
┌─────────────────────────────────────┐
│     BROWSER WINDOW (MOBILE)         │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  HEADER / SIDEBAR TABS      │   │
│  │  Chat [≡] Calls Profile     │   │
│  └─────────────────────────────┘   │
│                                     │
│  CONVERSATIONS LIST:                │
│  ┌─────────────────────────────┐   │
│  │ [Search box]                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Avatar] Jane Doe           │   │
│  │ Last message... 10:30       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Avatar] Mike [2]           │   │
│  │ Last message... 09:15       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Avatar] Team Group         │   │
│  │ Last message... Yesterday   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ...more conversations...           │
│                                     │
│  Or when conversation selected:     │
│  ┌─────────────────────────────┐   │
│  │ ◄ John Doe                  │   │
│  │ Online                      │   │
│  └─────────────────────────────┘   │
│  Messages: (full screen)            │
│  ┌─────────────────────────────┐   │
│  │ Received message            │   │
│  └─────────────────────────────┘   │
│           ┌──────────────────────┐ │
│           │ Sent message         │ │
│           └──────────────────────┘ │
│  ┌─────────────────────────────┐   │
│  │ Input [+] [😊] [Send]       │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## Message Bubble Styles

### Sent Message (Blue)
```
┌──────────────────────────────────┐
│                    ┌────────────┐ │
│                    │ This is a  │ │
│                    │ sent msg   │ │
│                    │ 10:30      │ │
│                    └────────────┘ │
└──────────────────────────────────┘
```

### Received Message (Gray)
```
┌──────────────────────────────────┐
│ ┌────────────┐                    │
│ │ [Avatar]   │ This is a         │
│ │            │ received message   │
│ │            │ 10:25             │
│ └────────────┘                    │
└──────────────────────────────────┘
```

---

## Component Visual Hierarchy

```
CHAT APPLICATION
├── SIDEBAR
│   ├── Header Section
│   │   ├── "Chat" Title (32px)
│   │   ├── [+] Add Button
│   │   └── [≡] More Options
│   │
│   ├── Search Section
│   │   └── [🔍] Search Input (rounded, 20px radius)
│   │
│   └── Conversations List
│       ├── Conversation Item
│       │   ├── [Avatar] (56px circle)
│       │   │   └── Online Indicator (green dot)
│       │   ├── Info Section
│       │   │   ├── Name (15px bold)
│       │   │   └── Last Message Preview (13px)
│       │   ├── Timestamp (13px, right)
│       │   └── Unread Badge (blue badge)
│       │
│       └── ... (more conversations)
│
└── CHAT WINDOW
    ├── Chat Header
    │   ├── Left Section
    │   │   ├── [Avatar] (48px)
    │   │   └── Info
    │   │       ├── Name (16px bold)
    │   │       └── Status (13px)
    │   └── Right Section
    │       ├── [☎️] Call Button
    │       ├── [📹] Video Button
    │       └── [ℹ️] Info Button
    │
    ├── Messages Container
    │   ├── Message Group
    │   │   ├── Sent Message (Right)
    │   │   │   ├── Blue Bubble (#0068ff)
    │   │   │   ├── Text (15px white)
    │   │   │   ├── Timestamp (12px, transparent)
    │   │   │   └── Border-radius: 18px 4px 18px 18px
    │   │   │
    │   │   └── Received Message (Left)
    │   │       ├── [Avatar]
    │   │       ├── Gray Bubble (#e5e5e5)
    │   │       ├── Text (15px black)
    │   │       ├── Timestamp (12px, transparent)
    │   │       └── Border-radius: 4px 18px 18px 18px
    │   │
    │   └── ... (more messages)
    │
    └── Input Box
        ├── [+] Attach File Button
        ├── Textarea Input
        │   ├── Placeholder: "Aa"
        │   ├── Multi-line support
        │   ├── Auto-resize
        │   └── Focus border: #0068ff
        ├── [😊] Emoji Button
        └── [→] Send Button
            ├── Enabled (blue)
            └── Disabled (gray)
```

---

## Color Palette Visualization

```
Primary Colors:
┌─────────────┬─────────────┬─────────────┐
│ #0068FF     │ #0052CC     │ #E8F0FF     │
│ Zalo Blue   │ Darker Blue │ Light Blue  │
│ (Primary)   │ (Hover)     │ (Background)│
└─────────────┴─────────────┴─────────────┘

Text Colors:
┌─────────────┬─────────────┬─────────────┐
│ #000000     │ #666666     │ #999999     │
│ Black       │ Dark Gray   │ Light Gray  │
│ (Primary)   │ (Secondary) │ (Tertiary)  │
└─────────────┴─────────────┴─────────────┘

Background Colors:
┌─────────────┬─────────────┬─────────────┐
│ #FFFFFF     │ #F0F0F0     │ #F9F9F9     │
│ White       │ Light Gray  │ Very Light  │
│ (Main BG)   │ (Input BG)  │ (Subtle BG) │
└─────────────┴─────────────┴─────────────┘

Status Colors:
┌─────────────┬─────────────┐
│ #31A24C     │ #F33        │
│ Green       │ Red         │
│ (Online)    │ (Error)     │
└─────────────┴─────────────┘
```

---

## Button Styles

### Primary Buttons
```
Default:
┌──────────────┐
│  [Button]    │  Background: #0068ff
│              │  Color: white
└──────────────┘

Hover:
┌──────────────┐
│  [Button]    │  Background: #0052cc
│              │  Shadow: 0 4px 12px rgba(0, 104, 255, 0.2)
└──────────────┘

Active:
┌──────────────┐
│  [Button]    │  Scale: 0.98
│              │  Background: #0052cc
└──────────────┘
```

### Icon Buttons
```
Default:
┌────┐
│ +  │  Background: transparent
│    │  Color: #0068ff
└────┘

Hover:
┌────┐
│ +  │  Background: #f0f0f0
│    │  Color: #0068ff
└────┘
```

---

## Input Field Styles

### Search Input
```
Default:
┌─────────────────────────────┐
│ 🔍 Search                   │  Background: #f0f0f0
│                             │  Border: 1px #e5e5e5
└─────────────────────────────┘  Border-radius: 20px

Focused:
┌─────────────────────────────┐
│ 🔍 Search                   │  Background: #ffffff
│                             │  Border: 2px #0068ff
└─────────────────────────────┘  Border-radius: 20px
```

### Message Input
```
Default:
┌──────────────────────────────────┐
│ [+]   Type message... 😊  [Send] │  Background: #f0f0f0
│                                  │  Border-radius: 24px
└──────────────────────────────────┘

Focused:
┌──────────────────────────────────┐
│ [+]   Type message... 😊  [Send] │  Background: #ffffff
│                                  │  Border: 2px #0068ff
└──────────────────────────────────┘  Border-radius: 24px
```

---

## Spacing System

```
Component Padding:
16px ─────────────────────────────────────────────
     ┌──────────────────────────────────────────┐
     │                                          │
     │     Component Content                    │ 16px
     │                                          │
     └──────────────────────────────────────────┘
16px

Gap Between Elements:
     ┌──────────┐
     │ Element  │
     │          │ 12px gap
     ┌──────────┐
     │ Element  │
     │          │
     └──────────┘

Compact Spacing:
┌──────────────────────────────────────────────┐
│ Item 1                    │ Item 2          │ 8px gap
│                          │                  │
│ Item 3                    │ Item 4          │
└──────────────────────────────────────────────┘
```

---

## Typography Sizes

```
32px ┌─────────────────────────────────────────┐
     │ Sidebar Title - "Chat"                  │
     └─────────────────────────────────────────┘

18px ┌─────────────────────────────────────────┐
     │ Large Heading - Group Titles            │
     └─────────────────────────────────────────┘

16px ┌─────────────────────────────────────────┐
     │ Chat Header - Contact Name              │
     └─────────────────────────────────────────┘

15px ┌─────────────────────────────────────────┐
     │ Body Text - Message content             │
     └─────────────────────────────────────────┘

14px ┌─────────────────────────────────────────┐
     │ Secondary Text - Conversation preview   │
     └─────────────────────────────────────────┘

13px ┌─────────────────────────────────────────┐
     │ Small Text - Timestamps, Status         │
     └─────────────────────────────────────────┘

12px ┌─────────────────────────────────────────┐
     │ Mini Text - Badge numbers               │
     └─────────────────────────────────────────┘
```

---

## Animation Examples

### Message Slide In
```
Before:        During:          After:
[Hidden]   → [Sliding in] → [Visible]
 0s          0.15s            0.3s
 
Opacity:   0 → 100%
Position:  +10px ↓ → 0px (normal)
```

### Button Hover
```
Before:        During:          After:
[Button]   → [Expanding] → [Hovered]
            
Scale:     1 → 1.05 → 1.05
Shadow:    0 → fade in → visible
```

### Input Focus
```
Before:        During:          After:
[Input]    → [Expanding] → [Focused]
            
Border:    gray → blue → blue
BG Color:  light gray → white
Shadow:    none → glow → glow
```

---

## Responsive Breakpoints Visualization

```
Extra Small          Small            Medium           Large            Extra Large
(<480px)           (480-768px)      (768-1024px)    (1024-1200px)      (1200px+)
┌─────────┐  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐  ┌────────────────────┐
│Compact  │  │ Optimized    │  │ Tablet View    │  │ Desktop View     │  │ Full Desktop       │
│Layout   │  │ Mobile       │  │ Adjusted       │  │ with            │  │ Sidebar:360px      │
│         │  │ Layout       │  │ Sidebar:320px  │  │ Sidebar:340px    │  │ Full Features      │
│Single   │  │ Full Stack   │  │ Full Layout    │  │ Full Features    │  │ Max Optimization   │
│Column   │  │ Font: 12px   │  │ Font: 14px     │  │ Font: 14px       │  │ Font: 15px         │
│Font:11px│  │ Padding:12px │  │ Padding: 14px  │  │ Padding: 15px    │  │ Padding: 16px      │
│Padding: │  │ Gap: 10px    │  │ Gap: 12px      │  │ Gap: 12px        │  │ Gap: 12px          │
│8px      │  │              │  │                │  │                  │  │                    │
└─────────┘  └──────────────┘  └────────────────┘  └──────────────────┘  └────────────────────┘
```

---

## Loading & Empty States

### Empty Conversations
```
┌─────────────────────────────────────┐
│                                     │
│             💬                      │
│                                     │
│    No conversations found           │
│  Start a conversation now!          │
│                                     │
└─────────────────────────────────────┘
```

### Empty Messages
```
┌─────────────────────────────────────┐
│                                     │
│             💬                      │
│                                     │
│   Hãy chọn một cuộc trò chuyện     │
│  Bắt đầu trò chuyện với bạn bè     │
│                                     │
└─────────────────────────────────────┘
```

---

## Accessibility Features

### Focus Indicators
```
Visible Focus Ring:
┌──────────────────────────┐
│┌──────────────────────────┐│
││ Focused Element          ││  Blue outline (#0068ff)
│└──────────────────────────┘│  2px width
└──────────────────────────┘  2px offset
```

### High Contrast Colors
```
Text on Backgrounds:
┌─────────────────────────────────────┐
│ Black (#000000) on White (#ffffff)  │  21:1 Contrast
│ 100% WCAG AAA Compliant             │
├─────────────────────────────────────┤
│ Blue (#0068ff) on White (#ffffff)   │  4.6:1 Contrast
│ WCAG AA Compliant                   │
├─────────────────────────────────────┤
│ Gray (#666666) on White (#ffffff)   │  7.5:1 Contrast
│ 100% WCAG AAA Compliant             │
└─────────────────────────────────────┘
```

---

## Dark Mode Support (Future)

```
Light Mode:
┌────────────────────┐
│ Background: White  │  Text: Black
│ Accent: Blue       │  Secondary: Gray
└────────────────────┘

Dark Mode:
┌────────────────────┐
│ Background: Dark   │  Text: White
│ Accent: Light Blue │  Secondary: Light Gray
└────────────────────┘

Automatic Switching:
Based on system preferences or user selection
```

---

## File Upload Preview (Future)

```
Before:
┌───────────────────────┐
│ [+] Add File          │
└───────────────────────┘

After:
┌───────────────────────┐
│ [Image Preview] 50%   │  Upload in progress
│ ████████░░░░░░░░░░░░ │
└───────────────────────┘

Complete:
┌───────────────────────┐
│ [✓] Image Sent        │  
│ image.jpg - 2.5 MB    │
└───────────────────────┘
```

---

## Menu/Dropdown Styling (Future)

```
┌──────────────────┐
│ ≡ (More Options) │
└──────┬───────────┘
       │
       ▼
    ┌─────────────────┐
    │ ✎ Edit          │
    │ 📌 Pin          │
    │ 🔔 Mute         │
    │ 🗑️ Delete       │
    │ ⋮ More         │
    └─────────────────┘
```

---

## Summary

This visual reference guide covers:
- ✅ Desktop & mobile layouts
- ✅ Component hierarchies
- ✅ Color specifications
- ✅ Typography sizes
- ✅ Spacing system
- ✅ Button & input styles
- ✅ Animation patterns
- ✅ Responsive breakpoints
- ✅ Accessibility features
- ✅ Empty states
- ✅ Future features mockups

Use this guide as reference when customizing or extending the interface.

---

**Happy Designing! 🎨**
