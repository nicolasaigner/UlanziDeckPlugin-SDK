# Samsung Monitor Control - UlanziDeck Plugin

<p align="start">
   <a href="./README.md">Português (BR)</a> | <strong>English</strong>
</p>

## Description

Plugin to control mute/unmute of your Samsung Monitor M5 (or other compatible models) directly from UlanziDeck, using the SmartThings API.

## Features

- ✅ Toggle Mute/Unmute with one click
- ✅ Visual indicator of state (muted/unmuted)
- ✅ Easy configuration via Property Inspector
- ✅ Real-time connection status
- ✅ SmartThings API support

## Setup

### 1. Get SmartThings Credentials

To use this plugin, you need:

1. **Device ID**: The ID of your Samsung device in SmartThings
2. **Personal Access Token (PAT)**: A personal access token from SmartThings

#### How to get Device ID:

1. Go to [SmartThings Web](https://my.smartthings.com/)
2. Log in with your Samsung account
3. Go to "Devices" and select your monitor
4. The Device ID will be in the URL or device settings

#### How to create a Personal Access Token:

1. Go to [SmartThings Personal Access Tokens](https://account.smartthings.com/tokens)
2. Click "Generate new token"
3. Name your token (e.g., "UlanziDeck")
4. Select required permissions:
   - ✅ `devices:read`
   - ✅ `devices:write`
   - ✅ `devices:execute`
5. Copy the generated token (keep it safe!)

### 2. Configure the Plugin

1. Drag the "Mute/Unmute" action to a UlanziDeck key
2. Click the key to open the Property Inspector
3. Paste the **Device ID** and **Personal Access Token**
4. Wait for status to change to "Connected"

## How to Use

- **Press the key**: Toggle between mute and unmute
- **Visual indicator**: 
  - 🔊 Icon without line = Sound enabled
  - 🔇 Icon with line = Sound muted

## Installation

### Prerequisites

- Node.js installed
- UlanziDeck installed and configured

### Install Dependencies

```bash
cd UlanziDeckSimulator/plugins/com.ulanzi.samsungmonitor.ulanziPlugin
npm install
```

### Run

```bash
npm start
```

## Project Structure

```
com.ulanzi.samsungmonitor.ulanziPlugin/
├── plugin/
│   ├── app.js                    # Main plugin file
│   └── actions/
│       ├── smartthings.js        # SmartThings API class
│       ├── mute.js               # Mute action class
│       └── plugin-common-node/   # Common Node.js library
├── property-inspector/
│   └── mute/
│       └── inspector.html        # Configuration interface
├── assets/
│   ├── icons/                    # Plugin icons
│   └── actions/
│       └── mute/                 # Mute action icons
├── libs/                         # Common HTML library
├── manifest.json                 # Plugin manifest
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

## Troubleshooting

### Plugin doesn't connect

1. Check if Device ID and Token are correct
2. Make sure your monitor is online in SmartThings
3. Check console logs for errors

### Mute doesn't work

1. Check if monitor supports mute command via SmartThings
2. Test manually in SmartThings app
3. Some monitors may use `audioVolume` instead of `audioMute` (plugin tries both)

### Connection error

- Check your internet connection
- Make sure token has correct permissions
- Token may have expired - generate a new one

## Development

This plugin was developed using:

- **plugin-common-node**: Library for communication with UlanziDeck (Node.js)
- **plugin-common-html**: Library for configuration interface (HTML)
- **axios**: For HTTP requests to SmartThings API

## License

MIT

## Author

Nicolas

## Support

For issues or questions, open an issue in the repository.

---

**Note**: This plugin is not officially affiliated with Samsung or Ulanzi.

