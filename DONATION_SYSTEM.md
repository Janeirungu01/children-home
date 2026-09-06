# Brighter Together Foundation - M-PESA Donation System

## Overview

A complete M-PESA STK Push donation system integrated into the Brighter Together Foundation website. Donors can contribute directly from the website with real-time payment tracking and notifications.

## Features

### 1. M-PESA STK Push Integration
- **Instant Payment Prompts**: Users receive M-PESA payment prompts directly on their phones
- **Amount Selection**: Preset amounts (KES 500, 1000, 2500, 5000, 10,000) + custom amounts
- **Phone Validation**: Automatic formatting and validation of Kenyan phone numbers
- **Secure Processing**: Direct integration with Safaricom M-PESA API

### 2. Real-Time Status Tracking
- **Live Updates**: Payment status polled every 5 seconds
- **Floating Tracker**: Minimizable widget showing current payment progress
- **Status States**: Pending → Completed/Failed/Timeout

### 3. Notification System
- **Toast Notifications**: Non-intrusive alerts for all payment events
- **Payment-Specific Messages**: Custom notifications for M-PESA flow
- **Auto-Dismiss**: Notifications automatically clear after display

### 4. Donation History
- **Persistent Storage**: Donations saved to localStorage (last 50)
- **Status Indicators**: Visual badges for Completed/Pending/Failed
- **Transaction References**: Unique IDs for each donation

### 5. State Management
- **React Context**: Centralized state for auth, donations, notifications, UI
- **Custom Hooks**: `useDonation`, `useNotification`, `usePersistDonations`
- **Type-Safe Actions**: Defined action types for all state changes

## Technical Architecture

```
src/
├── context/
│   └── AppContext.jsx       # Global state provider
├── hooks/
│   ├── useDonation.js       # Donation processing logic
│   ├── useNotification.js   # Notification actions
│   └── usePersistDonations.js # LocalStorage persistence
├── services/
│   └── paymentService.js    # M-PESA API integration
├── components/
│   ├── DonationModal.jsx    # Main donation form
│   ├── DonationTracker.jsx  # Floating status widget
│   ├── DonationHistory.jsx  # Past donations list
│   └── Notifications.jsx    # Toast notifications
```

## API Integration

### Payment Service Endpoints
```javascript
POST /payments/management/mpesa/stk-push     // Initiate STK Push
POST /payments/management/mpesa/stk-query    // Query payment status
GET  /payments/management/transaction/:ref   // Get transaction details
GET  /payments/management/donations          // Get donation history
```

### Environment Variables
```env
VITE_API_URL=http://localhost:8080
VITE_PAYMENT_API_URL=http://localhost:9094
```

## User Flow

1. **Click "Donate Now"** → Opens donation modal
2. **Select/Enter Amount** → Choose preset or custom amount
3. **Enter Phone Number** → +254 format with validation
4. **Optional: Name & Message** → For donor recognition
5. **Click "Pay via M-PESA"** → Initiates STK Push
6. **Check Phone** → Enter M-PESA PIN on phone
7. **Real-Time Tracking** → Floating tracker shows progress
8. **Completion** → Success notification + history updated

## Donation Amounts Guide
- **KES 500** - Meals for a child for 1 week
- **KES 2,500** - School supplies for a term
- **KES 10,000** - Education support for 1 month

## Security Features
- Phone number masking in history
- No sensitive data stored client-side
- Secure API communication
- Input validation and sanitization

## Future Enhancements
- Email receipts for donations
- Recurring donation subscriptions
- Donor leaderboard
- Impact reports per donation
- Multiple payment methods (Card, PayPal)

---

**Ready for Production**: The system is built, tested, and ready for deployment with your payment service backend.
