# Tsunami App Roadmap

This document captures feature ideas and enhancements for future development. These are not yet implemented but provide context for future coding sessions.

---

## News Interests / Personalization

**Status:** To Build  
**Priority:** High  

### Overview
Allow users to personalize their news feed by selecting topics, coins, and sources they care about. The news feed will filter content based on these preferences.

### User Flow

#### Onboarding (First-time setup)
- Triggered on first visit to News tab
- **MUST BE THE SHORTEST ONBOARDING EVER** - minimal steps, fast completion
- Chip/tag selection UI for interests (large, easy to tap)
- **Large, easy-to-hit Skip button** - never trap the user
- Can be revisited later via filter button

#### Ongoing Usage
- Filter button on News screen (top right of "Latest News" header)
- Bottom sheet modal with chip selection
- Tap to quickly toggle interests on/off
- Remember last filter state
- Visual indicator when filter is active

### Interest Types

| Type | Examples |
|------|----------|
| **Coins** | Bitcoin, Ethereum, Solana, Cardano, etc. |
| **Categories** | DeFi, NFTs, Regulation, Markets, Technology, Mining |
| **Sources** | CoinDesk, The Block, Decrypt, CoinTelegraph, Bloomberg Crypto |

### Behavior
- **Filter mode**: Only show articles matching selected interests
- Future: Could add "Prioritize" mode (interests first, then others)

### Data Storage
- **Phase 1**: Local storage (AsyncStorage) - no account required
- **Phase 2**: Sync to user account when authentication is implemented

### UI/UX Considerations
- Chip/tag selection UI for interests
- Visual indicator when filter is active (badge or filled icon)
- Empty state if no articles match filter
- "Clear filters" quick action

---

## Watchlist / Curated Lists System

**Status:** Idea  
**Priority:** High  

### Overview
Allow users to create and manage curated lists of coins they want to track. Multiple lists supported with aggregated metrics for each list.

### Ways to Add Coins to a List

| Method | Location | Action |
|--------|----------|--------|
| Star icon | Coin Detail screen | Tap star to add/remove |
| Swipe right | Coin list row | Swipe to star/add to list |
| Swipe left | Coin list row | Swipe to remove from list |

### List Management
- **Multiple lists** supported
- **Choose default list** to add to when starring
- **Create new lists** with custom names
- **Edit/rename/delete** lists
- **First two lists mocked up** and editable for MVP

### List Metrics (Header Card)
Each list displays aggregated metrics in a header card at the top:

| Metric | Description |
|--------|-------------|
| Total Market Cap | Sum of all coins in list |
| Total 24h Volume | Combined trading volume |
| Average 24h Change % | Average performance of list |
| Number of Coins | Count of coins in list |

### List View
- **Same row format as main Coins list** - maintains quick glance feel
- Mini chart on each row
- Key data points visible (price, 24h change, etc.)
- Consistent UX across app

### Default Lists (MVP)
1. "Favorites" - Primary watchlist
2. "Watching" - Secondary list for coins of interest

### Data Storage
- **Phase 1**: Local storage (AsyncStorage)
- **Phase 2**: Sync to user account

---

## Portfolio / Wallet Connection

**Status:** UI Placeholder Built  
**Priority:** High  

### Overview
Allow users to connect Bitcoin hot wallets or cold wallets to track their holdings and gains.

### Planned Features
- QR code scanning for wallet connection
- Support for hot wallets and cold wallets
- Portfolio value tracking
- Gains/losses visualization

### Current State
- UI placeholder with "Connect Wallet" button exists
- Button logs to console (non-functional)

---

## News Card Images

**Status:** Deferred  
**Priority:** Low  

### Overview
Add images to news cards for a richer Apple News / Google News style experience.

### Implementation Notes
- Unsplash URLs confirmed working
- NewsCard component ready to accept `image` prop
- Consider lazy loading for performance

---

## Future Ideas

_Add new ideas below as they come up_

- [ ] Push notifications for price alerts
- [ ] Social sharing of portfolio gains
- [ ] Dark/Light mode schedule (auto-switch)
- [ ] Widget support (iOS/Android home screen)
- [ ] Price alerts and notifications
- [ ] News article full-screen reader view

---

*Last updated: December 2025*
