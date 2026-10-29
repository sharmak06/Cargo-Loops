# Cargo Loop

Build a modern, responsive logistics SaaS web app called CargoLoop with the tagline “Turn Empty Trips Into Earning Trips.”

CargoLoop helps transporters monetize empty return truck capacity by matching it with verified businesses needing transport. It does NOT replace existing transporter apps or trusted customers.

1. Landing Page

Hero: “Your truck is already going there. Why return empty?”

Explain CargoLoop in 3 steps:

Detect empty return

Find matching cargo

Earn from return trip

Buttons: Get Started / Login

2. Signup/Login

Role selection:

🚛 Transporter

🏢 Business

Transporter signup: Full Name, Mobile, Email, Password, Company/Transporter Name, Business Type, Office Address, City, State, PIN, GST Number + Verify GST, PAN, Registration/CIN, Number of Vehicles, Preferred Routes, Vehicle Types, document uploads (GST, PAN, RC, Insurance).

Business signup: Contact Person, Designation, Mobile, Email, Password, Company Name, Business Type, GST + Verify, PAN, CIN/Registration, Industry, Registered Office, Pickup Locations, GST/PAN/Registration document uploads.

Use OTP/email verification and show verification badges. Mask sensitive information such as GST, PAN and bank details.

3. Transporter Dashboard

Show:

Fleet

Active Trips

Available Return Capacity

Additional Revenue

Empty Trips Prevented

Add truck with: Registration Number, Vehicle Type, Capacity, Current Location, Driver Details, RC/Insurance/PUC documents.

Show AI Empty Return Prediction, e.g.:

Pune → Mumbai
Return: Mumbai → Pune
Capacity: 5 Tons
Empty Probability: 87%
Find Backhaul

4. Smart Matching

Match trucks and shipments using:

Route

Capacity

Time

Vehicle type

Pickup distance

Business reliability

Display a Match Score, e.g. 96% Match.

Example:
Mumbai → Pune | 2 Tons | ABC Manufacturing | ₹4,500 | GST Verified ✅ | ⭐4.8

Buttons: View / Accept Load

5. Business Dashboard

Allow businesses to Post Shipment with:
Pickup, Delivery, Cargo Type, Weight, Packages, Vehicle Type, Pickup Date/Time, Deadline, Budget.

Show recommended verified transporters with price, capacity, rating and truck details.

6. Booking + Tracking

Create:

Booking confirmation

Shipment status: Confirmed → Picked Up → In Transit → Delivered

Map/route tracking

Driver/truck details

ETA

Proof of Delivery upload

Mock secure payment and payment release

7. Profiles & Trust

Transporter profile:
Company Name, Owner, GST Verified, Location, Fleet Size, Successful Deliveries, Rating.

Business profile:
Company Name, GST Verified, Industry, Location, Successful Shipments, Rating, Payment Reliability.

Add ratings/reviews and Verified/Trusted badges.

8. Admin Dashboard

Show:
Total Users, Transporters, Businesses, Trucks, Active Shipments, Successful Matches, Empty Trips Prevented, Revenue, Estimated CO₂ Saved.

9. Tech/UI

Use React/Next.js, TypeScript, Tailwind CSS, Supabase if available, and Recharts. Use realistic mock data if APIs are unavailable.

Make it look like a professional Indian logistics-tech startup, not a basic college project.

Main USP

“CargoLoop does not replace existing logistics networks. It monetizes the unused capacity left after existing commitments.”

Demo flow:

Pune → Mumbai delivery → 87% empty-return prediction → Mumbai → Pune cargo found → 96% match → transporter accepts → booking → tracking → delivery → ₹4,500 additional revenue.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0b5d574e-d8a7-4179-82c3-2db1d42322fe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

### Database and demo login

There is no local database. Real user authentication and profile records use Supabase; the profile
table and row-level security policy are in `supabase/migrations/`. Fleet changes, bookings, posted
shipments, and bank details are saved in browser local storage. Marketplace examples and dashboard
metrics use mock data.

To enable Supabase locally, copy `.env.example` to `.env` and set the URL and publishable key from
your Supabase project. Never commit `.env` or a service-role key.

For a frontend demo without creating Supabase users, choose a role on the login page and use either
public sample account:

| Role        | Email                           | Password             |
| ----------- | ------------------------------- | -------------------- |
| Transporter | `demo.transporter@cargoloop.in` | `CargoLoopDemo2026!` |
| Business    | `demo.business@cargoloop.in`    | `CargoLoopDemo2026!` |

These demo accounts are intentionally public and are not suitable for real or sensitive data.

## Shipment maps

The Booking & Tracking page renders an interactive OpenStreetMap map with pickup and delivery
markers, a driving route, route distance, and estimated driving time. Common Indian cities use
bundled coordinates; other locations are resolved with Photon. Routes are requested from the
public OSRM demo service. Map tiles and geocoding/routing services require an internet connection.

In demo mode, the truck marker automatically animates along the route over 90 seconds and can be
paused or replayed. This is simulated presentation data: the project does not yet receive GPS
updates from a driver or carrier. Before production use, configure appropriately licensed,
capacity-planned geocoding/routing/tile services and connect an authenticated driver or carrier
location feed. Do not treat the demo marker or ETA as a live vehicle position.

# Cargo-Loop-Main

# Cargo-Loops
